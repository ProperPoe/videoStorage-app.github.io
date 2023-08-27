import { Request, Response } from "express";

class PostController {
    public getPost(req: Request, res: Response): void {
        res.send("it works!")
    }
}

export default new PostController()