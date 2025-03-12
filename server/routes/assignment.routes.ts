import { Router, Response, Request } from "express";
import { AssignmentDomain } from "../domain/assignment.domain";

export class AssignmentController {
  public router: Router;
  private assignmentDomain: AssignmentDomain;

  public constructor() {
    this.router = Router();
    this.assignmentDomain = new AssignmentDomain();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    /**
     * @swagger
     * /api/assignment:
     *   get:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - Assignment
     *     summary: Get assignments
     *     description: Retrieve a list of assignments based on the provided filters.
     *     parameters:
     *       - in: query
     *         name: classId
     *         schema:
     *           type: string
     *           format: uuid
     *         description: Filter assignments by class ID.
     *       - in: query
     *         name: teacherId
     *         schema:
     *           type: string
     *           format: uuid
     *         description: Filter assignments by teacher ID.
     *       - in: query
     *         name: learningPathId
     *         schema:
     *           type: string
     *           format: uuid
     *         description: Filter assignments by learning path ID.
     *       - in: query
     *         name: groupId
     *         schema:
     *           type: string
     *           format: uuid
     *         description: Filter assignments by group ID.
     *     responses:
     *       200:
     *         description: A list of assignments matching the filters.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/AssignmentGet'
     *       400:
     *         description: Bad request due to invalid input.
     *       401:
     *         description: Unauthorized, user not authenticated.
     *       500:
     *         description: Internal server error.
     */
    this.router.get("/", this.getAssignments.bind(this));
    /**
     * @swagger
     * /api/assignment:
     *   post:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - Assignment
     *     summary: Create an assignment
     *     description: Create a new assignment with the provided data.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/AssignmentCreate'
     *     responses:
     *       201:
     *         description: Assignment created successfully.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/AssignmentGet'
     *       400:
     *         description: Bad request due to invalid input.
     *       401:
     *         description: Unauthorized, user not authenticated.
     *       403:
     *         description: Forbidden, user does not have permission to create the assignment.
     *       500:
     *         description: Internal server error.
     */
    this.router.post("/", this.createAssignment.bind(this));
  }

  private async getAssignments(req: Request, res: Response): Promise<void> {
    res.json(await this.assignmentDomain.getAssignments(req.query));
  }

  private async createAssignment(req: Request, res: Response): Promise<void> {
    res.json(await this.assignmentDomain.createAssigment(req.body));
  }
}
