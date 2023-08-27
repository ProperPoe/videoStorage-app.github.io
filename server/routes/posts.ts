import express, { Express } from "express";
import postController from "../controllers/post.js"


const router = express.Router()


router.get("/test", postController.getPost);

export default router