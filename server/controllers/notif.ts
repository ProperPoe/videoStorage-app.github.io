import { Request, Response } from "express";

class NotifController {
    public getNotif(req: Request, res: Response): void {
        res.send("it works!")
    }
}

export default new NotifController()