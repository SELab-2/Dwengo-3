import { Router, Request, Response } from 'express';
import { UserDomain } from '../domain/user.domain';
import { FavoritesDomain } from '../domain/favorites.domain';
import { FavoriteFilterParams } from '../util/types/favorites.types';

export class FavoritesController {
  public router: Router;
  private favoritesDomain: FavoritesDomain;
  private readonly userDomain: UserDomain;

  constructor() {
    this.router = Router();
    this.favoritesDomain = new FavoritesDomain();
    this.userDomain = new UserDomain();
    this.initializeRoutes();
  }

  private getFavorites = async (req: Request, res: Response) => {
    const query = req.query as FavoriteFilterParams;
    res.json(await this.favoritesDomain.getFavorites(query, this.userDomain.getUserFromReq(req)));
  };

  private getFavoriteById = async (req: Request, res: Response) => {
    res.json(
      await this.favoritesDomain.getFavoriteById(
        req.params.id,
        this.userDomain.getUserFromReq(req),
      ),
    );
  };

  private createFavorite = async (req: Request, res: Response) => {
    res.json(
      await this.favoritesDomain.createFavorite(req.body, this.userDomain.getUserFromReq(req)),
    );
  };

  private deleteFavorite = async (req: Request, res: Response) => {
    res.json(
      await this.favoritesDomain.deleteFavorite(req.params.id, this.userDomain.getUserFromReq(req)),
    );
  };

  private initializeRoutes() {
    /**
     * @swagger
     * /api/favorites:
     *   get:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - Favorites
     *     summary: Get favorites
     *     description: Retrieve a list of favorites based on the userId
     *     parameters:
     *       - in: query
     *         name: userId
     *         schema:
     *           type: string
     *         description: Filter favorites by userId
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
     *                         $ref: '#/components/schemas/FavoriteShort'
     *       400:
     *         description: Bad request due to invalid input or no filters provided.
     *       403:
     *         description: Unauthorized, user not authenticated.
     */
    this.router.get('/', this.getFavorites);
    /**
     * @swagger
     * /api/favorites/{id}:
     *   get:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - Favorites
     *     summary: Get a favorite by ID
     *     description: Gets the content of a specific favorite selected by its UUID.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: The unique identifier of the favorite.
     *     responses:
     *       200:
     *         description: Favorite fetched successfully.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/FavoriteDetail'
     *       403:
     *         description: Unauthorized, user not authenticated.
     *       404:
     *         description: Favorite not found.
     */
    this.router.get('/:id', this.getFavoriteById);
    /**
     * @swagger
     * /api/favorites:
     *   put:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - Favorites
     *     summary: Create a favorite
     *     description: Creates a new favorite
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/FavoriteCreate'
     *     responses:
     *       201:
     *         description: Favorite created successfully.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/FavoriteDetail'
     *       400:
     *         description: Bad request due to invalid input.
     *       403:
     *         description: Unauthorized, user not authenticated.
     */
    this.router.put('/', this.createFavorite);
    /**
     * @swagger
     * /api/favorites/{id}:
     *   delete:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - Favorites
     *     summary: Delete a favorite
     *     description: Deletes a specific favorite by its unique identifier.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: The unique identifier of the favorite to delete.
     *     responses:
     *       200:
     *         description: Favorite deleted successfully.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/FavoriteDetail'
     *       403:
     *         description: Unauthorized, user not authenticated.
     *       404:
     *         description: Favorite not found.
     */
    this.router.delete('/:id', this.deleteFavorite);
  }
}
