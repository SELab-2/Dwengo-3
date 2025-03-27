import { Router, Request, Response } from 'express';
import { DiscussionDomain } from '../domain/discussion.domain';
import { getUserFromReq } from '../domain/user.domain';

export class DiscussionController {
  public router: Router;
  private discussionDomain: DiscussionDomain;

  public constructor() {
    this.router = Router();
    this.discussionDomain = new DiscussionDomain();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * @swagger
     * /api/discussion:
     *   get:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - Discussion
     *     summary: Get list of discussions
     *     description: Fetches a list of discussions filtered by groupIds
     *     parameters:
     *       - name: groupIds
     *         in: query
     *         description: Filter by group IDs (multiple values allowed)
     *         required: false
     *         schema:
     *           type: array
     *           items:
     *             type: string
     *     responses:
     *       200:
     *         description: Successfully fetched list of discussions
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
     *                         $ref: '#/components/schemas/DiscussionShort'
     *       400:
     *         description: Bad request due to invalid parameters
     *       401:
     *         description: Unauthorized, user not authenticated
     */
    this.router.get('/', this.getDiscussions.bind(this));
    /**
     * @swagger
     * /api/discussion/{id}:
     *   get:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - Discussion
     *     summary: Get a discussion by ID
     *     description: Gets the content of a specific discussion selected by its UUID.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: The UUID of the discussion to fetch
     *     responses:
     *       200:
     *         description: Successfully fetched the discussion
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/DiscussionDetail'
     *       403:
     *         description: Unauthorized, user not authenticated.
     *       404:
     *         description: Discussion not found.
     */
    this.router.get('/:id', this.getDiscussionById.bind(this));
    /**
     * @swagger
     * /api/discussion:
     *   put:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - Discussion
     *     summary: Create a new discussion
     *     description: Create a new discussion.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/DiscussionCreate'
     *     responses:
     *       200:
     *         description: Discussion successfully created
     *         content:
     *           application/json:
     *             schema:
     *                 $ref: '#/components/schemas/DiscussionDetail'
     *       400:
     *         description: Bad request due to invalid parameters
     *       401:
     *         description: Unauthorized, user not authenticated
     */
    this.router.put('/', this.createDiscussion.bind(this));
  }

  private async getDiscussions(req: Request, res: Response): Promise<void> {
    res.json(await this.discussionDomain.getDiscussions(req.query, await getUserFromReq(req)));
  }

  private async getDiscussionById(req: Request, res: Response): Promise<void> {
    res.json(
      await this.discussionDomain.getDiscussionById(req.params.id, await getUserFromReq(req)),
    );
  }

  private async createDiscussion(req: Request, res: Response): Promise<void> {
    res.json(await this.discussionDomain.createDiscussion(req.body, await getUserFromReq(req)));
  }
}
