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
import { UpdateIndexParams } from '../util/types/group.types';

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

  async updateIndex(params: UpdateIndexParams) {
    const favorite = await this.favoritesPersistence.getFavoriteById(params.id);

    if (favorite === null) {
      throw new BadRequestError(40055);
    }

    // -1 is seen as the "end" of the learning path
    if (favorite.currentNodeIndex > params.index && params.index !== -1) {
      throw new BadRequestError(40052);
    }

    return await this.favoritesPersistence.updateIndex(params.id, params.index);
  }
}
