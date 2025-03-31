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
    this.router.get('/', this.getFavorites);
    this.router.get('/:id', this.getFavoriteById);
    this.router.put('/', this.createFavorite);
    this.router.delete('/:id', this.deleteFavorite);
  }
}
