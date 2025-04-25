import { Router, Request, Response } from 'express';
import { LearningPathNodeTransitionDomain } from '../domain/learningPathNodeTransition.domain';
import { UserDomain } from '../domain/user.domain';
import { isAuthenticated } from './auth.routes';

export class LearningPathNodeTransitionController {
  public router: Router;
  private LearningPathNodeTransitionDomain: LearningPathNodeTransitionDomain;
  private readonly userDomain: UserDomain;

  constructor() {
    this.router = Router();
    this.LearningPathNodeTransitionDomain = new LearningPathNodeTransitionDomain();
    this.userDomain = new UserDomain();
    this.initializeRoutes();
  }

  private createLearningPathNodeTransition = async (req: Request, res: Response) => {
    res.json(
      await this.LearningPathNodeTransitionDomain.createLearningPathNodeTransition(
        req.body,
        await this.userDomain.getUserFromReq(req),
      ),
    );
  };

  private initializeRoutes() {
    /**
     * @swagger
     * /api/learningPathNodeTransition:
     *   put:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - LearningPathNodeTransition
     *     summary: Create a new learning path node transition
     *     description: Creates a new transition between two learning path nodes with the provided data.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/LearningPathNodeTransitionCreate'
     *     responses:
     *       201:
     *         description: Learning path node transition created successfully.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/LearningPathNodeTransitionDetail'
     *       400:
     *         description: Bad request due to invalid input.
     *       401:
     *         description: Unauthorized, user not authenticated.
     */
    this.router.put('/', isAuthenticated, this.createLearningPathNodeTransition);
  }
}
