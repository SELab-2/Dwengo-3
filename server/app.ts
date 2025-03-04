import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { ClassController } from "./routes/class.routes";
import { ZodError } from "zod";
import { LearningPathController } from "./routes/learningPath.routes";
import { LearningPathNodeController } from "./routes/learningPathNode.routes";
import { LearningPathNodeTransitionController } from "./routes/learningPathNodeTransition.routes";
import { AssignmentController } from "./routes/assignment.routes";
import { AssignmentSubmissionController } from "./routes/assignmentSubmission.routes";

dotenv.config({ path: "../.env" });

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const port = process.env.PORT || 3001;

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // TODO: Maybe make some error logging mechanism?
  console.error("[ERROR]", err);

  // If the error is a ZodError, it means that the request did not pass the validation
  let statusCode = err instanceof ZodError ? 400 : 500;

  if (process.env.NODE_ENV === "production") {
    res.status(statusCode).send("Something broke!");
  } else {
    res.status(statusCode).json({
      message: err.message || "Internal Server Error",
      stack: err.stack,
    });
  }
});

const apiRouter = express.Router();
app.use("/api", apiRouter);

apiRouter.use("/class", new ClassController().router);
apiRouter.use("/learningPath", new LearningPathController().router);
apiRouter.use("/learningPathNode", new LearningPathNodeController().router);
apiRouter.use(
  "/learningPathNodeTransition",
  new LearningPathNodeTransitionController().router
);
apiRouter.use('/assignment', new AssignmentController().getRouter());
apiRouter.use('/assignmentSubmission', new AssignmentSubmissionController().getRouter());

app.listen(port, () => {
  console.log(`[SERVER] - listening on http://localhost:${port}`);
});
