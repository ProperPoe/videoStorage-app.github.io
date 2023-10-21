import { Request, Response } from "express";
// import { db } from "../connect";
import { db } from "../connects";
import jwt from "jsonwebtoken";
import moment from "moment";



class CommentController {
    public getComment(req: Request, res: Response): void {       
        const q =  `SELECT comments.*, userId, username, profilePic FROM comments JOIN users ON (users.id = comments.userId) WHERE comments.postId = ? ORDER BY comments.createdAt DESC`;
    
        db.query(q, [req.query.postId], (err, data) => {
            if(err) return res.status(500).json(err)
            return res.status(200).json(data)
        });


    };
    public postComment(req: Request, res: Response): void {        
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
            const q =  "INSERT INTO comments (`desc`, `createdAt`, `userId`, `postId`) VALUES (?)";

            const values = [req.body.desc, moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"), userInfo.id, req.body.postId]
    
            db.query(q, [values], (err, data) => {
                if(err) return res.status(500).json(err)
                return res.status(200).json("Comment created!")
            });
        });


    };
}

export default new CommentController()