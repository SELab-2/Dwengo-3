import { Request, Response, Router } from 'express';
import { ClassDomain } from '../domain/class.domain';
import { ClassJoinRequestController } from './classJoinRequest.routes';
import { UserDomain } from '../domain/user.domain';
import { isAuthenticated } from './auth.routes';

export class ClassController {
  public router: Router;
  private classDomain: ClassDomain;
  private readonly userDomain: UserDomain;

  constructor() {
    this.router = Router();
    this.classDomain = new ClassDomain();
    this.userDomain = new UserDomain();
    this.initializeRoutes();
  }

  private getClasses = async (req: Request, res: Response) => {
    res.json(
      await this.classDomain.getClasses(req.query, await this.userDomain.getUserFromReq(req)),
    );
  };

  private getClassById = async (req: Request, res: Response) => {
    res.json(
      await this.classDomain.getClassById(req.params.id, await this.userDomain.getUserFromReq(req)),
    );
  };

  private createClass = async (req: Request, res: Response) => {
    res.json(
      await this.classDomain.createClass(req.body, await this.userDomain.getUserFromReq(req)),
    );
  };

  private updateClass = async (req: Request, res: Response) => {
    res.json(
      await this.classDomain.updateClass(
        req.params.id,
        req.body,
        await this.userDomain.getUserFromReq(req),
      ),
    );
  };

  private deleteTeacherFromClass = async (req: Request, res: Response) => {
    await this.classDomain.removeTeacherFromClass(
      req.params.id,
      req.params.teacherId,
      await this.userDomain.getUserFromReq(req),
    );
    res.status(200).send();
  };

  private deleteStudentFromClass = async (req: Request, res: Response) => {
    await this.classDomain.removeStudentFromClass(
      req.params.id,
      req.params.studentId,
      await this.userDomain.getUserFromReq(req),
    );
    res.status(200).send();
  };

  private initializeRoutes() {
    this.router.use('/', new ClassJoinRequestController().router);

    /**
     * @swagger
     * /api/class:
     *   get:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - Class
     *     summary: Get list of classes
     *     description: Fetches a list of classes filtered by optional query parameters such as teacher ID or student ID.
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
     *     responses:
     *       200:
     *         description: Successfully fetched list of classes
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
     *                         $ref: '#/components/schemas/ClassShort'
     *       401:
     *         description: Unauthorized, user not authenticated
     */
    this.router.get('/', isAuthenticated, this.getClasses);

    /**
     * @swagger
     * /api/class/{id}:
     *   get:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - Class
     *     summary: Get a class by ID
     *     description: Gets the content of a specific class selected by its UUID.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: The unique identifier of the class.
     *     responses:
     *       200:
     *         description: Class fetched successfully.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ClassDetail'
     *       401:
     *         description: Unauthorized, user not authenticated.
     *       404:
     *         description: Class not found.
     */
    this.router.get('/:id', isAuthenticated, this.getClassById);

    /**
     * @swagger
     * /api/class:
     *   put:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - Class
     *     summary: Create a new class
     *     description: Allows a teacher to create a new class.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 description: Name of the class
     *     responses:
     *       200:
     *         description: Class successfully created
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ClassDetail'
     *       400:
     *         description: Bad request due to invalid parameters
     *       401:
     *         description: Unauthorized, user not authenticated
     */
    this.router.put('/', isAuthenticated, this.createClass);

    /**
     * @swagger
     * /api/class/{id}:
     *   patch:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - Class
     *     summary: Update a class
     *     description: Allows a teacher of the class to update its details.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: The unique identifier of the class.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *            $ref: '#/components/schemas/ClassUpdate'
     *     responses:
     *       200:
     *         description: Class successfully updated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ClassDetail'
     *       400:
     *         description: Bad request due to invalid parameters
     *       401:
     *         description: Unauthorized, user not authenticated
     */
    this.router.patch('/:id', isAuthenticated, this.updateClass);

    /**
     * @swagger
     * /api/class/{id}/teacher/{teacherId}:
     *   delete:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - Class
     *     summary: Remove a teacher from a class
     *     description: Allows a teacher to remove a teacher from a specific class.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: The unique identifier of the class.
     *       - in: path
     *         name: teacherId
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: The unique identifier of the teacher.
     *     responses:
     *       200:
     *         description: Teacher successfully removed from the class.
     *       401:
     *         description: Unauthorized, user not authenticated.
     *       404:
     *         description: Class or teacher not found.
     */
    this.router.delete('/:id/teacher/:teacherId', isAuthenticated, this.deleteTeacherFromClass);

    /**
     * @swagger
     * /api/class/{id}/student/{studentId}:
     *   delete:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - Class
     *     summary: Remove a student from a class
     *     description: Allows a teacher to remove a student from a specific class.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: The unique identifier of the class.
     *       - in: path
     *         name: studentId
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: The unique identifier of the student.
     *     responses:
     *       200:
     *         description: Student successfully removed from the class.
     *       401:
     *         description: Unauthorized, user not authenticated.
     *       404:
     *         description: Class or student not found.
     */
    this.router.delete('/:id/student/:studentId', isAuthenticated, this.deleteStudentFromClass);
  }
}
