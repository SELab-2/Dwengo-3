import { Request, Response, Router } from "express";
import { ClassDomain } from "../domain/class.domain";
import { ClassJoinRequestController } from "./classJoinRequest.routes";
import { getUserFromReq } from "../domain/user.domain";

export class ClassController {
  public router: Router;
  private classDomain: ClassDomain;

  constructor() {
    this.router = Router();
    this.classDomain = new ClassDomain();
    this.initializeRoutes();
  }

  private getClasses = async (req: Request, res: Response) => {
    res.json(
      await this.classDomain.getClasses(req.query, await getUserFromReq(req)),
    );
  };

  private createClass = async (req: Request, res: Response) => {
    res.json(
      await this.classDomain.createClass(req.body, await getUserFromReq(req)),
    );
  };

  private updateClass = async (req: Request, res: Response) => {
    res.json(
      await this.classDomain.updateClass(req.body, await getUserFromReq(req)),
    );
  };

  private initializeRoutes() {
    this.router.get("/", this.getClasses);
    this.router.put("/", this.createClass);
    this.router.patch("/", this.updateClass);
    this.router.use("/", new ClassJoinRequestController().router);
  }
}
