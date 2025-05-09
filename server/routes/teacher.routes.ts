import { Router, Request, Response } from 'express';
import { TeacherDomain } from '../domain/teacher.domain';
import { UserDomain } from '../domain/user.domain';
import { isAuthenticated } from './auth.routes';

export class TeacherController {
  public router: Router;
  private teacherDomain: TeacherDomain;
  private readonly userDomain: UserDomain;

  constructor() {
    this.router = Router();
    this.teacherDomain = new TeacherDomain();
    this.userDomain = new UserDomain();
    this.initializeRoutes();
  }

  private getTeachers = async (req: Request, res: Response) => {
    res.json(
      await this.teacherDomain.getTeachers(req.query, await this.userDomain.getUserFromReq(req)),
    );
  };

  private getTeacherById = async (req: Request, res: Response) => {
    res.json(await this.teacherDomain.getTeacherById(req.params.id));
  };

  private deleteTeacher = async (req: Request, res: Response) => {
    res.json(
      await this.teacherDomain.deleteTeacher(
        req.params.id, 
        await this.userDomain.getUserFromReq(req),
      ),
    );
  };

  private initializeRoutes() {
    /**
     * @swagger
     * /api/teacher:
     *   get:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - Teacher
     *     summary: Get list of teachers
     *     description: Fetches a list of teachers filtered by optional query parameters.
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
     *       - name: assignmentId
     *         in: query
     *         description: Filter by assignment ID
     *         required: false
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       200:
     *         description: A list of teachers
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
     *                         $ref: '#/components/schemas/TeacherShort'
     *       401:
     *         description: Unauthorized
     */
    this.router.get('/', isAuthenticated, this.getTeachers);
    /**
     * @swagger
     * /api/teacher/{id}:
     *   get:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - Teacher
     *     summary: Get a teacher by TeacherID
     *     description: Gets the content of a specific teacher selected by its UUID
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: The unique identifier of the teacher.
     *     responses:
     *       200:
     *         description: Teacher fetched succesfully.
     *       403:
     *         description: Unauthorized, user not authenticated.
     *       404:
     *         description: Teacher not found.
     */
    this.router.get('/:id', isAuthenticated, this.getTeacherById);

    this.router.delete('/:id', isAuthenticated, this.deleteTeacher);
  }
}
