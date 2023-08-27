"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
class Server {
    constructor(port) {
        this.app = (0, express_1.default)();
        this.port = port;
        this.configureRoutes();
    }
    configureRoutes() {
        // this.app.listen(this.port, () => {
        //     console.log(`Server on ${this.port}`)
        // })
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
