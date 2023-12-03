import { Request, Response } from "express";
import pool from "../connects";
import jwt from "jsonwebtoken";
import moment from "moment";
import { RowDataPacket } from "mysql2";

class CommentController {
    public async getComment(req: Request, res: Response): Promise<void> {
        try {
            const q = `SELECT comments.*, userId, username, profilePic FROM comments JOIN users ON (users.id = comments.userId) WHERE comments.postId = ? ORDER BY comments.createdAt DESC`;

            const [data] = await pool.query<RowDataPacket[]>(q, [req.query.postId]);

            res.status(200).json(data);
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    }

    public async postComment(req: Request, res: Response): Promise<void> {
        const token = req.cookies.accessToken;

        if (!token) {
            res.status(401).json("Not logged in");
            return;
        }

        try {
            const userInfo: any = jwt.verify(token, "theKey");

            const q = "INSERT INTO comments (`desc`, `createdAt`, `userId`, `postId`) VALUES (?)";

            const values = [req.body.desc, moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"), userInfo.id, req.body.postId];

            const [data] = await pool.query(q, [values]);

            res.status(200).json("Comment created!");
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    }
}

export default new CommentController();
