import express, { Express } from "express";
import userRoutes from "./routes/users.js"
import authRoutes from "./routes/auth.js"
import commentRoutes from "./routes/comments.js"
import likeRoutes from "./routes/likes.js"
import postRoutes from "./routes/posts.js"
import notifRoutes from "./routes/notifs.js"
import countRoutes from "./routes/count.js"
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer"

class Server {
    private app: Express;
    private port: number;

    constructor(port: number){
        this.app = express();
        this.port = port;

        this.configureMiddleware();
        this.configureRoutes();
    }

    private configureMiddleware(){
        this.app.use((req, res, next) => {
            res.header("Access-Control-Allow-Credentials", "true")

            next()
        })
        this.app.use(express.json());
        this.app.use(cors({
            origin: "http://localhost:3000",
        }));
        this.app.use(cookieParser());

        const storage = multer.memoryStorage(); 
        const upload = multer({ storage });
    }

    private configureRoutes(){
        this.app.use("/api/auth", authRoutes);
        this.app.use("/api/users", userRoutes);
        this.app.use("/api/posts", postRoutes);
        this.app.use("/api/likes", likeRoutes);
        this.app.use("/api/comments", commentRoutes);
        this.app.use("/api/notifications", notifRoutes);
        this.app.use("/api/count", countRoutes);
        
    }

    public start(){
        this.app.listen(this.port, () => {
            console.log(`Server on ${this.port}`)
        })
    }
}

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
const server = new Server(port);
server.start()
