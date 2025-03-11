import { Router, Request, Response } from "express";
import { DiscussionDomain } from "../domain/discussion.domain";
import { getUserFromReq } from "../domain/user.domain";

export class DiscussionController {
    public router: Router;
    private discussionDomain: DiscussionDomain;

    public constructor() {
        this.router = Router();
        this.discussionDomain = new DiscussionDomain();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', this.getDiscussions.bind(this));
        this.router.put('/', this.createDiscussion.bind(this));
    }

    private async getDiscussions(req: Request, res: Response): Promise<void> {
        res.json(await this.discussionDomain.getDiscussions(req.query, await getUserFromReq(req)));
    }

    private async createDiscussion(req: Request, res: Response): Promise<void> {
        res.json(await this.discussionDomain.createDiscussion(req.body, await getUserFromReq(req)));
    }
}