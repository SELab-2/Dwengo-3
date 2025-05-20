import { Request, Response, Router } from 'express';
import { LearningPathNodeDomain } from '../domain/learningPathNode.domain';
import { UserDomain } from '../domain/user.domain';
import { isAuthenticated } from './auth.routes';

export class LearningPathNodeController {
  public router: Router;
  private learningPathNodeDomain: LearningPathNodeDomain;
  private readonly userDomain: UserDomain;

  constructor() {
    this.router = Router();
    this.learningPathNodeDomain = new LearningPathNodeDomain();
    this.userDomain = new UserDomain();
    this.initializeRoutes();
  }

  private createLearningPathNode = async (req: Request, res: Response) => {
    res.json(
      await this.learningPathNodeDomain.createLearningPathNode(
        req.body,
        await this.userDomain.getUserFromReq(req),
      ),
    );
  };

  private getLearningPathNodeById = async (req: Request, res: Response) => {
    res.json(await this.learningPathNodeDomain.getLearningPathNodeById(req.params.id));
  };

  private initializeRoutes() {
    /**
     * @swagger
     * /api/learningPathNode:
     *   put:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - LearningPathNode
     *     summary: Create a new learning path node
     *     description: Creates a new learning path node with the provided data.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/LearningPathNodeCreate'
     *     responses:
     *       201:
     *         description: Learning path node created successfully.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/LearningPathNodeDetail'
     *       400:
     *         description: Bad request due to invalid input.
     *       401:
     *         description: Unauthorized, user not authenticated.
     */
    this.router.put('/', isAuthenticated, this.createLearningPathNode);
    /**
     * @swagger
     * /api/learningPathNode/{id}:
     *   get:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - LearningPathNode
     *     summary: Get a learningPathNode by ID
     *     description: Gets the content of a specific learningPathNode selected by its UUID
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: The unique identifier of the learningPathNode.
     *     responses:
     *       200:
     *         description: LearningPathNode fetched successfully.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/LearningPathNodeDetail'
     *       403:
     *         description: Unauthorized, user not authenticated.
     *       404:
     *         description: LearningPathNode not found.
     */
    this.router.get('/:id', isAuthenticated, this.getLearningPathNodeById);
  }
}
