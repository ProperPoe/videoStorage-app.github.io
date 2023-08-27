import { Request, Response } from "express";

class AuthController {
    public createUser(req: Request, res: Response): void {
        res.send("it works!")
    }
}

export default new AuthController()