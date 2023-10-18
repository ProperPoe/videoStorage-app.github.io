import express, { Express } from "express";
import userController from "../controllers/user.js"
import multer from "multer";

const router = express.Router()
const upload = multer(); 

router.get("/find/:userId", userController.getUser);
router.get("/nav/:userId", userController.getNav);
router.put("/", upload.single("profilePic"), userController.updateUser);

export default router