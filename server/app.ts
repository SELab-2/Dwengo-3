import express, {Express, Request, Response} from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import {PrismaClient} from '@prisma/client'

import { router as auth } from "./routes/auth/auth.router";

dotenv.config({path:"../.env"});

const app: Express = express();
const port = process.env.PORT || 3001;

const prisma = new PrismaClient();

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", auth);

app.get("/hello", (req: Request, res: Response)=> {
    res.send("Hello World");
});

app.get("/learningObject", async (req: Request, res: Response) => {
    res.send(await prisma.learningObject.findMany());
});


app.listen(port, () => {
    console.log(`[SERVER] - listening on http://localhost:${port}`);
});