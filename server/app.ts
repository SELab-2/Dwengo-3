import express, {Express, Request, Response} from "express";
import dotenv from "dotenv";
import { PrismaClient } from '@prisma/client'
import { exit } from "process";
import { AssignmentController } from "./routes/assignment.routes";
import { AssignmentSubmissionController } from "./routes/assignmentSubmission.routes";

dotenv.config({path:"../.env"});

const app: Express = express();
const port = process.env.PORT || 3001;

const prisma = new PrismaClient()

const apiRouter = express.Router();

const assignmentController = new AssignmentController();
const assignmentSubController = new AssignmentSubmissionController();

app.use('/api', apiRouter);

apiRouter.get("/hello", (req: Request, res: Response)=> {
    res.send("Hello World");
});

apiRouter.get("/learningObject", async (req: Request, res: Response) => {
    res.send(await prisma.learningObject.findMany());
});

apiRouter.use('/assignment', assignmentController.getRouter());
apiRouter.use('/assignmentSubmission', assignmentSubController.getRouter());


app.listen(port, () => {
    console.log(`[SERVER] - listening on http://localhost:${port}`);
});