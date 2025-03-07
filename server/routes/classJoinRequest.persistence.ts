import { Request, Response, Router } from "express";
import { ClassJoinRequestDomain } from "../domain/classJoinRequest.domain";

export class ClassJoinRequestController {
  public router: Router;
  private classJoinRequestDomain: ClassJoinRequestDomain;

  constructor() {
    this.router = Router();
    this.classJoinRequestDomain = new ClassJoinRequestDomain();
    this.initializeRoutes();
  }

  private createJoinRequest = async (req: Request, res: Response) => {
    res.json(await this.classJoinRequestDomain.createClassJoinRequest(req.body));
  };

  private getJoinRequests = async (req: Request, res: Response) => {
    res.json(await this.classJoinRequestDomain.getJoinRequests(req.query));
  };

  private handleJoinRequest = async (req: Request, res: Response) => {
    res.json(await this.classJoinRequestDomain.handleJoinRequest(req.body));
  }

  private initializeRoutes() {
    this.router.put("/studentRequest", this.createJoinRequest)
    this.router.put("/teacherRequest", this.createJoinRequest)
    this.router.get("/studentRequest", this.getJoinRequests)
    this.router.get("/teacherRequest", this.getJoinRequests)
    this.router.post("/studentRequest", this.handleJoinRequest)
    this.router.post("/teacherRequest", this.handleJoinRequest)
  }
}