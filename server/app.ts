import express, {Express, NextFunction, Request, Response} from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import {PrismaClient} from '@prisma/client'
import * as http2 from "node:http2";

import { router as auth, verifyCookie } from "./routes/auth/auth.router";

dotenv.config({path:"../.env"});

const app: Express = express();
const port = process.env.PORT || 3001;

const prisma = new PrismaClient();

app.use(cookieParser(), async (req: Request, res: Response, next: NextFunction) => {
    const verified = await verifyCookie(req.cookies["DWENGO_SESSION"]);
    if (verified) {
        next();
    } else {
        res.status(http2.constants.HTTP_STATUS_FORBIDDEN).send("unauthorized");
    }
});
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