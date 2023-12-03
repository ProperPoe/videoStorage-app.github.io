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
// import { db } from "../connect";
const connects_1 = __importDefault(require("../connects"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class CountController {
    getCount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.cookies.accessToken;
            if (!token) {
                res.status(401).json("Invalid token");
                return;
            }
            jsonwebtoken_1.default.verify(token, "theKey", (err, userInfo) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    return res.status(403).json("User not logged in");
                }
                try {
                    const q = "SELECT COUNT(*) AS notificationCount FROM notify WHERE toUserId = ?";
                    const [result] = yield connects_1.default.query(q, [userInfo.id]);
                    if (result && result.length > 0) {
                        const notificationCount = result[0].notificationCount;
                        return res.status(200).json({ notificationCount });
                    }
                    else {
                        return res.status(404).json("No notifications found");
                    }
                }
                catch (error) {
                    console.error("Error fetching notification count:", error);
                    res.status(500).json(error);
                }
            }));
        });
    }
    addCount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.cookies.accessToken;
            if (!token) {
                res.status(401).json("Invalid token");
                return;
            }
            try {
                const userInfo = yield new Promise((resolve, reject) => {
                    jsonwebtoken_1.default.verify(token, "theKey", (err, userInfo) => {
                        if (err)
                            reject(err);
                        resolve(userInfo);
                    });
                });
                const q = "INSERT INTO notify (toUserId, postId, type, fromUserId) VALUES (?)";
                const values = [req.body.toUserId, req.body.postId, req.body.type, req.body.fromUserId];
                const [data] = yield connects_1.default.query(q, [values]);
                res.status(200).json(data);
            }
            catch (err) {
                console.error("Error adding count:", err);
                res.status(500).json(err);
            }
        });
    }
    deleteCount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.cookies.accessToken;
            if (!token) {
                res.status(401).json("Not logged in!");
                return;
            }
            try {
                const userInfo = yield new Promise((resolve, reject) => {
                    jsonwebtoken_1.default.verify(token, "theKey", (err, userInfo) => {
                        if (err)
                            reject(err);
                        resolve(userInfo);
                    });
                });
                const q = "DELETE FROM notify WHERE postId = ? AND type = ? AND fromUserId = ?";
                const values = [req.query.postId, req.query.type, req.query.fromUserId];
                const [data] = yield connects_1.default.query(q, values);
                res.status(200).json(data);
            }
            catch (err) {
                console.error("Error deleting count:", err);
                res.status(500).json(err);
            }
        });
    }
}
exports.default = new CountController();
