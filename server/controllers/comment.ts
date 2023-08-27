import { Request, Response } from "express";

class CommentController {
    public getComment(req: Request, res: Response): void {
        res.send("it works!")
    }
}

export default new CommentController()