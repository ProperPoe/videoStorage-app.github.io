"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_js_1 = __importDefault(require("../controllers/post.js"));
const router = express_1.default.Router();
router.get("", post_js_1.default.getPost);
exports.default = router;
