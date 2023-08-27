import express, { Express } from "express";
import userController from "../controllers/user.js"


const router = express.Router()


router.get("/test", userController.getUser);

export default router