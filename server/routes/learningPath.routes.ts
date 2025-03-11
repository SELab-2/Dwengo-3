import { Request, Response, Router } from "express";
import { LearningPathDomain } from "../domain/learningPath.domain";
import { getUserFromReq } from "../domain/user.domain";

export class LearningPathController {
  public router: Router;
  private learningPathDomain: LearningPathDomain;

  constructor() {
    this.router = Router();
    this.learningPathDomain = new LearningPathDomain();
    this.initializeRoutes();
  }

  private getLearningPaths = async (req: Request, res: Response) => {
    res.json(await this.learningPathDomain.getLearningPaths(req.query));
  };

  private createLearningPath = async (req: Request, res: Response) => {
    res.json(
      await this.learningPathDomain.createLearningPath(
        req.body,
        await getUserFromReq(req),
      ),
    );
  };

  // TODO : Add delete method as soon as an owner/creator attribute is added to the learningPath model

  private initializeRoutes() {
    this.router.get("/", this.getLearningPaths);
    this.router.post("/", this.createLearningPath);
  }
}
