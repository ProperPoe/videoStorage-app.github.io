import express, { Express } from "express";
import likeController from "../controllers/like.js"


const router = express.Router()


router.get("/test", likeController.getLike);

export default router