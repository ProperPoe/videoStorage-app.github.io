"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { db } from "../connect";
const connects_1 = __importDefault(require("../connects"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const aws_1 = __importDefault(require("../aws"));
const moment_1 = __importDefault(require("moment"));
class PostController {
    getPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.cookies.accessToken;
            if (!token) {
                res.status(401).json("Not logged in");
                return;
            }
            try {
                const userInfo = jsonwebtoken_1.default.verify(token, "theKey");
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
                const [data] = yield connects_1.default.query(q);
                // Type assertion for data
                const postData = data;
                res.status(200).json(postData);
            }
            catch (err) {
                if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                    res.status(403).json("Token is not valid");
                }
                else {
                    res.status(500).json(err);
                }
            }
        });
    }
    addPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                if (!req.file) {
                    return res.status(400).json('No file uploaded');
                }
                const token = req.cookies.accessToken;
                if (!token) {
                    return res.status(401).json("Not logged in");
                }
                jsonwebtoken_1.default.verify(token, "theKey", (err, userInfo) => __awaiter(this, void 0, void 0, function* () {
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
                        yield aws_1.default.upload(params).promise();
                        const s3Url = `https://videostorage-app.s3.amazonaws.com/${params.Key}`;
                        const q = "INSERT INTO posts (`desc`, `mediaType`, `mediaUrl`, `userId`, `createdAt`) VALUES (?)";
                        const values = [req.body.desc, req.file.mimetype.startsWith('image/') ? 'image' : 'video', s3Url, userInfo.id, (0, moment_1.default)(Date.now()).format("YYYY-MM-DD HH:mm:ss")];
                        const [data] = yield connects_1.default.query(q, [values]);
                        return res.status(200).json("post created!");
                    }
                    catch (error) {
                        console.error('Error uploading file to S3:', error);
                        return res.status(500).json(error);
                    }
                }));
            }));
        });
    }
    deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.cookies.accessToken;
            if (!token) {
                res.status(401).json("Not logged in");
                return;
            }
            try {
                const userInfo = jsonwebtoken_1.default.verify(token, "theKey");
                const q = "SELECT userId, mediaUrl FROM posts WHERE id = ?";
                const [postData] = yield connects_1.default.query(q, [req.params.id]);
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
                const deletePostQuery = "DELETE FROM posts WHERE id = ?";
                const [deleteResult] = yield connects_1.default.execute(deletePostQuery, [req.params.id]);
                // Delete file from S3 if the database operation was successful
                if (deleteResult.affectedRows > 0) {
                    yield aws_1.default.deleteObject(s3Params).promise();
                    res.status(200).json("Post deleted!");
                }
                else {
                    res.status(404).json("Post not found");
                }
            }
            catch (error) {
                console.error("Error deleting post:", error);
                res.status(500).json(error);
            }
        });
    }
    updatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.cookies.accessToken;
            if (!token) {
                res.status(401).json("Not logged in");
                return;
            }
            try {
                const userInfo = jsonwebtoken_1.default.verify(token, "theKey");
                const q = "SELECT userId FROM posts WHERE id = ?";
                const [postData] = yield connects_1.default.query(q, [req.params.id]);
                if (postData.length === 0) {
                    res.status(404).json("Post not found");
                    return;
                }
                const postUserId = postData[0].userId;
                if (userInfo.id !== postUserId) {
                    res.status(403).json("You can only update your post!");
                    return;
                }
                const updatePostQuery = "UPDATE posts SET `desc`=? WHERE `id`=?";
                const [data] = yield connects_1.default.query(updatePostQuery, [req.body.desc, req.params.id]);
                if (typeof data === "object" && "affectedRows" in data && data.affectedRows !== undefined && data.affectedRows > 0) {
                    res.status(200).json("Post updated!");
                    return;
                }
                res.status(500).json("Failed to update post");
                return;
            }
            catch (error) {
                console.error("Error updating post:", error);
                res.status(500).json(error);
                return;
            }
        });
    }
    getPostsByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.cookies.accessToken;
            if (!token) {
                res.status(401).json("Not logged in");
                return;
            }
            try {
                const userInfo = jsonwebtoken_1.default.verify(token, "theKey");
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
                const [data] = yield connects_1.default.query(q, [userId]);
                // Type assertion for data
                const postData = data;
                res.status(200).json(postData);
            }
            catch (err) {
                if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                    res.status(403).json("Token is not valid");
                }
                else {
                    res.status(500).json(err);
                }
            }
        });
    }
    getPostById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.cookies.accessToken;
            if (!token) {
                res.status(401).json("Not logged in");
                return;
            }
            try {
                const userInfo = jsonwebtoken_1.default.verify(token, "theKey");
                const postId = req.params.id;
                // Query to fetch the post data by postId, including the updated description
                const q = "SELECT * FROM posts WHERE `id` = ? LIMIT 1";
                const [data] = yield connects_1.default.query(q, [postId]);
                if (data && data.length > 0) {
                    const post = data[0];
                    // Check if the user requesting this post is the owner
                    if (post.userId === userInfo.id) {
                        res.status(200).json(post);
                    }
                    else {
                        res.status(403).json("You can only access your own post!");
                    }
                }
                else {
                    res.status(404).json("Post not found");
                }
            }
            catch (err) {
                if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                    res.status(403).json("Token is not valid");
                }
                else {
                    res.status(500).json(err);
                }
            }
        });
    }
}
// export default new PostController()
exports.default = new PostController();
