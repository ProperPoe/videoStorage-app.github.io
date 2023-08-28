import { Request, Response } from "express";
import { db } from "../connect";
import jwt from "jsonwebtoken"
import { OkPacket, RowDataPacket } from "mysql2";

class LikeController {
    public getLikes(req: Request, res: Response): void {
        const q = "SELECT userId FROM likes WHERE postId = ?";

        db.query(q, [req.query.postId], (err, data: RowDataPacket[]) => {
            if(err){
                return res.status(500).json(err)
            }
            
            return res.status(200).json(data.map(like=>like.userId))
        })
    
    }
    public addLikes(req: Request, res: Response): void {
        const token = req.cookies.accessToken;

        if(!token){
            res.status(401).json("Not logged in!");
            return;
        }
    
        jwt.verify(token, "theKey", (err: jwt.VerifyErrors | null, userInfo:any) => {
            if(err){
                return res.status(403).json("Token is not valid!")
            }
        
    
            const q = "INSERT INTO likes(`userId`, `postId`) VALUES (?)";
    
            const values = [
                userInfo.id,
                req.body.postId
            ]
            db.query(q, [values], (err, data) => {
                if(err){
                    return res.status(500).json(err)
                }
            
                return res.status(200).json("Post has been liked!")
            })
        })
    }
    public deleteLikes(req: Request, res: Response): void {
        const token = req.cookies.accessToken;

        if(!token){
            res.status(401).json("Not logged in!");
            return;
        }
    
        jwt.verify(token, "theKey", (err: jwt.VerifyErrors | null, userInfo:any) => {
            if(err){
                return res.status(403).json("Token is not valid!")
            }
        
    
            const q = "DELETE FROM likes WHERE `userId` = ? AND `postId` = ?";
    
            const values = [
                userInfo.id,
                req.body.postId
            ]
            db.query(q, [userInfo.id, req.query.postId], (err, data) => {
                if(err){
                    return res.status(500).json(err)
                }
            
                return res.status(200).json("Post has been unliked!")
            })
        })
    }
}

export default new LikeController()