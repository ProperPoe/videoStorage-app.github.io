import { Request, Response } from "express";
// import { db } from "../connect";
import pool from "../connects";
import jwt, {VerifyErrors} from "jsonwebtoken";
import s3 from "../aws";
import moment from "moment";
import { RowDataPacket, ResultSetHeader, PoolConnection } from "mysql2";

interface PostData extends RowDataPacket {
    id: number;
    userId: number
  }

class PostController {
    public async getPost(req: Request, res: Response): Promise<void> {
        const token = req.cookies.accessToken;
        if (!token) {
          res.status(401).json("Not logged in");
          return;
        }
    
        try {
          const userInfo: any = jwt.verify(token, "theKey");
    
          const q = `
            SELECT
              posts.*,
              users.id AS userId,
              users.username,
              users.profilePic,
              COUNT(DISTINCT likes.id) AS likesCount,
              COUNT(DISTINCT comments.id) AS commentsCount
            FROM posts
            LEFT JOIN users ON users.id = posts.userId
            LEFT JOIN likes ON likes.postId = posts.id
            LEFT JOIN comments ON comments.postId = posts.id
            GROUP BY posts.id
            ORDER BY posts.createdAt DESC
          `;
    
          const [data] = await pool.query<RowDataPacket[]>(q);
    
          // Type assertion for data
          const postData: PostData[] = data as PostData[];
          res.status(200).json(postData);
        } catch (err) {
          if (err instanceof jwt.JsonWebTokenError) {
            res.status(403).json("Token is not valid");
          } else {
            res.status(500).json(err);
          }
        }
      }
      public async addPost(req: Request, res: Response): Promise<Response> {
        return new Promise(async (resolve, reject) => {
          if (!req.file) {
            return res.status(400).json('No file uploaded');
          }
    
          const token = req.cookies.accessToken;
          if (!token) {
            return res.status(401).json("Not logged in");
          }
    
          jwt.verify(token, "theKey", async (err: jwt.VerifyErrors | null, userInfo: any) => {
            if (err) {
              return res.status(403).json("Token is not valid");
            }
    
            if (!req.file) {
              return res.status(400).json('what');
            }
    
            // S3 parameters
            const params = {
              Bucket: 'videostorage-app',
              Key: `user_${userInfo.id}_${Date.now()}_${req.file.originalname}`,
              Body: req.file.buffer,
              ContentType: req.file.mimetype,
              ContentDisposition: 'inline',
            };
    
            try {
              await s3.upload(params).promise();
    
              const s3Url = `https://videostorage-app.s3.amazonaws.com/${params.Key}`;
    
              const q = "INSERT INTO posts (`desc`, `mediaType`, `mediaUrl`, `userId`, `createdAt`) VALUES (?)";
    
              const values = [req.body.desc, req.file.mimetype.startsWith('image/') ? 'image' : 'video', s3Url, userInfo.id, moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")];
    
              const [data] = await pool.query<ResultSetHeader>(q, [values]);
    
              return res.status(200).json("post created!");
            } catch (error) {
              console.error('Error uploading file to S3:', error);
              return res.status(500).json(error);
            }
          });
        });
      }
      public async deletePost(req: Request, res: Response): Promise<void> {
        const token = req.cookies.accessToken;
        if (!token) {
            res.status(401).json("Not logged in");
            return;
        }
    
        try {
            const userInfo: any = jwt.verify(token, "theKey");
    
            const q = "SELECT userId, mediaUrl FROM posts WHERE id = ?";
            const [postData] = await pool.query<RowDataPacket[]>(q, [req.params.id]);
    
            if (postData.length === 0) {
                res.status(404).json("Post not found");
                return;
            }
    
            const postUserId = postData[0].userId;
    
            if (userInfo.id !== postUserId) {
                res.status(403).json("You can only delete your post!");
                return;
            }
    
            const s3Key = `user_${postUserId}_${req.params.id}`;
            const s3Params = {
                Bucket: "videostorage-app",
                Key: s3Key,
            };
    
            // Use pool.execute with a SQL string or options object
            const deletePostQuery: string = "DELETE FROM posts WHERE id = ?";
            const [deleteResult] = await pool.execute<ResultSetHeader>(deletePostQuery, [req.params.id]);
    
            // Delete file from S3 if the database operation was successful
            if (deleteResult.affectedRows > 0) {
                await s3.deleteObject(s3Params).promise();
                res.status(200).json("Post deleted!");
            } else {
                res.status(404).json("Post not found");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            res.status(500).json(error);
        }
    }
      public async updatePost(req: Request, res: Response): Promise<void> {
        const token = req.cookies.accessToken;
        if (!token) {
          res.status(401).json("Not logged in");
          return;
        }
    
        try {
          const userInfo: any = jwt.verify(token, "theKey");
    
          const q = "SELECT userId FROM posts WHERE id = ?";
          const [postData] = await pool.query<RowDataPacket[]>(q, [req.params.id]);
    
          if (postData.length === 0) {
            res.status(404).json("Post not found");
            return 
          }
    
          const postUserId = postData[0].userId;
    
          if (userInfo.id !== postUserId) {
            res.status(403).json("You can only update your post!");
            return 
          }
    
          const updatePostQuery = "UPDATE posts SET `desc`=? WHERE `id`=?";
          const [data] = await pool.query(updatePostQuery, [req.body.desc, req.params.id]);
    
          if (typeof data === "object" && "affectedRows" in data && data.affectedRows !== undefined && data.affectedRows > 0) {
            res.status(200).json("Post updated!");
            return 
          }
    
          res.status(500).json("Failed to update post");
          return 
        } catch (error) {
          console.error("Error updating post:", error);
          res.status(500).json(error);
          return 
        }
      }

      public async getPostsByUser(req: Request, res: Response): Promise<void> {
        const token = req.cookies.accessToken;
    
        if (!token) {
          res.status(401).json("Not logged in");
          return;
        }
    
        try {
          const userInfo: any = jwt.verify(token, "theKey");
    
          const userId = req.params.userId;
    
          const q = `
            SELECT
              posts.*,
              users.id AS userId,
              users.username,
              users.profilePic,
              COUNT(DISTINCT likes.id) AS likesCount,
              COUNT(DISTINCT comments.id) AS commentsCount
            FROM posts
            LEFT JOIN users ON users.id = posts.userId
            LEFT JOIN likes ON likes.postId = posts.id
            LEFT JOIN comments ON comments.postId = posts.id
            WHERE posts.userId = ?
            GROUP BY posts.id
            ORDER BY createdAt DESC;
          `;
    
          const [data] = await pool.query<RowDataPacket[]>(q, [userId]);
    
          // Type assertion for data
          const postData: PostData[] = data as PostData[];
    
          res.status(200).json(postData);
        } catch (err) {
          if (err instanceof jwt.JsonWebTokenError) {
            res.status(403).json("Token is not valid");
          } else {
            res.status(500).json(err);
          }
        }
      }

      public async getPostById(req: Request, res: Response): Promise<void> {
        const token = req.cookies.accessToken;
    
        if (!token) {
          res.status(401).json("Not logged in");
          return;
        }
    
        try {
          const userInfo: any = jwt.verify(token, "theKey");
    
          const postId = req.params.id;
    
          // Query to fetch the post data by postId, including the updated description
          const q = "SELECT * FROM posts WHERE `id` = ? LIMIT 1";
    
          const [data] = await pool.query<RowDataPacket[]>(q, [postId]);
    
          if (data && data.length > 0) {
            const post: PostData = data[0] as PostData;
    
            // Check if the user requesting this post is the owner
            if (post.userId === userInfo.id) {
              res.status(200).json(post);
            } else {
              res.status(403).json("You can only access your own post!");
            }
          } else {
            res.status(404).json("Post not found");
          }
        } catch (err) {
          if (err instanceof jwt.JsonWebTokenError) {
            res.status(403).json("Token is not valid");
          } else {
            res.status(500).json(err);
          }
        }
      }
}
// export default new PostController()
export default new PostController()