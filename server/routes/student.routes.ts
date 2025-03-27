import { Router, Request, Response } from 'express';
import { StudentDomain } from '../domain/student.domain';
import { getUserFromReq } from '../domain/user.domain';

export class StudentController {
  public router: Router;
  private studentDomain: StudentDomain;

  constructor() {
    this.router = Router();
    this.studentDomain = new StudentDomain();
    this.initializeRoutes();
  }

  private getStudents = async (req: Request, res: Response) => {
    res.json(await this.studentDomain.getStudents(req.query, await getUserFromReq(req)));
  };

  private getStudentById = async (req: Request, res: Response) => {
    res.json(await this.studentDomain.getStudentById(req.params.id, await getUserFromReq(req)));
  };

  private updateStudent = async (req: Request, res: Response) => {
    res.json(
      await this.studentDomain.updateStudent(req.params.id, req.body, await getUserFromReq(req)),
    );
  };

  private deleteStudent = async (req: Request, res: Response) => {
    res.json(await this.studentDomain.deleteStudent(req.params.id, await getUserFromReq(req)));
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
     *     requestBody:
     *       description: Optional filters for the query
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
     *               groupId:
     *                 type: string
     *                 format: uuid
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
    this.router.get('/', this.getStudents);
    /**
     * @swagger
     * /api/student/{id}:
     *   get:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - Student
     *     summary: Get a student by studentID
     *     description: Gets the content of a specific student selected by its UUID
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: The unique identifier of the student.
     *     responses:
     *       200:
     *         description: Student fetched succesfully.
     *       content:
     *        application/json:
     *         schema:
     *          $ref: '#/components/schemas/StudentDetail'
     *       403:
     *         description: Unauthorized, user not authenticated.
     *       404:
     *         description: Student not found.
     */
    this.router.get('/:id', this.getStudentById);
    /**
     * @swagger
     * /api/student/{id}:
     *   patch:
     *     security:
     *       - cookieAuth: []
     *     tags: [Student]
     *     summary: Update a student
     *     description: Updates a students classes and groups
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/StudentUpdate'
     *     responses:
     *       200:
     *         description: Succesfully updated the student
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/StudentDetail'
     *       401:
     *         description: Unauthorized, user not authenticated
     */
    this.router.patch('/id', this.updateStudent);
    /**
     * @swagger
     * /api/student/{id}:
     *   delete:
     *     security:
     *       - cookieAuth: []
     *     tags: [Student]
     *     summary: Delete a student
     *     description: Deletes a student
     *     responses:
     *       200:
     *         description: Succesfully deleted the student
     *       401:
     *         description: Unauthorized, user not authenticated
     */
    this.router.delete('/id', this.deleteStudent);
  }
}
