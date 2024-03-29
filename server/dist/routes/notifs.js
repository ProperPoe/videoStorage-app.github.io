"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notif_js_1 = __importDefault(require("../controllers/notif.js"));
const router = express_1.default.Router();
router.get("/", notif_js_1.default.getNotif);
router.post("/", notif_js_1.default.addNotif);
router.delete("/", notif_js_1.default.deleteNotif);
exports.default = router;
