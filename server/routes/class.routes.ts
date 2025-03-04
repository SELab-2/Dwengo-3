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

  // The query parameters allow for request like these:
  // GET /api/class?name=math&page=1&pageSize=10
  // GET /api/class?teacherIds[]=0&teacherIds[]=1
  // ...

  private getClasses = async (req: Request, res: Response) => {
    res.json(await this.classDomain.getClasses(req.query));
  };

  private createClass = async (req: Request, res: Response) => {
    res.json(await this.classDomain.createClass(req.body));
  };

  private deleteClass = async (req: Request, res: Response) => {
    res.json(await this.classDomain.deleteClass(req.query));
  };

  private studentJoinRequest = async (req: Request, res: Response) => {
    res.json(await this.classDomain.createClassJoinRequest(req.body));
  };

  private teacherJoinRequest = async (req: Request, res: Response) => {
    res.json(await this.classDomain.createClassJoinRequest(req.body));
  };

  private initializeRoutes() {
    this.router.get("/", this.getClasses);
    this.router.put("/", this.createClass);
    this.router.delete("/", this.deleteClass);
    this.router.put("/studentRequest", this.studentJoinRequest)
    this.router.put("/teacherRequest", this.teacherJoinRequest)
  }
}
