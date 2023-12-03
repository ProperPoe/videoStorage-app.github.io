import { Request, Response } from "express";
// import { db } from "../connect";
import pool  from "../connects";
import jwt from "jsonwebtoken"
import { ResultSetHeader, RowDataPacket } from "mysql2";

class LikeController {
    public async getLikes(req: Request, res: Response): Promise<void> {
        try {
            const q = "SELECT userId FROM likes WHERE postId = ?";
            const [rows] = await pool.query<RowDataPacket[]>(q, [req.query.postId]);

            const userIds = rows.map((like) => like.userId);
            res.status(200).json(userIds);
            return 
        } catch (err) {
            console.error("Error fetching likes:", err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    public addLikes(req: Request, res: Response): void {
        const token = req.cookies.accessToken;
    
        if (!token) {
          res.status(401).json("Not logged in!");
          return;
        }
    
        jwt.verify(token, "theKey", async (err: jwt.VerifyErrors | null, userInfo: any) => {
          if (err) {
            res.status(403).json("Token is not valid!");
            return;
          }
    
          try {
            const q = "INSERT INTO likes(`userId`, `postId`) VALUES (?, ?)";
    
            const values = [userInfo.id, req.body.postId];
            const [data] = await pool.query<ResultSetHeader>(q, values);
    
            res.status(200).json("Post has been liked!");
          } catch (error) {
            res.status(500).json(error);
          }
        });
      }
      public deleteLikes(req: Request, res: Response): void {
        const token = req.cookies.accessToken;
    
        if (!token) {
          res.status(401).json("Not logged in!");
          return;
        }
    
        jwt.verify(token, "theKey", async (err: jwt.VerifyErrors | null, userInfo: any) => {
          if (err) {
            res.status(403).json("Token is not valid!");
            return;
          }
    
          try {
            const q = "DELETE FROM likes WHERE `userId` = ? AND `postId` = ?";
            const values = [userInfo.id, req.query.postId];
    
            const [data] = await pool.query<ResultSetHeader>(q, values);
    
            res.status(200).json("Post has been unliked!");
          } catch (error) {
            res.status(500).json(error);
          }
        });
      }
}

export default new LikeController()