import express, { Express } from "express";
import commentController from "../controllers/comment.js"


const router = express.Router()


router.get("/test", commentController.getComment);

export default router