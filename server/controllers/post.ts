import { Request, Response } from "express";
import { db } from "../connect";
import jwt from "jsonwebtoken";
import s3 from "../aws";
import moment from "moment";

class PostController {
    public getPost(req: Request, res: Response): void {
        const token = req.cookies.accessToken;
        if(!token){
            res.status(401).json("Not logged in");
            return;
        } 

        jwt.verify(token, "theKey", (err: jwt.VerifyErrors | null, userInfo:any) => {
            if(err){
                res. status(403).json("Token is not valid");
                return; 
            } 
            const q =  `SELECT posts.*, userId, username FROM posts JOIN users ON (users.id = posts.userId) ORDER BY createdAt DESC`;
    
            db.query(q, [userInfo.id], (err, data) => {
                if(err) return res.status(500).json(err)
                return res.status(200).json(data)
            });
        });


    };
    public async addPost(req: Request, res: Response): Promise<void> {
        const token = req.cookies.accessToken;
        if(!token){
            res.status(401).json("Not logged in");
            return;
        } 

        jwt.verify(token, "theKey", async (err: jwt.VerifyErrors | null, userInfo:any) => {
            if(err){
                res. status(403).json("Token is not valid");
                return; 
            }
            
            if(!req.file){
                res.status(400).json('No file uploaded');
                return
            }

            //Define S3 parameters
            const params = {
                Bucket: 'videostorage-app',
                Key: `user_${userInfo.id}_${Date.now()}_${req.file.originalname}`,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
                ContentDisposition: 'inline',
            }

            try {
                await s3.upload(params).promise();

                const s3Url = `https://videostorage-app.s3.amazonaws.com/${params.Key}`

                const q =  "INSERT INTO posts (`desc`, `mediaType`, `mediaUrl`, `userId`, `createdAt`) VALUES (?)";
    
                const values = [req.body.desc, req.file.mimetype.startsWith('image/') ? 'image' : 'video', s3Url, userInfo.id, moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")]
        
                db.query(q, [values], (err, data) => {
                    if(err) return res.status(500).json(err)
                    return res.status(200).json("post created!")
                });
            } catch (error) {
                console.error('Error uploading file to S3:', error);
                res.status(500).json(error);
            }

        });


    };
    
}

export default new PostController()