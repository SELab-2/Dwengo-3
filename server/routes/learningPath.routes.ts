import { Request, Response, Router } from 'express';
import { LearningPathDomain } from '../domain/learningPath.domain';
import { UserDomain } from '../domain/user.domain';

export class LearningPathController {
  public router: Router;
  private learningPathDomain: LearningPathDomain;
  private readonly userDomain: UserDomain;

  constructor() {
    this.router = Router();
    this.learningPathDomain = new LearningPathDomain();
    this.userDomain = new UserDomain();
    this.initializeRoutes();
  }

  private getLearningPaths = async (req: Request, res: Response) => {
    res.json(await this.learningPathDomain.getLearningPaths(req.query));
  };

  private getLearningPathById = async (req: Request, res: Response) => {
    res.json(await this.learningPathDomain.getLearningPathById(req.params.id));
  };

  private createLearningPath = async (req: Request, res: Response) => {
    res.json(
      await this.learningPathDomain.createLearningPath(
        req.body,
        this.userDomain.getUserFromReq(req),
      ),
    );
  };

  // TODO : Add delete method as soon as an owner/creator attribute is added to the learningPath model

  private initializeRoutes() {
    /**
     * @swagger
     * /api/learningPath:
     *   get:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - LearningPath
     *     summary: Get list of learning paths
     *     description: >
     *       Fetches a list of learning paths filtered by optional query parameters:
     *       keywords, age, or learning path ID.
     *     parameters:
     *       - name: keywords
     *         in: query
     *         description: Filter by keywords (multiple values allowed)
     *         required: false
     *         schema:
     *           type: array
     *           items:
     *             type: string
     *       - name: age
     *         in: query
     *         description: Filter by age (multiple values allowed)
     *         required: false
     *         schema:
     *           type: array
     *           items:
     *             type: integer
     *     responses:
     *       200:
     *         description: A list of learning paths
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
     *                         $ref: '#/components/schemas/LearningPathShort'
     *       400:
     *         description: Bad request due to invalid parameters
     *       401:
     *         description: Unauthorized, user not authenticated
     */
    this.router.get('/', this.getLearningPaths);
    /**
     * @swagger
     * /api/learningPath/{id}:
     *   get:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - LearningPath
     *     summary: Get a learning path by ID
     *     description: Gets the content of a specific learning path selected by its UUID
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: The unique identifier of the learning path.
     *     responses:
     *       200:
     *         description: Learning path fetched succesfully.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/LearningPathDetail'
     *       403:
     *         description: Unauthorized, user not authenticated.
     *       404:
     *         description: Learning path not found.
     */
    this.router.get('/:id', this.getLearningPathById);
    /**
     * @swagger
     * /api/learningPath:
     *   put:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - LearningPath
     *     summary: Create a new (empty) learning path.
     *     description: Create a new (empty) learning path. It is not possible to create a learning path with nodes in one request.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/LearningPathCreate'
     *     responses:
     *       200:
     *         description: The created learning path
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/LearningPathDetail'
     */
    this.router.put('/', this.createLearningPath);
  }
}
