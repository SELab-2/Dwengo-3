import { Request, Response, Router } from 'express';
import { StudentDomain } from '../domain/student.domain';
import { UserDomain } from '../domain/user.domain';
import { isAuthenticated } from './auth.routes';

export class StudentController {
  public router: Router;
  private readonly studentDomain: StudentDomain;
  private readonly userDomain: UserDomain;

  constructor() {
    this.router = Router();
    this.studentDomain = new StudentDomain();
    this.userDomain = new UserDomain();
    this.initializeRoutes();
  }

  private getStudents = async (req: Request, res: Response) => {
    res.json(
      await this.studentDomain.getStudents(req.query, await this.userDomain.getUserFromReq(req)),
    );
  };

  private getStudentById = async (req: Request, res: Response) => {
    res.json(
      await this.studentDomain.getStudentById(
        req.params.id,
        await this.userDomain.getUserFromReq(req),
      ),
    );
  };

  private initializeRoutes() {
    /**
     * @swagger
     * /api/student:
     *   get:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - Student
     *     summary: Get list of students
     *     description: Fetches a list of students filtered by optional query parameters.
     *     parameters:
     *       - name: userId
     *         in: query
     *         description: Filter by user ID
     *         required: false
     *         schema:
     *           type: string
     *           format: uuid
     *       - name: classId
     *         in: query
     *         description: Filter by class ID
     *         required: false
     *         schema:
     *           type: string
     *           format: uuid
     *       - name: groupId
     *         in: query
     *         description: Filter by group ID
     *         required: false
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       200:
     *         description: Successfully fetched the list of students
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
     *                         $ref: '#/components/schemas/StudentShort'
     *       401:
     *         description: Unauthorized, user not authenticated
     */
    this.router.get('/', isAuthenticated, this.getStudents);

    /**
     * @swagger
     * /api/student/{id}:
     *   get:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - Student
     *     summary: Retrieve a student by their ID
     *     description: Fetches detailed information about a student identified by a unique UUID.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: The UUID of the student to retrieve.
     *     responses:
     *       200:
     *         description: Successfully retrieved the student details.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/StudentDetail'
     *       403:
     *         description: Unauthorized, user not authenticated.
     *       404:
     *         description: Student not found.
     */
    this.router.get('/:id', isAuthenticated, this.getStudentById);
  }
}
