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
    this.router.get('/', this.getAssignments.bind(this));
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
