import express, { Express } from "express";
import notifController from "../controllers/notif.js"


const router = express.Router()


router.get("/test", notifController.getNotif);

export default router