import { Router, Request, Response } from "express";
import { DiscussionDomain } from "../domain/discussion.domain";

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
         *     description: >
         *       Fetches a list of discussions filtered by optional query parameters:
         *       discussion ID or group IDs.
         *     parameters:
         *       - name: id
         *         in: query
         *         description: Filter by discussion ID
         *         required: false
         *         schema:
         *           type: string
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
         *         description: List of discussions
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 $ref: '#/components/schemas/Discussion'
         *       400:
         *         description: Bad request due to invalid parameters
         *       401:
         *         description: Unauthorized, user not authenticated
         *       500:
         *         description: Internal server error
         */
        this.router.get('/', this.getDiscussions.bind(this));
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
         *         description: List of discussions
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 $ref: '#/components/schemas/Discussion'
         *       400:
         *         description: Bad request due to invalid parameters
         *       401:
         *         description: Unauthorized, user not authenticated
         *       500:
         *         description: Internal server error
         */
        this.router.put('/', this.createDiscussion.bind(this));
    }

    private async getDiscussions(req: Request, res: Response): Promise<void> {
        res.json(await this.discussionDomain.getDiscussions(req.query));
    }

    private async createDiscussion(req: Request, res: Response): Promise<void> {
        res.json(await this.discussionDomain.createDiscussion(req.body));
    }
}