import express from "express";
import postController from "../controllers/post.js";
import multer from "multer";

const router = express.Router();
const upload = multer(); 

router.get("/", postController.getPost);
router.post("/", upload.single("media"), postController.addPost); 
router.delete("/:id", postController.deletePost); 
router.put("/:id", postController.updatePost); 
router.get('/user/:userId', postController.getPostsByUser);
router.get("/", postController.getPostById)

export default router;