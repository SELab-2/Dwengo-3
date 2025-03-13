import { Router, Request, Response } from "express";
import { TeacherDomain } from "../domain/teacher.domain";
import { getUserFromReq } from "../domain/user.domain";

export class TeacherController {
  public router: Router;
  private teacherDomain: TeacherDomain;

  constructor() {
    this.router = Router();
    this.teacherDomain = new TeacherDomain();
    this.initializeRoutes();
  }

  private createTeacher = async (req: Request, res: Response) => {
    res.json(await this.teacherDomain.createTeacher(req.body));
  };

  private getTeachers = async (req: Request, res: Response) => {
    res.json(
      await this.teacherDomain.getTeachers(
        req.query,
        await getUserFromReq(req),
      ),
    );
  };

  private updateTeacher = async (req: Request, res: Response) => {
    res.json(
      await this.teacherDomain.updateTeacher(
        req.body,
        await getUserFromReq(req),
      ),
    );
  };

  private deleteTeacher = async (req: Request, res: Response) => {
    res.json(
      await this.teacherDomain.deleteTeacher(
        req.body,
        await getUserFromReq(req),
      ),
    );
  };

  private initializeRoutes() {
    // TODO: swagger documentation

    this.router.post("/", this.createTeacher);
    this.router.get("/", this.getTeachers);
    this.router.put("/", this.updateTeacher);
    this.router.delete("/", this.deleteTeacher);
  }
}
