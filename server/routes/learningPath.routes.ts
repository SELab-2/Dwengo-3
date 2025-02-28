import { Request, Response, Router } from "express";
import { LearningPathDomain } from "../domain/learningPath.domain";

export class LearningPathController {
    public router: Router;
    private learningPathDomain: LearningPathDomain;

    constructor() {
        this.router = Router();
        this.learningPathDomain = new LearningPathDomain();
        this.initializeRoutes();
    }

    private getLearningPaths = async (req: Request, res: Response) => {
        // todo handle errors
        res.json(await this.learningPathDomain.getLearningPaths(req.query));
    };

    private getLearningPathById = async (req: Request, res: Response) => {
        res.json(await this.learningPathDomain.getLearningPathById(req.params.id));
    };

    private createLearningPath = async (req: Request, res: Response) => {
        res.json(await this.learningPathDomain.createLearningPath(req.body));
    };

    // TODO: uncomment this in case we add an attribute owner to learningPath
    // private updateLearningPath = async (req: Request, res: Response) => {
    //     res.json(await this.learningPathDomain.updateLearningPath(req.params.id, req.body));
    // };

    // TODO: uncomment this in case we add an attribute owner to learningPath
    // private deleteLearningPath = async (req: Request, res: Response) => {
    //     res.json(await this.learningPathDomain.deleteLearningPath(req.params.id));
    // };

    private initializeRoutes() {
        this.router.get("/", this.getLearningPaths);
        this.router.post("/", this.createLearningPath);
        this.router.get("/:id", this.getLearningPathById);
        // this.router.patch("/:id", this.updateLearningPath);
        // this.router.delete("/:id", this.deleteLearningPath);
    }
}