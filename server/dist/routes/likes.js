"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const like_js_1 = __importDefault(require("../controllers/like.js"));
const router = express_1.default.Router();
router.get("/", like_js_1.default.getLikes);
router.post("/", like_js_1.default.addLikes);
router.delete("/", like_js_1.default.deleteLikes);
exports.default = router;
