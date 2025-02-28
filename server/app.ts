import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { ClassController } from "./routes/class.routes";

dotenv.config({ path: "../.env" });

const app: Express = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // TODO: Maybe make some error logging mechanism?
  console.error("[ERROR]", err);

  const statusCode = err.status || 500;

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

const classController = new ClassController();
apiRouter.use(classController.router);

app.listen(port, () => {
  console.log(`[SERVER] - listening on http://localhost:${port}`);
});
