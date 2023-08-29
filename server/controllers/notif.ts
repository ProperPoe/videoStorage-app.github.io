import { Request, Response } from "express";
import jwt from "jsonwebtoken"
import { OkPacket, RowDataPacket } from "mysql2";
import { db } from "../connect";


class NotifController {
    public getNotif(req: Request, res: Response): void {
        const token = req.cookies.accessToken

        if(!token){
            res.status(401).json("Invalid token") 
            return
        }
            
    
        jwt.verify(token, "theKey", (err: jwt.VerifyErrors | null, userInfo:any) => {
            if(err) return res.status(403).json("User not logged in")
    
            const q = "SELECT notifs.*, users.username FROM notifs JOIN users ON users.id = notifs.fromUserId WHERE notifs.toUserId = ?";
            db.query(q, [userInfo.id], (err, data: RowDataPacket[]) => {
                if (err) return res.status(500).json(err)
    
                return res.status(200).json(data)
            })
        })
    }
    public addNotif(req: Request, res: Response): void {
        const token = req.cookies.accessToken

        if(!token){
            res.status(401).json("Invalid token") 
            return
        }
            
    
        jwt.verify(token, "theKey", (err: jwt.VerifyErrors | null, userInfo:any) => {
            if(err) return res.status(403).json("User not logged in")
    
            const q = "INSERT INTO notifs (`userId`, `postId`, `commentId`, `likeId`) VALUES (?)"
            const values = [userInfo.id, req.body.postId, req.body.commentId, req.body.likeId]
            db.query(q, [values], (err, data: RowDataPacket[]) => {
                if (err) return res.status(500).json(err)
    
                return res.status(200).json(data)
            })
        })
    }
}

export default new NotifController()