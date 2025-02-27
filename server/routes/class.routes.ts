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

  private getClassById = async (req: Request, res: Response) => {
    const { id } = req.params;
    res.json(await this.classDomain.getClassById(id));
  };

  private createClass = async (req: Request, res: Response) => {
    const { name } = req.body;
    res.json(await this.classDomain.createClass(name));
  };

  private updateClass = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;
    res.json(await this.classDomain.updateClass(id, name));
  };

  private deleteClass = async (req: Request, res: Response) => {
    const { id } = req.params;
    res.json(await this.classDomain.deleteClass(id));
  };

  private initializeRoutes() {
    this.router.get("/class", this.getClasses);
    this.router.post("/class", this.createClass);
    this.router.get("/class/:id", this.getClassById);
    this.router.patch("/class/:id", this.updateClass);
    this.router.delete("/class/:id", this.deleteClass);
  }
}
