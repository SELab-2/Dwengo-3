import { Router, Response, Request } from 'express';
import { AssignmentDomain } from '../domain/assignment.domain';
import { getUserFromReq } from '../domain/user.domain';

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
     *     description: Retrieve a list of assignments based on the provided filters. At least one filter must be provided.
     *     parameters:
     *       - in: query
     *         name: classId
     *         schema:
     *           type: string
     *         description: Filter assignments by class ID.
     *       - in: query
     *         name: groupId
     *         schema:
     *           type: string
     *         description: Filter assignments by group ID.
     *       - in: query
     *         name: teacherId
     *         schema:
     *           type: string
     *         description: Filter assignments by teacher ID.
     *       - in: query
     *         name: studentId
     *         schema:
     *           type: string
     *         description: Filter assignments by student ID.
     *     responses:
     *       200:
     *         description: A list of assignments matching the filters.
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/PaginatedResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       type: array
     *                       items:
     *                         $ref: '#/components/schemas/AssignmentShort'
     *       400:
     *         description: Bad request due to invalid input or no filters provided.
     *       401:
     *         description: Unauthorized, user not authenticated.
     */
    this.router.get('/', this.getAssignments.bind(this));
    /**
     * @swagger
     * /api/assignment/{id}:
     *   get:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - Assignment
     *     summary: Get an assignment by ID
     *     description: Gets the content of a specific assignment selected by its UUID.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: The unique identifier of the assignment.
     *     responses:
     *       200:
     *         description: Assignment fetched successfully.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/AssignmentDetail'
     *       403:
     *         description: Unauthorized, user not authenticated.
     *       404:
     *         description: Assignment not found.
     */
    this.router.get('/:id', this.getAssignmentById.bind(this));
    /**
     * @swagger
     * /api/assignment:
     *   put:
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
     *               $ref: '#/components/schemas/AssignmentDetail'
     *       400:
     *         description: Bad request due to invalid input.
     *       401:
     *         description: Unauthorized, user not authenticated.
     *       403:
     *         description: Forbidden, user does not have permission to create the assignment.
     */
    this.router.put('/', this.createAssignment.bind(this));
  }

  private async getAssignments(req: Request, res: Response): Promise<void> {
    res.json(
      await this.assignmentDomain.getAssignments(
        req.query,
        await getUserFromReq(req),
      ),
    );
  }

  private async getAssignmentById(req: Request, res: Response): Promise<void> {
    res.json(
      await this.assignmentDomain.getAssignmentById(
        req.params.id,
        await getUserFromReq(req),
      ),
    );
  }

  private async createAssignment(req: Request, res: Response): Promise<void> {
    res.json(
      await this.assignmentDomain.createAssigment(
        req.body,
        await getUserFromReq(req),
      ),
    );
  }
}
