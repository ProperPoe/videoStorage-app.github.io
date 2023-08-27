import express, { Express } from "express";
import authController from "../controllers/auth.js"


const router = express.Router()


router.get("/test", authController.createUser);

export default router