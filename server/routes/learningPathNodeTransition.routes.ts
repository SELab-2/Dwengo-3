import { Router, Request, Response } from "express";
import { LearningPathNodeTransitionDomain } from "../domain/learningPathNodeTransition.domain";
import { getUserFromReq } from "../domain/user.domain";

export class LearningPathNodeTransitionController {
  public router: Router;
  private LearningPathNodeTransitionDomain: LearningPathNodeTransitionDomain;

  constructor() {
    this.router = Router();
    this.LearningPathNodeTransitionDomain =
      new LearningPathNodeTransitionDomain();
    this.initializeRoutes();
  }

  private createLearningPathNodeTransition = async (
    req: Request,
    res: Response,
  ) => {
    res.json(
      await this.LearningPathNodeTransitionDomain.createLearningPathNodeTransition(
        req.body,
        await getUserFromReq(req),
      ),
    );
  };

  private initializeRoutes() {
    this.router.post("/", this.createLearningPathNodeTransition);
  }
}
