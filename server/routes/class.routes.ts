import { Request, Response, Router } from "express";
import { ClassDomain } from "../domain/class.domain";
import { expectUserRole } from "../domain/user.domain";
import { ClassRole } from "@prisma/client";

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
  private async expectTeacher(req: Request) {
    // check if role is teacher (middleware in app.ts checks if cookie is present and valid)
    const userId = req.cookies["DWENGO_SESSION"].split("?")[0];

    // throws error if role is not TEACHER
    await expectUserRole(userId, ClassRole.TEACHER);
  }

  private getClasses = async (req: Request, res: Response) => {
    res.json(await this.classDomain.getClasses(req.query));
  };

  private getClassById = async (req: Request, res: Response) => {
    res.json(await this.classDomain.getClassById(req.params.id));
  };

  private createClass = async (req: Request, res: Response) => {
    await this.expectTeacher(req);

    res.json(await this.classDomain.createClass(req.body));
  };

  private updateClass = async (req: Request, res: Response) => {
    await this.expectTeacher(req);

    res.json(await this.classDomain.updateClass(req.params.id, req.body));
  };

  private deleteClass = async (req: Request, res: Response) => {
    await this.expectTeacher(req);

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
