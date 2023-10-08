import { Request, Response } from "express";
import { db } from "../connect";
import { OkPacket, RowDataPacket } from "mysql2";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"


class AuthController {
    public register(req: Request, res: Response): Promise<Response> {

        return new Promise((resolve, reject)=> {

            if (!req.body.username || !req.body.email || !req.body.password) {
                return res.status(400).json("All fields required");
              }
    
    
            //Check if user exists
            const q = "SELECT * FROM users WHERE username = ?";
            db.query(q, [req.body.username], (err,data: RowDataPacket[]) => {
                if(err) return res.status(500).json(err)
                if(data.length) return res.status(409).json("User already exists")
                //Create a new user
                    //Hash Password
                    const salt = bcrypt.genSaltSync(10);
                    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
            
                    const q = "INSERT INTO users (`username`, `email`, `password`) VALUE (?)"
    
                    const values = [req.body.username, req.body.email, hashedPassword]
    
                    db.query(q,[values], (err, data) => {
                        if(err) return res.status(500).json(err)
                        return res.status(200).json("User has been created!")
                    })
            })
        })

    }
    public login(req: Request, res: Response): void {
        const q = "SELECT * FROM users WHERE username = ?";

        db.query(q,[req.body.username],(err, data: RowDataPacket[]) => {
            if(err) return res.status(500).json(err);
            if(data.length === 0) return res.status(404).json("No such user exists!");

            const checkPassword = bcrypt.compareSync(req.body.password, data[0].password);

            if(!checkPassword) return res.status(400).json("Incorrect credentials");

            const token = jwt.sign({id:data[0].id}, "theKey");

            const {password, ...others} = data[0]

            res.cookie("accessToken", token, { httpOnly: true}).status(200).json(others)


        })
    }
    public logout(req: Request, res: Response): void {
        res.clearCookie("accessToken", {
            secure:true,
            sameSite:"none"
        }).status(200).json("User is logged out")
    }
}

export default new AuthController()