import { Request, Response, Router } from 'express';
import { UserDomain } from '../domain/user.domain';
import { isAuthenticated } from './auth.routes';
import { LearningThemeDomain } from '../domain/learningTheme.domain';

export class LearningThemeController {
  public router: Router;
  private themeDomain: LearningThemeDomain;
  private readonly userDomain: UserDomain;

  constructor() {
    this.router = Router();
    this.themeDomain = new LearningThemeDomain();
    this.userDomain = new UserDomain();
    this.initializeRoutes();
  }

  private getLearningThemes = async (req: Request, res: Response) => {
    res.json(await this.themeDomain.getLearningThemes(req.query));
  };

  private getLearningThemeById = async (req: Request, res: Response) => {
    res.json(await this.themeDomain.getLearningThemeById(req.params.id));
  };

  private createLearningTheme = async (req: Request, res: Response) => {
    res.json(
      await this.themeDomain.createLearningTheme(
        req.body,
        await this.userDomain.getUserFromReq(req),
      ),
    );
  };

  private deleteLearningTheme = async (req: Request, res: Response) => {
    await this.themeDomain.deleteLearningTheme(
      req.params.id,
      await this.userDomain.getUserFromReq(req),
    );
    res.status(200).send();
  };

  private initializeRoutes() {
    /**
     * @swagger
     * /api/learningTheme:
     *   get:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - LearningTheme
     *     summary: Get list of learning themes
     *     description: Fetches a list of learning themes.
     *     responses:
     *       200:
     *         description: Successfully fetched list of learning themes
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
     *                         $ref: '#/components/schemas/LearningThemeShort'
     *       401:
     *         description: Unauthorized, user not authenticated
     */
    this.router.get('/', isAuthenticated, this.getLearningThemes);

    /**
     * @swagger
     * /api/learningTheme/{id}:
     *   get:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - LearningTheme
     *     summary: Get a learningTheme by ID
     *     description: Gets the content of a specific learningTheme selected by its UUID.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: The unique identifier of the learningTheme.
     *     responses:
     *       200:
     *         description: LearningTheme fetched successfully.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/LearningThemeDetail'
     *       401:
     *         description: Unauthorized, user not authenticated.
     *       404:
     *         description: LearningTheme not found.
     */
    this.router.get('/:id', isAuthenticated, this.getLearningThemeById);

    /**
     * @swagger
     * /api/learningTheme:
     *   put:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - LearningTheme
     *     summary: Create a new learning theme
     *     description: Allows a teacher to create a new learningTheme.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/LearningThemeCreate'
     *     responses:
     *       200:
     *         description: LearningTheme successfully created
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/LearningThemeDetail'
     *       400:
     *         description: Bad request due to invalid parameters
     *       401:
     *         description: Unauthorized, user not authenticated
     */
    this.router.put('/', isAuthenticated, this.createLearningTheme);

    /**
     * @swagger
     * /api/learningTheme/{id}:
     *   delete:
     *     security:
     *       - cookieAuth:
     *     tags:
     *       - LearningTheme
     *     summary: Delete a learning theme
     *     description: Allows a teacher to delete a specific learningTheme.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: The unique identifier of the learningTheme.
     *     responses:
     *       200:
     *         description: LearningTheme successfully deleted
     *       401:
     *         description: Unauthorized, user not authenticated.
     *       404:
     *         description: LearningTheme not found.
     */
    this.router.delete('/:id', isAuthenticated, this.deleteLearningTheme);
  }
}
