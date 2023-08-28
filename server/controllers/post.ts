import { Request, Response } from "express";
import { db } from "../connect";

class PostController {
    public getPost(req: Request, res: Response): void {
        const q =  `SELECT posts.*, userId, username FROM posts JOIN users ON (users.id = posts.userId)`;

        db.query(q, (err, data) => {
            if(err) return res.status(500).json(err)
            return res.status(200).json(data)
        })

    }
}

export default new PostController()