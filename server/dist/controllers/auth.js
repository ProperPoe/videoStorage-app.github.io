"use strict";
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
        return new Promise((resolve, reject) => {
            if (!req.body.username || !req.body.email || !req.body.password) {
                return res.status(400).json("All fields required");
            }
            //Check if user exists
            const q = "SELECT * FROM users WHERE username = ?";
            connects_1.default.query(q, [req.body.username], (err, data) => {
                if (err)
                    return res.status(500).json(err);
                if (data.length)
                    return res.status(409).json("User already exists");
                //Create a new user
                //Hash Password
                const salt = bcryptjs_1.default.genSaltSync(10);
                const hashedPassword = bcryptjs_1.default.hashSync(req.body.password, salt);
                const q = "INSERT INTO users (`username`, `email`, `password`) VALUE (?)";
                const values = [req.body.username, req.body.email, hashedPassword];
                connects_1.default.query(q, [values], (err, data) => {
                    if (err)
                        return res.status(500).json(err);
                    return res.status(200).json("User has been created!");
                });
            });
        });
    }
    login(req, res) {
        const q = "SELECT * FROM users WHERE username = ?";
        connects_1.default.query(q, [req.body.username], (err, data) => {
            if (err)
                return res.status(500).json(err);
            if (data.length === 0)
                return res.status(404).json("No such user exists!");
            const checkPassword = bcryptjs_1.default.compareSync(req.body.password, data[0].password);
            if (!checkPassword)
                return res.status(400).json("Incorrect credentials");
            const token = jsonwebtoken_1.default.sign({ id: data[0].id }, "theKey");
            const _a = data[0], { password } = _a, others = __rest(_a, ["password"]);
            res.cookie("accessToken", token, { httpOnly: true }).status(200).json(others);
        });
    }
    logout(req, res) {
        res.clearCookie("accessToken", {
            secure: true,
            sameSite: "none"
        }).status(200).json("User is logged out");
    }
}
exports.default = new AuthController();
