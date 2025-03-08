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

  private getLearningObjectById = async (req: Request, res: Response) => {
    res.json(await this.learningObjectDomain.getLearningObjectById(req.params.id));
  };

  private updateLearningObject = async (req: Request, res: Response) => {
    res.json(await this.learningObjectDomain.updateLearningObject(req.params.id, req.body));
  };

  private deleteLearningObject = async (req: Request, res: Response) => {
    res.json(await this.learningObjectDomain.deleteLearningObject(req.params.id));
  };

  private getLearningObjectKeywords = async (req: Request, res: Response) => {
    const loId = req.query.loId;

    if (typeof loId === 'string') {
      res.json(await this.learningObjectDomain.getLearningObjectKeywords(loId));
    } else {
      res.status(400).json({ error: 'loId query parameter is required and must be a string' });
    }
  };

  /* TODO 
  private updateLearningObjectKeyword = async (req: Request, res: Response) => {
    res.json(await this.learningObjectDomain.updateLearningObjectKeyword(req.params.loID, req.body));
  };

  private deleteLearningObjectKeyword = async (req: Request, res: Response) => {
    res.json(await this.learningObjectDomain.deleteLearningObjectKeyword(req.params.loID));
  };
  */

  private initializeRoutes() {
    this.router.post("/learningobject", this.createLearningObject);
    this.router.get("/learningobject/:id", this.getLearningObjectById);
    this.router.patch("/learningobject/:id", this.updateLearningObject);
    this.router.delete("/learningobject/:id", this.deleteLearningObject);   
    this.router.get("/learningobject/keyword", this.getLearningObjectKeywords);

    /* TODO 
    this.router.put("/learningobject/keyword", this.updateLearningObjectKeyword);
    this.router.delete("/learningobject/keyword", this.deleteLearningObjectKeyword);
    */
  }
}