import express from "express";
import notifController from "../controllers/notif.js";
const router = express.Router();
router.get("/", notifController.getNotif);
router.post("/", notifController.addNotif);
router.delete("/", notifController.deleteNotif);
export default router;
