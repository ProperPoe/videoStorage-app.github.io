import express, { Express } from "express";
import authController from "../controllers/auth.js"


const router = express.Router()


router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/logout", authController.logout);

export default router