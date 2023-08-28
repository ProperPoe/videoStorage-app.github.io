import express, { Express } from "express";
import commentController from "../controllers/comment.js"


const router = express.Router()


router.get("/", commentController.getComment);
router.post("/", commentController.postComment);

export default router