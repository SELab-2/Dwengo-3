import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { ClassController } from "./routes/class.routes";

dotenv.config({ path: "../.env" });

const app: Express = express();
const port = process.env.PORT || 3001;
const prisma = new PrismaClient();
const classController = new ClassController();

app.use("/api", classController.router);

app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.get("/learningObject", async (req: Request, res: Response) => {
  res.send(await prisma.learningObject.findMany());
});

app.listen(port, () => {
  console.log(`[SERVER] - listening on http://localhost:${port}`);
});
