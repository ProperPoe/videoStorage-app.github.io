import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
// import { pool } from "../connect";
import pool from "../connects";
import { OkPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import s3 from "../aws";

class UserController {
  public async getUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const q = "SELECT * FROM users WHERE id=?";
  
      const [rows] = await pool.query<RowDataPacket[]>(q, [userId]);
  
      if (rows.length === 0) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
  
      // Omit the password field from the response
      const { password, ...info } = rows[0];
  
      res.json(info);
    } catch (err) {
      console.error("Error fetching user:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  public async updateUser(req: Request, res: Response): Promise<void> {
    try {
      if (!req.body.username) {
        res.status(400).json("Field cannot be empty!");
        return 
      }

      const token = req.cookies.accessToken;
      if (!token) {
        res.status(401).json("Not logged in");
        return;
      }

      jwt.verify(token, "theKey", async (err: jwt.VerifyErrors | null, userInfo: any) => {
        if (err) {
          res.status(403).json("Token is not valid");
          return;
        }

        try {
          // Check if a new profilePic file was uploaded
          if (req.file) {
            // S3 parameters for the profilePic upload
            const s3Params = {
              Bucket: "videostorage-app", // Replace with your S3 bucket name
              Key: `user_${userInfo.id}_${Date.now()}_${req.file.originalname}`,
              Body: req.file.buffer,
              ContentType: req.file.mimetype,
              ContentDisposition: "inline",
            };

            // Upload the new profilePic to S3
            await s3.upload(s3Params).promise();

            // Update the user's profilePic URL in the database
            const profilePicUrl = `https://${s3Params.Bucket}.s3.amazonaws.com/${s3Params.Key}`;
            
            const q = "UPDATE users SET `username`=?, `profilePic`=? WHERE `id`=?";
            const [data] = await pool.query<ResultSetHeader>(q, [req.body.username, profilePicUrl, userInfo.id]);

            if (data.affectedRows > 0) {
              return res.status(200).json("User profile updated!");
            }

            return res.status(403).json("You can only update your profile!");
          } else {
            // No new profilePic uploaded, only update the username
            const q = "UPDATE users SET `username`=? WHERE `id`=?";
            const [data] = await pool.query<ResultSetHeader>(q, [req.body.username, userInfo.id]);

            if (data.affectedRows > 0) {
              return res.status(200).json("Username updated!");
            }

            return res.status(403).json("You can only update your profile!");
          }
        } catch (error) {
          console.error("Error uploading profilePic to S3:", error);
          res.status(500).json(error);
        }
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }



      
  public async getNav(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const q = "SELECT id, username, profilePic FROM users WHERE id=?";
  
      const [rows] = await pool.query<RowDataPacket[]>(q, [userId]);
  
      if (rows.length === 0) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
  
      // Extract necessary fields for navigation
      const { ...info } = rows[0];
  
      res.json(info);
    } catch (err) {
      console.error("Error fetching user for navigation:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
}
}

export default new UserController()