import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import * as http2 from "node:http2";

import { router as auth, verifyCookie } from "./routes/auth.router";
import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { ClassController } from "./routes/class.routes";
import { ZodError } from "zod";
import { LearningPathController } from "./routes/learningPath.routes";
import { LearningPathNodeController } from "./routes/learningPathNode.routes";
import { LearningPathNodeTransitionController } from "./routes/learningPathNodeTransition.routes";

dotenv.config({ path: "../.env" });
const app: Express = express();
const port = process.env.PORT || 3001;

// cookie validating middleware
app.use(
  cookieParser(),
  async (req: Request, res: Response, next: NextFunction) => {
    const verified = await verifyCookie(req.cookies["DWENGO_SESSION"]);
    if (verified) {
      next();
    } else {
      const path = req.path;
      if (path !== "/api/auth/login" && path !== "/api/auth/register") {
        console.debug(`unauthorized: ${path}`);
        res.status(http2.constants.HTTP_STATUS_FORBIDDEN).send("unauthorized");
        return;
      }
      next();
    }
  },
);
app.use(express.json());

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
  new LearningPathNodeTransitionController().router,
);
apiRouter.use("/auth", auth);

app.listen(port, () => {
  console.log(`[SERVER] - listening on http://localhost:${port}`);
});
