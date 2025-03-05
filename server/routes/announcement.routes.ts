import { Request, Response, Router } from "express";
import { AnnouncementDomain } from "../domain/announcement.domain";

export class AnnouncementController {
    public router: Router;
    private announcementDomain: AnnouncementDomain;

    constructor() {
        this.router = Router();
        this.announcementDomain = new AnnouncementDomain();
        this.initializeRoutes();
    }

    private getAnnouncements = async (req: Request, res: Response) => {
        res.json(await this.announcementDomain.getAnnouncements(req.query));
    };

    private createAnnouncement = async (req: Request, res: Response) => {
        res.json(await this.announcementDomain.createAnnouncement(req.body));
    }

    private updateAnnouncement = async (req: Request, res: Response) => {
        res.json(await this.announcementDomain.updateAnnouncement(req.body));
    }

    private initializeRoutes() {
        this.router.put('/', this.createAnnouncement);
        this.router.get('/', this.getAnnouncements);
        this.router.patch('/', this.updateAnnouncement);
    }
}