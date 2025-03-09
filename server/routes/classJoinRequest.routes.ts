import { Request, Response, Router } from "express";
import { ClassJoinRequestDomain } from "../domain/classJoinRequest.domain";
import { ClassJoinRequestType } from "../util/types/classJoinRequest.types";

export class ClassJoinRequestController {
  public router: Router;
  private classJoinRequestDomain: ClassJoinRequestDomain;

  constructor() {
    this.router = Router();
    this.classJoinRequestDomain = new ClassJoinRequestDomain();
    this.initializeRoutes();
  }

  private createJoinRequest = async (req: Request, res: Response) => {
    res.json(
      await this.classJoinRequestDomain.createClassJoinRequest(req.body),
    );
  };

  private getStudentJoinRequests = async (req: Request, res: Response) => {
    res.json(
      await this.classJoinRequestDomain.getJoinRequests(
        ClassJoinRequestType.STUDENT,
        req.query,
      ),
    );
  };

  private getTeacherJoinRequests = async (req: Request, res: Response) => {
    res.json(
      await this.classJoinRequestDomain.getJoinRequests(
        ClassJoinRequestType.TEACHER,
        req.query,
      ),
    );
  };

  private handleJoinRequest = async (req: Request, res: Response) => {
    res.json(await this.classJoinRequestDomain.handleJoinRequest(req.body));
  };

  private initializeRoutes() {
    this.router.put("/studentRequest", this.createJoinRequest);
    this.router.put("/teacherRequest", this.createJoinRequest);
    this.router.get("/studentRequest", this.getStudentJoinRequests);
    this.router.get("/teacherRequest", this.getTeacherJoinRequests);
    this.router.post("/studentRequest", this.handleJoinRequest);
    this.router.post("/teacherRequest", this.handleJoinRequest);
  }
}
