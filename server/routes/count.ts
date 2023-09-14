import express, { Express } from "express";
import countController from "../controllers/count.js"


const router = express.Router()


router.get("/", countController.getCount)
router.post("/",  countController.addCount)
router.delete("/", countController.deleteCount)

export default router