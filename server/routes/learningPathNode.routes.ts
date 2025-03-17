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

  private getLearningPathNodeById = async (req: Request, res: Response) => {
    res.json(
      await this.learningPathNodeDomain.getLearningPathNodeById(req.params.id),
    );
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
     *               $ref: '#/components/schemas/LearningPathNodeGet'
     *       400:
     *         description: Bad request due to invalid input.
     *       401:
     *         description: Unauthorized, user not authenticated.
     *       500:
     *         description: Internal server error.
     */
    this.router.put("/", this.createLearningPathNode);
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
     *         description: LearningPathNode fetched succesfully.
     *       403:
     *         description: Unauthorized, user not authenticated.
     *       404:
     *         description: LearningPathNode not found.
     *       500:
     *         description: Internal server error.
     */
    this.router.get("/:id", this.getLearningPathNodeById);
  }
}
