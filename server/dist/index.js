"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_js_1 = __importDefault(require("./routes/users.js"));
const auth_js_1 = __importDefault(require("./routes/auth.js"));
const comments_js_1 = __importDefault(require("./routes/comments.js"));
const likes_js_1 = __importDefault(require("./routes/likes.js"));
const posts_js_1 = __importDefault(require("./routes/posts.js"));
const notifs_js_1 = __importDefault(require("./routes/notifs.js"));
class Server {
    constructor(port) {
        this.app = (0, express_1.default)();
        this.port = port;
        this.configureMiddleware();
        this.configureRoutes();
    }
    configureMiddleware() {
        this.app.use(express_1.default.json());
    }
    configureRoutes() {
        this.app.use("/api/auth", auth_js_1.default);
        this.app.use("/api/users", users_js_1.default);
        this.app.use("/api/posts", posts_js_1.default);
        this.app.use("/api/likes", likes_js_1.default);
        this.app.use("/api/comments", comments_js_1.default);
        this.app.use("/api/notifications", notifs_js_1.default);
    }
    start() {
        this.app.listen(this.port, () => {
            console.log(`Server on ${this.port}`);
        });
    }
}
const port = 4000;
const server = new Server(port);
server.start();
// import express, {Express} from "express";
// const port = 4000;
// const app: Express = express();
// app.listen(port, () => {
//     console.log(`${port}`)
// })
