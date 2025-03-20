import { Request, Response, Router } from 'express';
import { ClassDomain } from '../domain/class.domain';
import { ClassJoinRequestController } from './classJoinRequest.routes';
import { getUserFromReq } from '../domain/user.domain';

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

  private getClassById = async (req: Request, res: Response) => {
    res.json(
      await this.classDomain.getClassById(
        req.params.id,
        await getUserFromReq(req),
      ),
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
     *     security:
     *       - cookieAuth: []
     *     tags: [Class]
     *     summary: Get list of classes
     *     description: Fetches a list of classes filtered by optional query parameters such as teacher ID or student ID
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
     *       401:
     *         description: Unauthorized, user not authenticated
     *       500:
     *         description: Server error
     */
    this.router.get('/', this.getClasses);
    /**
     * @swagger
     * /api/class/{id}:
     *   get:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - Class
     *     summary: Get a class by ID
     *     description: Gets the content of a specific class selected by its UUID
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
     *         description: Class fetched succesfully.
     *       403:
     *         description: Unauthorized, user not authenticated.
     *       404:
     *         description: Class not found.
     *       500:
     *         description: Internal server error.
     */
    this.router.get('/:id', this.getClassById);
    /**
     * @swagger
     * /api/class:
     *   put:
     *     security:
     *       - cookieAuth: []
     *     tags: [Class]
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
     *       400:
     *         description: Bad request due to invalid parameters
     *       401:
     *         description: Unauthorized, user not authenticated
     *       500:
     *         description: Server error
     */
    this.router.put('/', this.createClass);

    /**
     * @swagger
     * /api/class:
     *   patch:
     *     security:
     *       - cookieAuth: []
     *     tags: [Class]
     *     summary: Update a class
     *     description: Allows a teacher of the class to update its details.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               id:
     *                 type: string
     *                 format: uuid
     *                 description: Unique identifier for the class
     *               name:
     *                 type: string
     *                 description: Updated name of the class (optional)
     *     responses:
     *       200:
     *         description: Class successfully updated
     *       400:
     *         description: Bad request due to invalid parameters
     *       401:
     *         description: Unauthorized, user not authenticated
     *       500:
     *         description: Server error
     */
    this.router.patch('/', this.updateClass);
    this.router.use('/', new ClassJoinRequestController().router);
  }
}
