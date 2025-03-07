import { Request, Response, Router } from "express";
import { ClassJoinRequestDomain } from "../domain/classJoinRequest.domain";
import {  } from "../domain/class.domain";

export class ClassJoinRequestController {
  public router: Router;
  private classDomain: ClassJoinRequestDomain;

  constructor() {
    this.router = Router();
    this.classDomain = new ClassJoinRequestDomain();
    this.initializeRoutes();
  }

  private createJoinRequest = async (req: Request, res: Response) => {
    res.json(await this.classDomain.createClassJoinRequest(req.body));
  };

  private getStudentJoinRequests = async (req: Request, res: Response) => {
    res.json(await this.classDomain.getStudentJoinRequests(req.query));
  };

  private initializeRoutes() {
    this.router.put("/studentRequest", this.createJoinRequest)
    this.router.get("/studentRequest", this.getStudentJoinRequests)
    this.router.put("/teacherRequest", this.createJoinRequest)
  }
}