import { Router, Request, Response } from "express";
import { LearningPathNodeTransitionDomain } from "../domain/learningPathNodeTransition.domain";

export class LearningPathNodeTransitionController {
    public router: Router;
    private LearningPathNodeTransitionDomain: LearningPathNodeTransitionDomain;

    constructor() {
        this.router = Router();
        this.LearningPathNodeTransitionDomain = new LearningPathNodeTransitionDomain
        this.initializeRoutes();
    }

    private createLearningPathNodeTransition = async (req: Request, res: Response) => {
        res.json(await this.LearningPathNodeTransitionDomain.createLearningPathNodeTransition(req.body));
    }

    private initializeRoutes() {
        this.router.post("/", this.createLearningPathNodeTransition);
    }
}