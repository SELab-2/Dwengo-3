import { Router, Request, Response } from 'express';
import { TeacherDomain } from '../domain/teacher.domain';
import { getUserFromReq } from '../domain/user.domain';

export class TeacherController {
  public router: Router;
  private teacherDomain: TeacherDomain;

  constructor() {
    this.router = Router();
    this.teacherDomain = new TeacherDomain();
    this.initializeRoutes();
  }

  private getTeachers = async (req: Request, res: Response) => {
    res.json(
      await this.teacherDomain.getTeachers(
        req.query,
        await getUserFromReq(req),
      ),
    );
  };

  private getTeacherById = async (req: Request, res: Response) => {
    res.json(await this.teacherDomain.getTeacherById(req.params.id));
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
     *     requestBody:
     *       required: false
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               userId:
     *                 type: string
     *                 format: uuid
     *               classId:
     *                 type: string
     *                 format: uuid
     *               assignmentId:
     *                 type: string
     *                 format: uuid
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
    this.router.get('/', this.getTeachers);
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
    this.router.get('/:id', this.getTeacherById);
  }
}
