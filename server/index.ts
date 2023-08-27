import express, { Express } from "express";
import userRoutes from "./routes/users.js"
import authRoutes from "./routes/auth.js"
import commentRoutes from "./routes/comments.js"
import likeRoutes from "./routes/likes.js"
import postRoutes from "./routes/posts.js"
import notifRoutes from "./routes/notifs.js"

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
        this.app.use(express.json());
    }

    private configureRoutes(){
        this.app.use("/api/auth", authRoutes);
        this.app.use("/api/users", userRoutes);
        this.app.use("/api/posts", postRoutes);
        this.app.use("/api/likes", likeRoutes);
        this.app.use("/api/comments", commentRoutes);
        this.app.use("/api/notifications", notifRoutes);
        
    }

    public start(){
        this.app.listen(this.port, () => {
            console.log(`Server on ${this.port}`)
        })
    }
}

const port = 4000;
const server = new Server(port);
server.start()

// import express, {Express} from "express";
// const port = 4000;

// const app: Express = express();

// app.listen(port, () => {
//     console.log(`${port}`)
// })