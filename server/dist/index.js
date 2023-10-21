"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const users_js_1 = __importDefault(require("./routes/users.js"));
const auth_js_1 = __importDefault(require("./routes/auth.js"));
const comments_js_1 = __importDefault(require("./routes/comments.js"));
const likes_js_1 = __importDefault(require("./routes/likes.js"));
const posts_js_1 = __importDefault(require("./routes/posts.js"));
const notifs_js_1 = __importDefault(require("./routes/notifs.js"));
const count_js_1 = __importDefault(require("./routes/count.js"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const multer_1 = __importDefault(require("multer"));
class Server {
    constructor(port) {
        this.app = (0, express_1.default)();
        this.port = port;
        this.configureMiddleware();
        this.configureRoutes();
    }
    configureMiddleware() {
        // this.app.use((req, res, next) => {
        //     res.header("Access-Control-Allow-Credentials", "true")
        //     next()
        // })
        this.app.use(express_1.default.json());
        this.app.use((0, cors_1.default)({
            // origin: "http://localhost:3000",
            origin: "https://clip-flow-c44deb5c5c24.herokuapp.com",
            credentials: true
        }));
        this.app.use((0, cookie_parser_1.default)());
        const storage = multer_1.default.memoryStorage();
        const upload = (0, multer_1.default)({ storage });
        // Serve static React build files
        this.app.use(express_1.default.static(path_1.default.join(__dirname, "client/build")));
    }
    configureRoutes() {
        this.app.use("/api/auth", auth_js_1.default);
        this.app.use("/api/users", users_js_1.default);
        this.app.use("/api/posts", posts_js_1.default);
        this.app.use("/api/likes", likes_js_1.default);
        this.app.use("/api/comments", comments_js_1.default);
        this.app.use("/api/notifications", notifs_js_1.default);
        this.app.use("/api/count", count_js_1.default);
    }
    start() {
        // Handle React's routing
        this.app.get("*", (req, res) => {
            res.sendFile(path_1.default.join(__dirname, "client/build", "index.html"));
        });
        this.app.listen(this.port, () => {
            console.log(`Server on ${this.port}`);
        });
    }
}
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
const server = new Server(port);
server.start();
