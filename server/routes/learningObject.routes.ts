import { Request, Response, Router } from "express";
import { LearningObjectDomain } from "../domain/learningObject.domain";

export class LearningObjectController {
  public router: Router;
  private learningObjectDomain: LearningObjectDomain;

  constructor() {
    this.router = Router();
    this.learningObjectDomain = new LearningObjectDomain();
    this.initializeRoutes();
  }

  private createLearningObject = async (req: Request, res: Response) => {
    res.json(await this.learningObjectDomain.createLearningObject(req.body));
  };

  private getLearningObjects = async (req: Request, res: Response) => {
    res.json(await this.learningObjectDomain.getLearningObjects(req.query));
  };

  private updateLearningObject = async (req: Request, res: Response) => {
    res.json(await this.learningObjectDomain.updateLearningObject(req.params.id, req.body));
  };

  private deleteLearningObject = async (req: Request, res: Response) => {
    res.json(await this.learningObjectDomain.deleteLearningObject(req.params.id));
  };

  private initializeRoutes() {
    this.router.post("/", this.createLearningObject);
    this.router.get("/", this.getLearningObjects);
    this.router.patch("/:id", this.updateLearningObject);
    this.router.delete("/:id", this.deleteLearningObject);   
  }
}