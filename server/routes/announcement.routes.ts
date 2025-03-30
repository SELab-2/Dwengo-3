import { Request, Response, Router } from 'express';
import { AnnouncementDomain } from '../domain/announcement.domain';
import { getUserFromReq } from '../domain/user.domain';

export class AnnouncementController {
  public router: Router;
  private announcementDomain: AnnouncementDomain;

  constructor() {
    this.router = Router();
    this.announcementDomain = new AnnouncementDomain();
    this.initializeRoutes();
  }

  private getAnnouncements = async (req: Request, res: Response) => {
    res.json(await this.announcementDomain.getAnnouncements(req.query, await getUserFromReq(req)));
  };

  private getAnnouncementById = async (req: Request, res: Response) => {
    res.json(
      await this.announcementDomain.getAnnouncementById(req.params.id, await getUserFromReq(req)),
    );
  };

  private createAnnouncement = async (req: Request, res: Response) => {
    res.json(await this.announcementDomain.createAnnouncement(req.body, await getUserFromReq(req)));
  };

  private updateAnnouncement = async (req: Request, res: Response) => {
    res.json(
      await this.announcementDomain.updateAnnouncement(
        req.params.id,
        req.body,
        await getUserFromReq(req),
      ),
    );
  };

  private initializeRoutes() {
    /**
     * @swagger
     * /api/announcement:
     *   put:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - Announcement
     *     summary: Create an announcement
     *     description: Creates a new announcement
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/AnnouncementCreate'
     *     responses:
     *       201:
     *         description: Announcement created successfully.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/AnnouncementDetail'
     *       400:
     *         description: Bad request due to invalid input.
     *       401:
     *         description: Unauthorized, user not authenticated.
     */
    this.router.put('/', this.createAnnouncement);
    /**
     * @swagger
     * /api/announcement:
     *   get:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - Announcement
     *     summary: Get announcements
     *     description: Retrieve a list of announcements based on the provided filters. At least one filter must be provided.
     *     parameters:
     *       - in: query
     *         name: classId
     *         schema:
     *           type: string
     *         description: Filter announcements by class ID.
     *       - in: query
     *         name: teacherId
     *         schema:
     *           type: string
     *         description: Filter announcements by teacher ID.
     *       - in: query
     *         name: studentId
     *         schema:
     *           type: string
     *         description: Filter announcements by student ID.
     *     responses:
     *       200:
     *         description: A list of announcements matching the filters.
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
     *                         $ref: '#/components/schemas/AnnouncementShort'
     *       400:
     *         description: Bad request due to invalid input or no filters provided.
     *       401:
     *         description: Unauthorized, user not authenticated.
     */
    this.router.get('/', this.getAnnouncements);
    /**
     * @swagger
     * /api/announcement/{id}:
     *   get:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - Announcement
     *     summary: Get an announcement by ID
     *     description: Gets the content of a specific announcement selected by its UUID.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: The unique identifier of the announcement.
     *     responses:
     *       200:
     *         description: Announcement fetched successfully.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/AnnouncementDetail'
     *       403:
     *         description: Unauthorized, user not authenticated.
     *       404:
     *         description: Announcement not found.
     */
    this.router.get('/:id', this.getAnnouncementById);
    /**
     * @swagger
     * /api/announcement/{id}:
     *   patch:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - Announcement
     *     summary: Update an announcement
     *     description: Updates an existing announcement with the provided data.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: The unique identifier of the announcement.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/AnnouncementUpdate'
     *     responses:
     *       200:
     *         description: Announcement updated successfully.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/AnnouncementDetail'
     *       400:
     *         description: Bad request due to invalid input.
     *       401:
     *         description: Unauthorized, user not authenticated.
     *       403:
     *         description: Forbidden, user does not have permission to update the announcement.
     *       404:
     *         description: Announcement not found.
     */
    this.router.patch('/:id', this.updateAnnouncement);
  }
}
