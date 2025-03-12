import { Request, Response, Router } from "express";
import { AnnouncementDomain } from "../domain/announcement.domain";
import { getUserFromReq } from "../domain/user.domain";

export class AnnouncementController {
  public router: Router;
  private announcementDomain: AnnouncementDomain;

  constructor() {
    this.router = Router();
    this.announcementDomain = new AnnouncementDomain();
    this.initializeRoutes();
  }

  private getAnnouncements = async (req: Request, res: Response) => {
    res.json(
      await this.announcementDomain.getAnnouncements(
        req.query,
        await getUserFromReq(req),
      ),
    );
  };

  private createAnnouncement = async (req: Request, res: Response) => {
    res.json(
      await this.announcementDomain.createAnnouncement(
        req.body,
        await getUserFromReq(req),
      ),
    );
  };

  private updateAnnouncement = async (req: Request, res: Response) => {
    res.json(
      await this.announcementDomain.updateAnnouncement(
        req.body,
        await getUserFromReq(req),
      ),
    );
  };

  private initializeRoutes() {
    this.router.put("/", this.createAnnouncement);
    this.router.get("/", this.getAnnouncements);
    this.router.patch("/", this.updateAnnouncement);
  }
}
