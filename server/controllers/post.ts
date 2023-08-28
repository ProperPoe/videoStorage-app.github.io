import { Request, Response } from "express";
import { db } from "../connect";
import jwt from "jsonwebtoken";
import moment from "moment";

class PostController {
    public getPost(req: Request, res: Response): void {
        const token = req.cookies.accessToken;
        if(!token){
            res.status(401).json("Not logged in");
            return;
        } 

        jwt.verify(token, "theKey", (err: jwt.VerifyErrors | null, userInfo:any) => {
            if(err){
                res. status(403).json("Token is not valid");
                return; 
            } 
            const q =  `SELECT posts.*, userId, username FROM posts JOIN users ON (users.id = posts.userId) ORDER BY createdAt DESC`;
    
            db.query(q, [userInfo.id], (err, data) => {
                if(err) return res.status(500).json(err)
                return res.status(200).json(data)
            });
        });


    };
    public addPost(req: Request, res: Response): void {
        const token = req.cookies.accessToken;
        if(!token){
            res.status(401).json("Not logged in");
            return;
        } 

        jwt.verify(token, "theKey", (err: jwt.VerifyErrors | null, userInfo:any) => {
            if(err){
                res. status(403).json("Token is not valid");
                return; 
            } 
            const q =  "INSERT INTO posts (`desc`, `createdAt`, `userId`) VALUES (?)";

            const values = [req.body.desc, moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"), userInfo.id]
    
            db.query(q, [values], (err, data) => {
                if(err) return res.status(500).json(err)
                return res.status(200).json("post created!")
            });
        });


    };
    
}

export default new PostController()