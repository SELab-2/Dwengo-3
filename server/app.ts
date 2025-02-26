import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { PrismaClient } from '@prisma/client'
import { exit } from "process";
import LearningPathRouter from "./routes/learningPath.routes";


dotenv.config({ path: "../.env" });


const app: Express = express();
const port = process.env.PORT || 3001;

const prisma = new PrismaClient()
app.use(express.json());

const apiRouter = express.Router();

app.use('/api', apiRouter);

apiRouter.get("/hello", (req: Request, res: Response) => {
    res.send("Hello World");
});

apiRouter.get("/learningObject", async (req: Request, res: Response) => {
    res.send(await prisma.learningObject.findMany());
});

apiRouter.use('/learningPath', LearningPathRouter);


app.listen(port, () => {
    console.log(`[SERVER] - listening on http://localhost:${port}`);
});