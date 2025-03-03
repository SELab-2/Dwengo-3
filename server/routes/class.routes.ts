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

  private updateClass = async (req: Request, res: Response) => {
    res.json(await this.classDomain.updateClass(req.query, req.body));
  };

  private deleteClass = async (req: Request, res: Response) => {
    res.json(await this.classDomain.deleteClass(req.query));
  };

  private initializeRoutes() {
    this.router.get("/", this.getClasses);
    this.router.post("/", this.createClass);
    this.router.patch("/", this.updateClass);
    this.router.delete("/", this.deleteClass);
  }
}
