import { Prisma } from '@prisma/client';
import {
  AnnouncementByFilterParams,
  AnnouncementCreatePersistenceParams,
  AnnouncementUpdateParams,
  FilterType,
} from '../util/types/announcement.types';
import { PaginationParams } from '../util/types/pagination.types';
import { PrismaSingleton } from './prismaSingleton';
import {
  announcementSelectDetail,
  announcementSelectShort,
} from '../util/selectInput/announcement.select';
import { searchAndPaginate } from '../util/pagination/pagination.util';
import { BadRequestError, NotFoundError } from '../util/types/error.types';

//TODO : import prisma client from singleton

export class AnnouncementPersistence {
  public async getAnnouncements(
    filters: AnnouncementByFilterParams,
    paginationParams: PaginationParams,
  ) {
    const filterType = (filter: FilterType) => {
      switch (filter) {
        case FilterType.AFTER:
          return {
            gt: filters.timestamp,
          };
        case FilterType.BEFORE:
          return {
            lt: filters.timestamp,
          };
        case FilterType.EQUAL:
          return {
            equals: filters.timestamp,
          };
      }
    };

    const whereClause: Prisma.AnnouncementWhereInput = {
      AND: [
        filters.classId ? { classId: filters.classId } : {},
        filters.teacherId ? { teacherId: filters.teacherId } : {},
        filters.studentId
          ? {
              class: {
                students: {
                  some: {
                    id: filters.studentId,
                  },
                },
              },
            }
          : {},
        filters.timestamp
          ? {
              // must be present by constraint on AnnouncementByFilterParams
              createdAt: filterType(filters.timestampFilterType!!),
            }
          : {},
      ],
    };

    return searchAndPaginate(
      PrismaSingleton.instance.announcement,
      whereClause,
      paginationParams,
      undefined,
      announcementSelectShort,
    );
  }

  public async getAnnouncementById(id: string) {
    const announcement = await PrismaSingleton.instance.announcement.findUnique({
      where: {
        id: id,
      },
      select: announcementSelectDetail,
    });

    if (!announcement) {
      throw new NotFoundError(40408);
    }

    return announcement;
  }

  public async createAnnouncement(
    announcementCreateParams: AnnouncementCreatePersistenceParams,
    teacherId: string,
  ) {
    const { classId, ...data } = announcementCreateParams;
    return await PrismaSingleton.instance.announcement.create({
      data: {
        ...data,
        class: {
          connect: {
            id: classId,
          },
        },
        teacher: {
          connect: {
            id: teacherId,
          },
        },
      },
      select: announcementSelectDetail,
    });
  }

  public async updateAnnouncement(id: string, announcementUpdateParams: AnnouncementUpdateParams) {
    return await PrismaSingleton.instance.announcement.update({
      where: { id: id },
      data: announcementUpdateParams,
      select: announcementSelectDetail,
    });
  }

  public async checkAnnouncementIsFromTeacher(announcementId: string, teacherId: string) {
    const announcement = await PrismaSingleton.instance.announcement.findUnique({
      where: {
        id: announcementId,
        teacherId: teacherId,
      },
    });

    if (!announcement) {
      throw new BadRequestError(40037);
    }
  }
}
