import { Request, Response } from "express";
import jwt from "jsonwebtoken"
import { OkPacket, RowDataPacket } from "mysql2";
// import { db } from "../connect";
import pool from "../connects";
import moment from "moment";


class NotifController {
    public getNotif(req: Request, res: Response): void {
        const token = req.cookies.accessToken;
    
        if (!token) {
          res.status(401).json("Invalid token");
          return;
        }
    
        jwt.verify(token, "theKey", async (err: jwt.VerifyErrors | null, userInfo: any) => {
          if (err) return res.status(403).json("User not logged in");
    
          try {
            const q =
              "SELECT notifs.*, users.username, users.profilePic FROM notifs JOIN users ON users.id = notifs.fromUserId WHERE notifs.toUserId = ? ORDER BY createdAt DESC";
    
            const [rows] = await pool.query<RowDataPacket[]>(q, [userInfo.id]);
    
            return res.status(200).json(rows);
          } catch (error) {
            console.error("Error fetching notifications:", error);
            res.status(500).json({ error: "Internal Server Error" });
          }
        });
      }
      public addNotif(req: Request, res: Response): void {
        const token = req.cookies.accessToken;
    
        if (!token) {
          res.status(401).json("Invalid token");
          return;
        }
    
        jwt.verify(token, "theKey", async (err: jwt.VerifyErrors | null, userInfo: any) => {
          if (err) return res.status(403).json("User not logged in");
    
          const q =
            "INSERT INTO notifs (toUserId, fromUserId, postId, commentId, likeId, type, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)";
          const values = [
            req.body.toUserId,
            req.body.fromUserId,
            req.body.postId,
            req.body.commentId,
            req.body.likeId,
            req.body.type,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
          ];
    
          try {
            const [data] = await pool.query<RowDataPacket[]>(q, values);
            return res.status(200).json(data);
          } catch (error) {
            console.error("Error adding notification:", error);
            return res.status(500).json(error);
          }
        });
      }

      public async deleteNotif(req: Request, res: Response): Promise<void> {
        try {
          const token = req.cookies.accessToken;
    
          if (!token) {
            res.status(401).json("Not logged in!");
            return;
          }
    
          const decodedToken = jwt.verify(token, "theKey") as { id: number };
    
          const q = "DELETE FROM notifs WHERE `postId` = ? AND `fromUserId` = ? AND `type` = 'like'";
    
          const values = [req.query.postId, req.query.fromUserId];
    
          const [data] = await pool.query(q, values);
    
          res.status(200).json("Notification has been deleted!");
        } catch (error) {
          console.error("Error deleting notification:", error);
          res.status(500).json(error);
        }
      }
}

export default new NotifController()