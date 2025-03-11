import { Router, Request, Response } from "express";
import { LearningPathNodeDomain } from "../domain/learningPathNode.domain";
import { getUserFromReq } from "../domain/user.domain";

export class LearningPathNodeController {
  public router: Router;
  private learningPathNodeDomain: LearningPathNodeDomain;

  constructor() {
    this.router = Router();
    this.learningPathNodeDomain = new LearningPathNodeDomain();
    this.initializeRoutes();
  }

  private createLearningPathNode = async (req: Request, res: Response) => {
    res.json(
      await this.learningPathNodeDomain.createLearningPathNode(
        req.body,
        await getUserFromReq(req),
      ),
    );
  };

  private initializeRoutes() {
    /**
     * @swagger
     * /api/learningPathNode:
     *   post:
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
     *               $ref: '#/components/schemas/LearningPathNodeGet'
     *       400:
     *         description: Bad request due to invalid input.
     *       401:
     *         description: Unauthorized, user not authenticated.
     *       500:
     *         description: Internal server error.
     */
    this.router.post("/", this.createLearningPathNode);
  }
}
