import { Request, Response, Router } from 'express';
import { LearningObjectDomain } from '../domain/learningObject.domain';
import { UserDomain } from '../domain/user.domain';
import { isAuthenticated } from './auth.routes';

export class LearningObjectController {
  public router: Router;
  private learningObjectDomain: LearningObjectDomain;
  private readonly userDomain: UserDomain;

  constructor() {
    this.router = Router();
    this.learningObjectDomain = new LearningObjectDomain();
    this.userDomain = new UserDomain();
    this.initializeRoutes();
  }

  private createLearningObject = async (req: Request, res: Response) => {
    res.json(
      await this.learningObjectDomain.createLearningObject(
        req.body,
        await this.userDomain.getUserFromReq(req),
      ),
    );
  };

  private getLearningObjects = async (req: Request, res: Response) => {
    res.json(await this.learningObjectDomain.getLearningObjects(req.query));
  };

  private getLearningObjectById = async (req: Request, res: Response) => {
    res.json(await this.learningObjectDomain.getLearningObjectById(req.params.id));
  };

  private updateLearningObject = async (req: Request, res: Response) => {
    res.json(
      await this.learningObjectDomain.updateLearningObject(
        req.params.id,
        req.body,
        await this.userDomain.getUserFromReq(req),
      ),
    );
  };

  private deleteLearningObject = async (req: Request, res: Response) => {
    res.json(
      await this.learningObjectDomain.deleteLearningObject(
        req.params.id,
        await this.userDomain.getUserFromReq(req),
      ),
    );
  };

  private initializeRoutes() {
    /**
     * @swagger
     * /api/learningObject:
     *   put:

     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - LearningObject
     *     summary: Create a new learning object
     *     description: Creates a new learning object with the provided data.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/LearningObjectCreate'
     *     responses:
     *       201:
     *         description: Learning object created successfully.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/LearningObjectDetail'
     *       400:
     *         description: Bad request due to invalid input.
     *       403:
     *         description: Unauthorized, user not authenticated.
     */
    this.router.put('/', isAuthenticated, this.createLearningObject);
    /**
     * @swagger
     * /api/learningObject:
     *   get:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - LearningObject
     *     summary: Get learning objects
     *     description: Retrieve a list of learning objects based on the provided filters.
     *     parameters:
     *       - in: query
     *         name: keywords
     *         schema:
     *           type: array
     *           items:
     *             type: string
     *         description: Keywords to filter learning objects by.
     *       - in: query
     *         name: targetAges
     *         schema:
     *           type: array
     *           items:
     *             type: integer
     *         description: Target age groups to filter learning objects by.
     *     responses:
     *       200:
     *         description: A list of learning objects matching the filters.
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
     *                         $ref: '#/components/schemas/LearningObjectShort'
     *       400:
     *         description: Bad request due to invalid input.
     *       403:
     *         description: Unauthorized, user not authenticated.
     */
    this.router.get('/', isAuthenticated, this.getLearningObjects);
    /**
     * @swagger
     * /api/learningObject/{id}:
     *   get:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - LearningObject
     *     summary: Get a learning object by ID
     *     description: Gets the content of a specific learning object selected by its UUID
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: The unique identifier of the learning object.
     *     responses:
     *       200:
     *         description: Learning object fetched succesfully.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/LearningObjectDetail'
     *       403:
     *         description: Unauthorized, user not authenticated.
     *       404:
     *         description: Learning object not found.
     */
    this.router.get('/:id', isAuthenticated, this.getLearningObjectById);
    /**
     * @swagger
     * /api/learningObject/{id}:
     *   patch:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - LearningObject
     *     summary: Update a learning object
     *     description: Update an existing learning object with the provided data.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: The unique identifier of the learning object to delete.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/LearningObjectUpdate'
     *     responses:
     *       200:
     *         description: Learning object updated successfully.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/LearningObjectDetail'
     *       400:
     *         description: Bad request due to invalid input.
     *       403:
     *         description: Unauthorized, user not authenticated.
     */
    this.router.patch('/:id', isAuthenticated, this.updateLearningObject);
    /**
     * @swagger
     * /api/learningObject/{id}:
     *   delete:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - LearningObject
     *     summary: Delete a learning object
     *     description: Deletes a specific learning object by its unique identifier.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: The unique identifier of the learning object to delete.
     *     responses:
     *       204:
     *         description: Learning object deleted successfully.
     *       403:
     *         description: Unauthorized, user not authenticated.
     *       404:
     *         description: Learning object not found.
     */
    this.router.delete('/:id', isAuthenticated, this.deleteLearningObject);
  }
}
