import { ClassRole } from '@prisma/client';
import { UserEntity } from '../util/types/user.types';
import { BadRequestError } from '../util/types/error.types';
import { LearningThemePersistence } from '../persistence/learningTheme.persistence';
import {
  LearningThemeCreateSchema,
  LearningThemeDetail,
  LearningThemeShort,
} from '../util/types/theme.types';
import { PaginationFilterSchema } from '../util/types/pagination.types';

export class LearningThemeDomain {
  private themePersistence: LearningThemePersistence;

  public constructor() {
    this.themePersistence = new LearningThemePersistence();
  }

  public async getLearningThemes(
    query: any,
  ): Promise<{ data: LearningThemeShort[]; totalPages: number }> {
    const pagination = PaginationFilterSchema.parse(query);
    return this.themePersistence.getThemes(pagination);
  }

  public async getLearningThemeById(id: string): Promise<LearningThemeDetail> {
    return await this.themePersistence.getLearningThemeById(id);
  }

  public async createLearningTheme(query: any, user: UserEntity): Promise<LearningThemeDetail> {
    const data = LearningThemeCreateSchema.parse(query);
    if (user.role !== ClassRole.TEACHER) {
      throw new BadRequestError(40046);
    }

    return this.themePersistence.createLearningTheme(data);
  }

  public async deleteLearningTheme(id: string, user: UserEntity): Promise<LearningThemeDetail> {
    if (user.role !== ClassRole.TEACHER) {
      throw new BadRequestError(40046);
    }

    return this.themePersistence.deleteLearningTheme(id);
  }
}
