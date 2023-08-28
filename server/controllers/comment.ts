import { Request, Response } from "express";
import { db } from "../connect";



class CommentController {
    public getComment(req: Request, res: Response): void {        const token = req.cookies.accessToken;
        const q =  `SELECT comments.*, userId, username FROM comments JOIN users ON (users.id = comments.userId) WHERE comments.postId = ? ORDER BY comments.createdAt DESC`;
    
        db.query(q, [req.query.postId], (err, data) => {
            if(err) return res.status(500).json(err)
            return res.status(200).json(data)
        });


    };
}

export default new CommentController()