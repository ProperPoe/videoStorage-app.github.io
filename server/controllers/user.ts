import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
// import { db } from "../connect";
import { db } from "../connects";
import { OkPacket, RowDataPacket } from "mysql2";
import s3 from "../aws";

class UserController {
    public getUser(req: Request, res: Response): void {
        const userId = req.params.userId;
        const q = "SELECT * FROM users WHERE id=?";

        db.query(q, [userId], (err, data: RowDataPacket[]) =>{
            if(err) return res.status(500).json(err);
            const { password, ...info } = data[0];
            return res.json(info)
        })
    }
    public updateUser(req: Request, res: Response): Promise<Response> {
      return new Promise((resolve, reject)=> {
        if (!req.body.username) {
          return res.status(400).json("Field cannot be empty!");
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
              // Define S3 parameters for the profilePic upload
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
              db.query(q, [req.body.username, profilePicUrl, userInfo.id], (err, data) => {
                if (err) {
                  return res.status(500).json(err);
                }
    
                if (typeof data === "object" && "affectedRows" in data && data.affectedRows !== undefined && data.affectedRows > 0) {
                  return res.status(200).json("User profile updated!");
                }
    
                return res.status(403).json("You can only update your profile!");
              });
            } else {
              // No new profilePic uploaded, only update the username
              const q = "UPDATE users SET `username`=? WHERE `id`=?";
              db.query(q, [req.body.username, userInfo.id], (err, data) => {
                if (err) {
                  return res.status(500).json(err);
                }
    
                if (typeof data === "object" && "affectedRows" in data && data.affectedRows !== undefined && data.affectedRows > 0) {
                  return res.status(200).json("Username updated!");
                }
    
                return res.status(403).json("You can only update your profile!");
              });
            }
          } catch (error) {
            console.error("Error uploading profilePic to S3:", error);
            res.status(500).json(error);
          }
        });
      })



      }
      public getNav(req: Request, res: Response): void {
        const userId = req.params.userId;
        const q = "SELECT * FROM users WHERE id=?";

        db.query(q, [userId], (err, data: RowDataPacket[]) =>{
            if(err) return res.status(500).json(err);
            const { password, ...info } = data[0];
            return res.json(info)
        })
    }
}

export default new UserController()