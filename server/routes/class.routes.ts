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

  private getClassById = async (req: Request, res: Response) => {
    res.json(await this.classDomain.getClassById(req.params.id));
  };

  private createClass = async (req: Request, res: Response) => {
    res.json(await this.classDomain.createClass(req.body));
  };

  private updateClass = async (req: Request, res: Response) => {
    res.json(await this.classDomain.updateClass(req.params.id, req.body));
  };

  private deleteClass = async (req: Request, res: Response) => {
    res.json(await this.classDomain.deleteClass(req.params.id));
  };

  private initializeRoutes() {
    this.router.get("/", this.getClasses);
    this.router.post("/", this.createClass);
    this.router.get("/:id", this.getClassById);
    this.router.patch("/:id", this.updateClass);
    this.router.delete("/:id", this.deleteClass);
  }
}
