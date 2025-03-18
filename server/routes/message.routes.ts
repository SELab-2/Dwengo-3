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
    this.router.get('/', this.getMessages.bind(this));
    this.router.put('/', this.createMessage.bind(this));
    //this.router.patch('/', this.updateMessage.bind(this));
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

  private async updateMessage(req: Request, res: Response): Promise<void> {
    res.json(await this.messageDomain.updateMessage(req.body));
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
