import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { db } from "../connect";
import { OkPacket, RowDataPacket } from "mysql2";

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
}

export default new UserController()