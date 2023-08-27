import { Request, Response } from "express";

class LikeController {
    public getLike(req: Request, res: Response): void {
        res.send("it works!")
    }
}

export default new LikeController()