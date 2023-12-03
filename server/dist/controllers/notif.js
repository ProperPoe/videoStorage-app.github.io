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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import { db } from "../connect";
const connects_1 = __importDefault(require("../connects"));
const moment_1 = __importDefault(require("moment"));
class NotifController {
    getNotif(req, res) {
        const token = req.cookies.accessToken;
        if (!token) {
            res.status(401).json("Invalid token");
            return;
        }
        jsonwebtoken_1.default.verify(token, "theKey", (err, userInfo) => __awaiter(this, void 0, void 0, function* () {
            if (err)
                return res.status(403).json("User not logged in");
            try {
                const q = "SELECT notifs.*, users.username, users.profilePic FROM notifs JOIN users ON users.id = notifs.fromUserId WHERE notifs.toUserId = ? ORDER BY createdAt DESC";
                const [rows] = yield connects_1.default.query(q, [userInfo.id]);
                return res.status(200).json(rows);
            }
            catch (error) {
                console.error("Error fetching notifications:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        }));
    }
    addNotif(req, res) {
        const token = req.cookies.accessToken;
        if (!token) {
            res.status(401).json("Invalid token");
            return;
        }
        jsonwebtoken_1.default.verify(token, "theKey", (err, userInfo) => __awaiter(this, void 0, void 0, function* () {
            if (err)
                return res.status(403).json("User not logged in");
            const q = "INSERT INTO notifs (toUserId, fromUserId, postId, commentId, likeId, type, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)";
            const values = [
                req.body.toUserId,
                req.body.fromUserId,
                req.body.postId,
                req.body.commentId,
                req.body.likeId,
                req.body.type,
                (0, moment_1.default)(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            ];
            try {
                const [data] = yield connects_1.default.query(q, values);
                return res.status(200).json(data);
            }
            catch (error) {
                console.error("Error adding notification:", error);
                return res.status(500).json(error);
            }
        }));
    }
    deleteNotif(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.cookies.accessToken;
                if (!token) {
                    res.status(401).json("Not logged in!");
                    return;
                }
                const decodedToken = jsonwebtoken_1.default.verify(token, "theKey");
                const q = "DELETE FROM notifs WHERE `postId` = ? AND `fromUserId` = ? AND `type` = 'like'";
                const values = [req.query.postId, req.query.fromUserId];
                const [data] = yield connects_1.default.query(q, values);
                res.status(200).json("Notification has been deleted!");
            }
            catch (error) {
                console.error("Error deleting notification:", error);
                res.status(500).json(error);
            }
        });
    }
}
exports.default = new NotifController();
