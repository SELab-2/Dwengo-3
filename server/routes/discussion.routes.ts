import { Router, Request, Response } from 'express';
import { DiscussionDomain } from '../domain/discussion.domain';
import { UserDomain } from '../domain/user.domain';
import { isAuthenticated } from './auth.routes';

export class DiscussionController {
  public router: Router;
  private discussionDomain: DiscussionDomain;
  private readonly userDomain: UserDomain;

  public constructor() {
    this.router = Router();
    this.discussionDomain = new DiscussionDomain();
    this.userDomain = new UserDomain();
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
     *     description: Fetches a list of discussions by userId
     *     parameters:
     *       - name: userId
     *         in: query
     *         description: Filter by userId
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *       - name: assignmentId
     *         in: query
     *         description: Filter by assignmentId
     *         required: false
     *         schema:
     *           type: string
     *           format: uuid
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
    this.router.get('/', isAuthenticated, this.getDiscussions.bind(this));
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
    this.router.get('/:id', isAuthenticated, this.getDiscussionById.bind(this));
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
    this.router.put('/', isAuthenticated, this.createDiscussion.bind(this));
  }

  private async getDiscussions(req: Request, res: Response): Promise<void> {
    res.json(
      await this.discussionDomain.getDiscussions(
        req.query,
        await this.userDomain.getUserFromReq(req),
      ),
    );
  }

  private async getDiscussionById(req: Request, res: Response): Promise<void> {
    res.json(
      await this.discussionDomain.getDiscussionById(
        req.params.id,
        await this.userDomain.getUserFromReq(req),
      ),
    );
  }

  private async createDiscussion(req: Request, res: Response): Promise<void> {
    res.json(
      await this.discussionDomain.createDiscussion(
        req.body,
        await this.userDomain.getUserFromReq(req),
      ),
    );
  }
}
