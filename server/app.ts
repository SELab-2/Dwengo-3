import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { ClassController } from "./routes/class.routes";
import { LearningPathController } from "./routes/learningPath.routes";

dotenv.config({ path: "../.env" });

const app: Express = express();
const port = process.env.PORT || 3001;
const prisma = new PrismaClient();
app.use(express.json());
const apiRouter = express.Router();

const classController = new ClassController();
const learningPathController = new LearningPathController();

app.use("/api", apiRouter);

apiRouter.use("/class", classController.router);
apiRouter.use("/learningPath",)


app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.get("/learningObject", async (req: Request, res: Response) => {
  res.send(await prisma.learningObject.findMany());
});

app.listen(port, () => {
  console.log(`[SERVER] - listening on http://localhost:${port}`);
});
