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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import { pool } from "../connect";
const connects_1 = __importDefault(require("../connects"));
const aws_1 = __importDefault(require("../aws"));
class UserController {
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const q = "SELECT * FROM users WHERE id=?";
                const [rows] = yield connects_1.default.query(q, [userId]);
                if (rows.length === 0) {
                    res.status(404).json({ message: 'User not found' });
                    return;
                }
                // Omit the password field from the response
                const _a = rows[0], { password } = _a, info = __rest(_a, ["password"]);
                res.json(info);
            }
            catch (err) {
                console.error("Error fetching user:", err);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.body.username) {
                    res.status(400).json("Field cannot be empty!");
                    return;
                }
                const token = req.cookies.accessToken;
                if (!token) {
                    res.status(401).json("Not logged in");
                    return;
                }
                jsonwebtoken_1.default.verify(token, "theKey", (err, userInfo) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        res.status(403).json("Token is not valid");
                        return;
                    }
                    try {
                        // Check if a new profilePic file was uploaded
                        if (req.file) {
                            // S3 parameters for the profilePic upload
                            const s3Params = {
                                Bucket: "videostorage-app", // Replace with your S3 bucket name
                                Key: `user_${userInfo.id}_${Date.now()}_${req.file.originalname}`,
                                Body: req.file.buffer,
                                ContentType: req.file.mimetype,
                                ContentDisposition: "inline",
                            };
                            // Upload the new profilePic to S3
                            yield aws_1.default.upload(s3Params).promise();
                            // Update the user's profilePic URL in the database
                            const profilePicUrl = `https://${s3Params.Bucket}.s3.amazonaws.com/${s3Params.Key}`;
                            const q = "UPDATE users SET `username`=?, `profilePic`=? WHERE `id`=?";
                            const [data] = yield connects_1.default.query(q, [req.body.username, profilePicUrl, userInfo.id]);
                            if (data.affectedRows > 0) {
                                return res.status(200).json("User profile updated!");
                            }
                            return res.status(403).json("You can only update your profile!");
                        }
                        else {
                            // No new profilePic uploaded, only update the username
                            const q = "UPDATE users SET `username`=? WHERE `id`=?";
                            const [data] = yield connects_1.default.query(q, [req.body.username, userInfo.id]);
                            if (data.affectedRows > 0) {
                                return res.status(200).json("Username updated!");
                            }
                            return res.status(403).json("You can only update your profile!");
                        }
                    }
                    catch (error) {
                        console.error("Error uploading profilePic to S3:", error);
                        res.status(500).json(error);
                    }
                }));
            }
            catch (error) {
                console.error("Error updating user:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
    getNav(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const q = "SELECT id, username, profilePic FROM users WHERE id=?";
                const [rows] = yield connects_1.default.query(q, [userId]);
                if (rows.length === 0) {
                    res.status(404).json({ message: 'User not found' });
                    return;
                }
                // Extract necessary fields for navigation
                const info = __rest(rows[0], []);
                res.json(info);
            }
            catch (err) {
                console.error("Error fetching user for navigation:", err);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
}
exports.default = new UserController();
