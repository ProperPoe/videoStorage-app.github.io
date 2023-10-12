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
const connect_1 = require("../connect");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const aws_1 = __importDefault(require("../aws"));
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
            // const q =  `SELECT posts.*, userId, username, profilePic FROM posts JOIN users ON (users.id = posts.userId) ORDER BY createdAt DESC`;
            const q = `
            SELECT
                posts.*,
                users.id AS userId,
                users.username,
                users.profilePic,
                COUNT(DISTINCT likes.id) AS likesCount,
                COUNT(DISTINCT comments.id) AS commentsCount
            FROM posts
            LEFT JOIN users ON users.id = posts.userId
            LEFT JOIN likes ON likes.postId = posts.id
            LEFT JOIN comments ON comments.postId = posts.id
            GROUP BY posts.id
            ORDER BY posts.createdAt DESC
        `;
            connect_1.db.query(q, [userInfo.id], (err, data) => {
                if (err)
                    return res.status(500).json(err);
                return res.status(200).json(data);
            });
        });
    }
    ;
    addPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                if (!req.file) {
                    res.status(400).json('No file uploaded');
                    return;
                }
                //Define S3 parameters
                const params = {
                    Bucket: 'videostorage-app',
                    Key: `user_${userInfo.id}_${Date.now()}_${req.file.originalname}`,
                    Body: req.file.buffer,
                    ContentType: req.file.mimetype,
                    ContentDisposition: 'inline',
                };
                try {
                    yield aws_1.default.upload(params).promise();
                    const s3Url = `https://videostorage-app.s3.amazonaws.com/${params.Key}`;
                    const q = "INSERT INTO posts (`desc`, `mediaType`, `mediaUrl`, `userId`, `createdAt`) VALUES (?)";
                    const values = [req.body.desc, req.file.mimetype.startsWith('image/') ? 'image' : 'video', s3Url, userInfo.id, (0, moment_1.default)(Date.now()).format("YYYY-MM-DD HH:mm:ss")];
                    connect_1.db.query(q, [values], (err, data) => {
                        if (err)
                            return res.status(500).json(err);
                        return res.status(200).json("post created!");
                    });
                }
                catch (error) {
                    console.error('Error uploading file to S3:', error);
                    res.status(500).json(error);
                }
            }));
        });
    }
    ;
    deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const q = "DELETE FROM posts WHERE `id`=? AND `userId`=?";
                // const postId = req.params.id;
                connect_1.db.query(q, [req.params.id, userInfo.id], (err, data) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        return res.status(500).json(err);
                    }
                    if (typeof data === 'object' && 'affectedRows' in data && data.affectedRows !== undefined && data.affectedRows > 0) {
                        // Delete the file from S3
                        const s3Key = `user_${userInfo.id}_${req.params.id}`; // Assuming this is the S3 key format
                        const s3Params = {
                            Bucket: 'videostorage-app',
                            Key: s3Key,
                        };
                        try {
                            yield aws_1.default.deleteObject(s3Params).promise();
                            return res.status(200).json("Post deleted!");
                        }
                        catch (s3Error) {
                            console.error('Error deleting file from S3:', s3Error);
                            return res.status(500).json(s3Error);
                        }
                    }
                    return res.status(403).json("You can only delete your post!");
                }));
            }));
        });
    }
    ;
    updatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const q = "UPDATE posts SET `desc`=? WHERE `id`=?";
                connect_1.db.query(q, [req.body.desc, req.params.id], (err, data) => {
                    if (err) {
                        return res.status(500).json(err);
                    }
                    if (typeof data === 'object' && 'affectedRows' in data && data.affectedRows !== undefined && data.affectedRows > 0) {
                        return res.status(200).json("Post update!");
                    }
                    return res.status(403).json("You can only update your post!");
                });
            }));
        });
    }
    ;
    getPostsByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const userId = req.params.userId;
                // const q = `SELECT * FROM posts WHERE userId = ? ORDER BY createdAt DESC`;
                const q = `SELECT posts.*, userId, username FROM posts JOIN users ON (users.id = posts.userId) WHERE posts.userId = ? ORDER BY createdAt DESC`;
                connect_1.db.query(q, [userId], (err, data) => {
                    if (err) {
                        return res.status(500).json(err);
                    }
                    return res.status(200).json(data);
                });
            });
        });
    }
    getPostById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //const postId = req.params.id;
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
                // Query to fetch the post data by postId, including the updated description
                const q = "SELECT * FROM posts WHERE `id` = ? LIMIT 1";
                connect_1.db.query(q, [req.query.postId], (err, data) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        return res.status(500).json(err);
                    }
                    if (data && data.length > 0) {
                        const post = data[0];
                        // Check if the user requesting this post is the owner
                        if (post.userId === userInfo.id) {
                            return res.status(200).json(post);
                        }
                        else {
                            return res.status(403).json("You can only access your own post!");
                        }
                    }
                    else {
                        return res.status(404).json("Post not found");
                    }
                }));
            }));
        });
    }
}
exports.default = new PostController();
