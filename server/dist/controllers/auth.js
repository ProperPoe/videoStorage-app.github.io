"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { db } from "../connect";
const connects_1 = __importDefault(require("../connects"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthController {
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.body.username || !req.body.email || !req.body.password) {
                    return res.status(400).json("All fields required");
                }
                // Check if user exists
                const selectQuery = "SELECT * FROM users WHERE username = ?";
                const [existingUsers] = yield connects_1.default.query(selectQuery, [req.body.username]);
                if (existingUsers.length) {
                    return res.status(409).json("User already exists");
                }
                // Create a new user
                // Hash Password
                const salt = bcryptjs_1.default.genSaltSync(10);
                const hashedPassword = bcryptjs_1.default.hashSync(req.body.password, salt);
                const insertQuery = "INSERT INTO users (`username`, `email`, `password`) VALUES (?)";
                const values = [req.body.username, req.body.email, hashedPassword];
                yield connects_1.default.query(insertQuery, [values]);
                return res.status(200).json("User has been created!");
            }
            catch (error) {
                console.error("Error registering user:", error);
                return res.status(500).json(error);
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const selectQuery = "SELECT * FROM users WHERE username = ?";
                const [userData] = yield connects_1.default.query(selectQuery, [req.body.username]);
                if (userData.length === 0) {
                    res.status(404).json("No such user exists!");
                    return;
                }
                const checkPassword = bcryptjs_1.default.compareSync(req.body.password, userData[0].password);
                if (!checkPassword) {
                    res.status(400).json("Incorrect credentials");
                    return;
                }
                const token = jsonwebtoken_1.default.sign({ id: userData[0].id }, "theKey");
                const _a = userData[0], { password } = _a, others = __rest(_a, ["password"]);
                res.cookie("accessToken", token, { httpOnly: true }).status(200).json(others);
            }
            catch (error) {
                console.error("Error in login route:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.clearCookie("accessToken", {
                    secure: true,
                    sameSite: "none"
                }).status(200).json("User is logged out");
            }
            catch (error) {
                console.error("Error in logout route:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
}
exports.default = new AuthController();
