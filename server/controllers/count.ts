import { Request, Response } from "express";
// import { db } from "../connect";
import db from "../connects";
import jwt from "jsonwebtoken"
import { OkPacket, RowDataPacket } from "mysql2";

class CountController {
    public getCount(req: Request, res: Response): void {
        const token = req.cookies.accessToken

        if(!token){
            res.status(401).json("Invalid token") 
            return
        }
            
    
        jwt.verify(token, "theKey", (err: jwt.VerifyErrors | null, userInfo:any) => {
            if(err) return res.status(403).json("User not logged in")
    
            const q = "SELECT COUNT(*) AS notificationCount FROM notify WHERE toUserId = ?";
            db.query(q, [userInfo.id], (err, data: RowDataPacket[]) => {
                if (err) return res.status(500).json(err)
    
                return res.status(200).json(data)
            })
        })
    }
    public addCount(req: Request, res: Response): void {
        const token = req.cookies.accessToken

        if(!token){
            res.status(401).json("Invalid token") 
            return
        }
            
    
        jwt.verify(token, "theKey", (err: jwt.VerifyErrors | null, userInfo:any) => {
            if(err) return res.status(403).json("User not logged in")
    
            const q = "INSERT INTO notify (toUserId, postId, type, fromUserId) VALUES (?)"
            
            const values = [req.body.toUserId, req.body.postId, req.body.type, req.body.fromUserId]
            db.query(q, [values], (err, data: RowDataPacket[]) => {
                if (err) return res.status(500).json(err)
    
                return res.status(200).json(data)
            })
        })
    }
    public deleteCount(req: Request, res: Response): void {
        const token = req.cookies.accessToken;

        if(!token){
            res.status(401).json("Not logged in!");
            return;
        }
    
        jwt.verify(token, "theKey", (err: jwt.VerifyErrors | null, userInfo:any) => {
            if(err){
                return res.status(403).json("Token is not valid!")
            }
        
    
            const q = "DELETE FROM notify WHERE postId = ? AND type = ? AND fromUserId = ?";
            const values = [req.query.postId, req.query.type, req.query.fromUserId];
    
            db.query(q, values, (err, data) => {
                if(err){
                    return res.status(500).json(err)
                }
            
                return res.status(200).json(data)
            })
        })
    }
}

export default new CountController()