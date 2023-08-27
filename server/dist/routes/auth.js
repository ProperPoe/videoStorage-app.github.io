"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_js_1 = __importDefault(require("../controllers/auth.js"));
const router = express_1.default.Router();
router.post("/login", auth_js_1.default.login);
router.post("/register", auth_js_1.default.register);
router.get("/logout", auth_js_1.default.logout);
exports.default = router;
