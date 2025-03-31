import { Prisma } from '@prisma/client';
import { searchAndPaginate } from '../util/pagination/pagination.util';
import { PrismaSingleton } from './prismaSingleton';
import { PaginationParams } from '../util/types/pagination.types';
import { FavoriteCreateParams, FavoriteFilterParams } from '../util/types/favorites.types';
import { FavoriteSelectDetail, FavoriteSelectShort } from '../util/selectInput/favorites.select';
import { NotFoundError } from '../util/types/error.types';

export class FavoritesPersistence {
  public async getFavorites(filters: FavoriteFilterParams, paginationParams: PaginationParams) {
    const whereClause: Prisma.FavoriteWhereInput = {
      AND: [filters.userId ? { userId: filters.userId } : {}],
    };

    return searchAndPaginate(
      PrismaSingleton.instance.favorite,
      whereClause,
      paginationParams,
      undefined,
      FavoriteSelectShort,
    );
  }

  public async getFavoriteById(id: string) {
    const favorite = await PrismaSingleton.instance.favorite.findUnique({
      where: {
        id: id,
      },
      select: FavoriteSelectDetail,
    });

    if (!favorite) {
      throw new NotFoundError(40414);
    }

    return favorite;
  }

  public async createFavorite(data: FavoriteCreateParams, userId: string) {
    const favorite = await PrismaSingleton.instance.favorite.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        learningPath: {
          connect: {
            id: data.learningPathId,
          },
        },
      },
      select: FavoriteSelectDetail,
    });
    return favorite;
  }

  public async deleteFavorite(id: string) {
    return await PrismaSingleton.instance.favorite.delete({
      where: { id: id },
      select: FavoriteSelectDetail,
    });
  }

  public async updateProgress(id: string, new_progress: number[]) {
    return await PrismaSingleton.instance.favorite.update({
      where: { id: id },
      data: {
        progress: new_progress,
      },
    });
  }
}
