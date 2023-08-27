import express, { Express } from "express";
import authController from "../controllers/auth.js"


const router = express.Router()


router.get("/login", authController.login);
router.post("/register", authController.register);
router.get("/logout", authController.logout);

export default router