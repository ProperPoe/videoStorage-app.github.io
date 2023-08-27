import { Request, Response } from "express";

class UserController {
    public getUser(req: Request, res: Response): void {
        res.send("it works!")
    }
}

export default new UserController()