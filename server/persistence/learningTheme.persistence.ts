import { searchAndPaginate } from '../util/pagination/pagination.util';
import { PrismaSingleton } from './prismaSingleton';
import { PaginationParams } from '../util/types/pagination.types';
import { NotFoundError } from '../util/types/error.types';
import {
  LearningThemeSelectDetail,
  LearningThemeSelectShort,
} from '../util/selectInput/learningTheme.select';
import { LearningThemeCreateParams } from '../util/types/theme.types';

export class LearningThemePersistence {
  public async getThemes(paginationParams: PaginationParams) {
    return searchAndPaginate(
      PrismaSingleton.instance.learningTheme,
      {},
      paginationParams,
      undefined,
      LearningThemeSelectShort,
    );
  }

  public async getLearningThemeById(id: string) {
    const theme = await PrismaSingleton.instance.learningTheme.findUnique({
      where: {
        id: id,
      },
      select: LearningThemeSelectDetail,
    });

    if (!theme) {
      throw new NotFoundError(40416);
    }

    return theme;
  }

  public async createLearningTheme(data: LearningThemeCreateParams) {
    const theme = await PrismaSingleton.instance.learningTheme.create({
      data,
      select: LearningThemeSelectDetail,
    });
    return theme;
  }

  public async deleteLearningTheme(id: string) {
    return await PrismaSingleton.instance.learningTheme.delete({
      where: { id: id },
      select: LearningThemeSelectDetail,
    });
  }
}
