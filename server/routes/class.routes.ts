import { Request, Response, Router } from "express";
import { ClassDomain } from "../domain/class.domain";
import { ClassJoinRequestController } from "./classJoinRequest.routes";
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

  private async expectTeacher(req: Request) {
    // check if role is teacher (middleware in app.ts checks if cookie is present and valid)
    const userId = req.cookies["DWENGO_SESSION"].split("?")[0];

    // throws error if role is not TEACHER
    await expectUserRole(userId, ClassRole.TEACHER);
  }

  private getClasses = async (req: Request, res: Response) => {
    res.json(await this.classDomain.getClasses(req.query));
  };

  private createClass = async (req: Request, res: Response) => {
    await this.expectTeacher(req);

    res.json(await this.classDomain.createClass(req.body));
  };

  private updateClass = async (req: Request, res: Response) => {
    await this.expectTeacher(req);

    res.json(await this.classDomain.updateClass(req.body));
  };

  private initializeRoutes() {
    this.router.get("/", this.getClasses);
    this.router.put("/", this.createClass);
    this.router.patch("/", this.updateClass);
    this.router.use("/", new ClassJoinRequestController().router);
  }
}
