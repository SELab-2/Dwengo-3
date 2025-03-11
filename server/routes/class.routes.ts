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
    /**
     * @swagger
     * /api/class:
     *   get:
     *     tags: [Class]
     *     summary: Get list of classes
     *     description: Fetches a list of classes filtered by optional query parameters such as teacherId, studentId, or class ID.
     *     parameters:
     *       - name: teacherId
     *         in: query
     *         description: Filter by teacher ID
     *         required: false
     *         schema:
     *           type: string
     *           format: uuid
     *       - name: studentId
     *         in: query
     *         description: Filter by student ID
     *         required: false
     *         schema:
     *           type: string
     *           format: uuid
     *       - name: id
     *         in: query
     *         description: Filter by class ID
     *         required: false
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       200:
     *         description: Successfully fetched list of classes
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: string
     *                     description: Unique identifier for the class
     *                   name:
     *                     type: string
     *                     description: Name of the class
     *                   teacherId:
     *                     type: string
     *                     description: ID of the teacher associated with the class
     *                   studentCount:
     *                     type: integer
     *                     description: Number of students in the class
     *       500:
     *         description: Server error
     */
    this.router.get("/", this.getClasses);
    this.router.put("/", this.createClass);
    this.router.patch("/", this.updateClass);
    this.router.use("/", new ClassJoinRequestController().router);
  }
}
