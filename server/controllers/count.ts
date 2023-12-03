import { Request, Response } from "express";
// import { db } from "../connect";
import pool from "../connects";
import jwt from "jsonwebtoken"
import { OkPacket, RowDataPacket, ResultSetHeader } from "mysql2";

class CountController {
    public async getCount(req: Request, res: Response): Promise<void> {
        const token = req.cookies.accessToken;
    
        if (!token) {
          res.status(401).json("Invalid token");
          return;
        }
    
        jwt.verify(token, "theKey", async (err: jwt.VerifyErrors | null, userInfo: any) => {
          if (err) {
            return res.status(403).json("User not logged in");
          }
    
          try {
            const q = "SELECT COUNT(*) AS notificationCount FROM notify WHERE toUserId = ?";
            const [result] = await pool.query<RowDataPacket[]>(q, [userInfo.id]);
    
            if (result && result.length > 0) {
              const notificationCount = result[0].notificationCount;
              return res.status(200).json({ notificationCount });
            } else {
              return res.status(404).json("No notifications found");
            }
          } catch (error) {
            console.error("Error fetching notification count:", error);
            res.status(500).json(error);
          }
        });
      }
      
      public async addCount(req: Request, res: Response): Promise<void> {
        const token = req.cookies.accessToken;
    
        if (!token) {
          res.status(401).json("Invalid token");
          return;
        }
    
        try {
          const userInfo = await new Promise<any>((resolve, reject) => {
            jwt.verify(token, "theKey", (err: jwt.VerifyErrors | null, userInfo: any) => {
              if (err) reject(err);
              resolve(userInfo);
            });
          });
    
          const q = "INSERT INTO notify (toUserId, postId, type, fromUserId) VALUES (?)";
          const values = [req.body.toUserId, req.body.postId, req.body.type, req.body.fromUserId];
    
          const [data] = await pool.query<RowDataPacket[]>(q, [values]);
    
          res.status(200).json(data);
        } catch (err) {
          console.error("Error adding count:", err);
          res.status(500).json(err);
        }
      }
      public async deleteCount(req: Request, res: Response): Promise<void> {
        const token = req.cookies.accessToken;
    
        if (!token) {
          res.status(401).json("Not logged in!");
          return;
        }
    
        try {
          const userInfo = await new Promise<any>((resolve, reject) => {
            jwt.verify(token, "theKey", (err: jwt.VerifyErrors | null, userInfo: any) => {
              if (err) reject(err);
              resolve(userInfo);
            });
          });
    
          const q = "DELETE FROM notify WHERE postId = ? AND type = ? AND fromUserId = ?";
          const values = [req.query.postId, req.query.type, req.query.fromUserId];
    
          const [data] = await pool.query<RowDataPacket[]>(q, values);
    
          res.status(200).json(data);
        } catch (err) {
          console.error("Error deleting count:", err);
          res.status(500).json(err);
        }
      }
}

export default new CountController()