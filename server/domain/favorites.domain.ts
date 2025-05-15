import { FavoritesPersistence } from '../persistence/favorites.persistence';
import { BadRequestError, NotFoundError } from '../util/types/error.types';
import {
  FavoriteCreateParams,
  FavoriteCreateSchema,
  FavoriteFilterParams,
  FavoriteFilterSchema,
} from '../util/types/favorites.types';
import { PaginationFilterSchema } from '../util/types/pagination.types';
import { UserEntity } from '../util/types/user.types';

export class FavoritesDomain {
  private favoritesPersistence: FavoritesPersistence;

  constructor() {
    this.favoritesPersistence = new FavoritesPersistence();
  }

  public async getFavorites(query: FavoriteFilterParams, user: UserEntity) {
    const pagination = PaginationFilterSchema.parse(query);
    const filter = FavoriteFilterSchema.parse(query);

    if (query.userId != user.id) {
      throw new BadRequestError(40042);
    }

    return await this.favoritesPersistence.getFavorites(filter, pagination);
  }

  public async getFavoriteById(id: string, user: UserEntity) {
    const favorite = await this.favoritesPersistence.getFavoriteById(id);
    if (!favorite) {
      throw new NotFoundError(40414);
    }

    if (favorite.user.id != user.id) {
      throw new BadRequestError(40042);
    }

    return favorite;
  }

  public async createFavorite(body: FavoriteCreateParams, user: UserEntity) {
    const data = FavoriteCreateSchema.parse(body);
    return await this.favoritesPersistence.createFavorite(data, user.id);
  }

  public async deleteFavorite(id: string, user: UserEntity) {
    const favorite = await this.favoritesPersistence.getFavoriteById(id);
    if (!favorite) {
      throw new NotFoundError(40414);
    }

    if (favorite.user.id != user.id) {
      throw new BadRequestError(40042);
    }

    return await this.favoritesPersistence.deleteFavorite(id);
  }
}
