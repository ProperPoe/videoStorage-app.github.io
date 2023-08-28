import express, { Express } from "express";
import postController from "../controllers/post.js"


const router = express.Router()


router.get("/", postController.getPost);
router.post("/", postController.addPost);

export default router