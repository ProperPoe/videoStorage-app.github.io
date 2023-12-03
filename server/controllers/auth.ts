import { Request, Response } from "express";
// import { db } from "../connect";
import pool  from "../connects";
import { OkPacket, RowDataPacket } from "mysql2";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"


class AuthController {
    public async register(req: Request, res: Response): Promise<Response> {
        try {
          if (!req.body.username || !req.body.email || !req.body.password) {
            return res.status(400).json("All fields required");
          }
    
          // Check if user exists
          const selectQuery = "SELECT * FROM users WHERE username = ?";
          const [existingUsers] = await pool.query<RowDataPacket[]>(selectQuery, [req.body.username]);
    
          if (existingUsers.length) {
            return res.status(409).json("User already exists");
          }
    
          // Create a new user
          // Hash Password
          const salt = bcrypt.genSaltSync(10);
          const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    
          const insertQuery = "INSERT INTO users (`username`, `email`, `password`) VALUES (?)";
          const values = [req.body.username, req.body.email, hashedPassword];
    
          await pool.query(insertQuery, [values]);
    
          return res.status(200).json("User has been created!");
        } catch (error) {
          console.error("Error registering user:", error);
          return res.status(500).json(error);
        }
      }
      public async login(req: Request, res: Response): Promise<void> {
        try {
          const selectQuery = "SELECT * FROM users WHERE username = ?";
          const [userData] = await pool.query<RowDataPacket[]>(selectQuery, [req.body.username]);
    
          if (userData.length === 0) {
            res.status(404).json("No such user exists!");
            return 
          }
    
          const checkPassword = bcrypt.compareSync(req.body.password, userData[0].password);
    
          if (!checkPassword) {
            res.status(400).json("Incorrect credentials");
            return 
          }
    
          const token = jwt.sign({ id: userData[0].id }, "theKey");
    
          const { password, ...others } = userData[0];
    
          res.cookie("accessToken", token, { httpOnly: true }).status(200).json(others);
        } catch (error) {
          console.error("Error in login route:", error);
          res.status(500).json({ error: "Internal Server Error" });
        }
      }
      public async logout(req: Request, res: Response): Promise<void> {
        try {
          res.clearCookie("accessToken", {
            secure: true,
            sameSite: "none"
          }).status(200).json("User is logged out");
        } catch (error) {
          console.error("Error in logout route:", error);
          res.status(500).json({ error: "Internal Server Error" });
        }
      }
}

export default new AuthController()