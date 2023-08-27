import express, { Express } from "express";
import likeController from "../controllers/like.js"


const router = express.Router()


router.get("", likeController.getLike);

export default router