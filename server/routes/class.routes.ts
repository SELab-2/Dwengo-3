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
    try {
      const classes = await this.classService.getAllClasses();
      res.json(classes);
    } catch (e: any) {
      res
        .status(500)
        .json({ message: "Error retrieving classes", error: e.message });
    }
  };

  private initializeRoutes() {
    this.router.get("/class", this.getClasses);
  }
}
