import express from "express";
import https from "https";
import fs from "fs";
import 'dotenv/config';
import { writeLog } from "./utils/helpers.js";
import "./utils/dbConnect.js"; //runs script within file automatically (we only need to execute this file)

const app = express();

//Import Routers
import tasksRouter from "./routes/tasksRouter.js";
import adminRouter from "./routes/adminRouter.js";

const httpPort = process.env.HTTP_PORT || 8080;
const httpsPort = process.env.HTTPS_PORT || 8081;

const SSLOptions = {
    key : fs.readFileSync('keys/privkey.pem'),
    cert : fs.readFileSync('keys/fullchain.pem')
}

//https request re-direction
app.use((req, res, next)=>{
    if(!req.secure){ //add condition for https IP redirection
        const httpsUrl = `https://${req.hostname}:${httpsPort}${req.url}`;
        res.redirect(httpsUrl);
    }
    next();
})

//"app" is an Expressjs instance. Established HTTPS server will use this instance to handle incoming HTTPS requests.
const httpsServer = https.createServer(SSLOptions, app);

app.use(writeLog);

app.use(express.json()); //json bodyparser

//It will serve views/index.html at / 
app.use(express.static("views"));   //HomeRouter
app.use("/api/tasks", tasksRouter); //TasksRouter
app.use("/admin", adminRouter); //AdminRouter

app.listen(httpPort, () => {
    console.log(`Server Started at ${httpPort}`);
});

httpsServer.listen(httpsPort, () => {
    console.log(`Server Started at ${httpsPort}`);
});