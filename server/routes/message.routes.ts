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
        this.router.get('/', this.getMessages.bind(this));
        this.router.put('/', this.createMessages.bind(this));
    }

    private async getMessages(req: Request, res: Response): Promise<void> {
        res.json(await this.messageDomain.getMessages(req.query));
    }

    private async createMessages(req: Request, res: Response): Promise<void> {
        res.json(await this.messageDomain.createMessage(req.body));
    }
}