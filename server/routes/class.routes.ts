import { Request, Response, Router } from "express";
import { ClassService } from "../domain/class.domain";

export class ClassController {
  public router: Router;
  private classService: ClassService;

  constructor() {
    this.router = Router();
    this.classService = new ClassService();
    this.initializeRoutes();
  }

  private getClasses = async (req: Request, res: Response) => {
    res.json(await this.classService.getAllClasses());
  };

  private getClassById = async (req: Request, res: Response) => {
    const { id } = req.params;
    res.json(await this.classService.getClassById(id));
  };

  private createClass = async (req: Request, res: Response) => {
    const { name } = req.body;
    res.json(await this.classService.createClass(name));
  };

  private updateClass = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;
    res.json(await this.classService.updateClass(id, name));
  };

  private deleteClass = async (req: Request, res: Response) => {
    const { id } = req.params;
    res.json(await this.classService.deleteClass(id));
  };

  private initializeRoutes() {
    this.router.get("/class", this.getClasses);
    this.router.post("/class", this.createClass);
    this.router.get("/class/:id", this.getClassById);
    this.router.patch("/class/:id", this.updateClass);
    this.router.delete("/class/:id", this.deleteClass);
  }
}
