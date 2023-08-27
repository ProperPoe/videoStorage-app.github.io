import express, { Express } from "express";
import userController from "../controllers/user.js"


const router = express.Router()


router.get("/find/:userId", userController.getUser);

export default router