import { Router, Request, Response } from "express";
import { LearningPathNodeDomain } from "../domain/learningPathNode.domain";


export class LearningPathNodeController {
    public router: Router;
    private learningPathNodeDomain: LearningPathNodeDomain;

    constructor() {
        this.router = Router();
        this.learningPathNodeDomain = new LearningPathNodeDomain();
        this.initializeRoutes();
    }

    private createLearningPathNode = async (req: Request, res: Response) => {
        res.json(await this.learningPathNodeDomain.createLearningPathNode(req.body));
    }

    private initializeRoutes() {
        this.router.post("/", this.createLearningPathNode);
    }

}