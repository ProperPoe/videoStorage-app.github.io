"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connect_1 = require("../connect");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const moment_1 = __importDefault(require("moment"));
class PostController {
    getPost(req, res) {
        const token = req.cookies.accessToken;
        if (!token) {
            res.status(401).json("Not logged in");
            return;
        }
        jsonwebtoken_1.default.verify(token, "theKey", (err, userInfo) => {
            if (err) {
                res.status(403).json("Token is not valid");
                return;
            }
            const q = `SELECT posts.*, userId, username FROM posts JOIN users ON (users.id = posts.userId) ORDER BY createdAt DESC`;
            connect_1.db.query(q, [userInfo.id], (err, data) => {
                if (err)
                    return res.status(500).json(err);
                return res.status(200).json(data);
            });
        });
    }
    ;
    addPost(req, res) {
        const token = req.cookies.accessToken;
        if (!token) {
            res.status(401).json("Not logged in");
            return;
        }
        jsonwebtoken_1.default.verify(token, "theKey", (err, userInfo) => {
            if (err) {
                res.status(403).json("Token is not valid");
                return;
            }
            const q = "INSERT INTO posts (`desc`, `createdAt`, `userId`) VALUES (?)";
            const values = [req.body.desc, (0, moment_1.default)(Date.now()).format("YYYY-MM-DD HH:mm:ss"), userInfo.id];
            connect_1.db.query(q, [values], (err, data) => {
                if (err)
                    return res.status(500).json(err);
                return res.status(200).json("post created!");
            });
        });
    }
    ;
}
exports.default = new PostController();
