import { Request, Response, Router } from "express";
import { ClassDomain } from "../domain/class.domain";

export class ClassController {
  public router: Router;
  private classDomain: ClassDomain;

  constructor() {
    this.router = Router();
    this.classDomain = new ClassDomain();
    this.initializeRoutes();
  }

  private getClasses = async (req: Request, res: Response) => {
    res.json(await this.classDomain.getClasses(req.query));
  };

  private createClass = async (req: Request, res: Response) => {
    res.json(await this.classDomain.createClass(req.body));
  };

  private studentJoinRequest = async (req: Request, res: Response) => {
    res.json(await this.classDomain.createClassJoinRequest(req.body));
  };

  private teacherJoinRequest = async (req: Request, res: Response) => {
    res.json(await this.classDomain.createClassJoinRequest(req.body));
  };

  private updateClass = async (req: Request, res: Response) => {
    res.json(await this.classDomain.updateClass(req.body));
  }

  private initializeRoutes() {
    this.router.get("/", this.getClasses);
    this.router.put("/", this.createClass);
    this.router.patch("/", this.updateClass);
    this.router.put("/studentRequest", this.studentJoinRequest)
    this.router.put("/teacherRequest", this.teacherJoinRequest)
  }
}
