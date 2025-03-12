import { Router, Request, Response } from "express";
import { MessageDomain } from "../domain/message.domain";

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
         *     description: >
         *       Fetches a list of messages filtered by optional query parameters:
         *       keywords, age, or message ID.
         *     parameters:
         *       - name: id
         *         in: query
         *         description: Filter by message ID
         *         required: false
         *         schema:
         *           type: string
         *       - name: dicussionId
         *         in: query
         *         description: Filter by discussion ID
         *         required: false
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: A list of messages
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 $ref: '#/components/schemas/Message'
         *       400:
         *         description: Bad request due to invalid parameters
         *       401:
         *         description: Unauthorized, user not authenticated
         *       500:
         *         description: Internal server error
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
         *               $ref: '#/components/schemas/Message'
         *       400:
         *         description: Bad request due to invalid parameters
         *       401:
         *         description: Unauthorized, user not authenticated
         *       500:
         *         description: Internal server error
         */
        this.router.put('/', this.createMessage.bind(this));
        //this.router.patch('/', this.updateMessage.bind(this));

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
         *           type: integer
         *     responses:
         *       200:
         *         description: The deleted message
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Message'
         *       400:
         *         description: Bad request due to invalid parameters
         *       401:
         *         description: Unauthorized, user not authenticated
         *       500:
         *         description: Internal server error
         */
        this.router.delete('/:id', this.deleteMessage.bind(this));
    }

    private async getMessages(req: Request, res: Response): Promise<void> {
        res.json(await this.messageDomain.getMessages(req.query));
    }

    private async createMessage(req: Request, res: Response): Promise<void> {
        res.json(await this.messageDomain.createMessage(req.body));
    }

    private async updateMessage(req: Request, res: Response): Promise<void> {
        res.json(await this.messageDomain.updateMessage(req.body));
    }

    private async deleteMessage(req: Request, res: Response): Promise<void> {
        res.json(await this.messageDomain.deleteMessage(req.params.id));
    }
}