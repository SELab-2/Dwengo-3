import { Router, Request, Response } from 'express';
import { MessageDomain } from '../domain/message.domain';
import { getUserFromReq } from '../domain/user.domain';

export class MessageController {
  public router: Router;
  private messageDomain: MessageDomain;

  public constructor() {
    this.router = Router();
    this.messageDomain = new MessageDomain();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * @swagger
     * /api/message:
     *   get:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - Message
     *     summary: Get list of messages
     *     description: Fetches a list of messages filtered by discussionID
     *     parameters:
     *       - name: discussionId
     *         in: query
     *         description: Filter by discussion ID
     *         required: false
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       200:
     *         description: Successfully fetched list of messages
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
     *                         $ref: '#/components/schemas/MessageDetail'
     *       400:
     *         description: Bad request due to invalid parameters
     *       401:
     *         description: Unauthorized, user not authenticated
     */
    this.router.get('/', this.getMessages.bind(this));
    /**
     * @swagger
     * /api/message:
     *   put:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - Message
     *     summary: Create a message
     *     description: Create a new message
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/MessageCreate'
     *     responses:
     *       200:
     *         description: The created message
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/MessageDetail'
     *       400:
     *         description: Bad request due to invalid parameters
     *       401:
     *         description: Unauthorized, user not authenticated
     */
    this.router.put('/', this.createMessage.bind(this));
    /**
     * @swagger
     * /api/message/{id}:
     *   delete:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - Message
     *     summary: Delete a message
     *     description: Delete a message by ID
     *     parameters:
     *       - name: id
     *         in: path
     *         description: ID of the message to delete
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       200:
     *         description: The deleted message
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/MessageDetail'
     *       400:
     *         description: Bad request due to invalid parameters
     *       401:
     *         description: Unauthorized, user not authenticated
     */
    this.router.delete('/:id', this.deleteMessage.bind(this));
  }

  private async getMessages(req: Request, res: Response): Promise<void> {
    res.json(
      await this.messageDomain.getMessages(
        req.query,
        await getUserFromReq(req),
      ),
    );
  }

  private async createMessage(req: Request, res: Response): Promise<void> {
    res.json(
      await this.messageDomain.createMessage(
        req.body,
        await getUserFromReq(req),
      ),
    );
  }

  private async deleteMessage(req: Request, res: Response): Promise<void> {
    res.json(
      await this.messageDomain.deleteMessage(
        req.params.id,
        await getUserFromReq(req),
      ),
    );
  }
}
