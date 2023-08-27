import express, { Express } from "express";
import userRoutes from "./routes/users.js"

class Server {
    private app: Express;
    private port: number;

    constructor(port: number){
        this.app = express();
        this.port = port;

        this.configureRoutes();
    }

    private configureRoutes(){
        this.app.use("/api/users", userRoutes)
        
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