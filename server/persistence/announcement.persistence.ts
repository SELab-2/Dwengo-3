import { Prisma } from "@prisma/client";
import {
  AnnouncementByFilterParams,
  AnnouncementCreatePersistenceParams,
  AnnouncementUpdateParams,
} from "../util/types/announcement.types";
import { PaginationParams } from "../util/types/pagination.types";
import { PrismaSingleton } from "./prismaSingleton";

//TODO : import prisma client from singleton

export class AnnouncementPersistence {
  public async getAnnouncements(
    filters: AnnouncementByFilterParams,
    paginationParams: PaginationParams,
  ) {
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
      ],
    };
    const [announcements, totalCount] =
      await PrismaSingleton.instance.$transaction([
        PrismaSingleton.instance.announcement.findMany({
          where: whereClause,
          include: {
            teacher: {
              select: {
                id: true,
                user: {
                  select: {
                    name: true,
                    surname: true,
                  },
                },
              },
            },
            class: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          skip: paginationParams.skip,
          take: paginationParams.pageSize,
        }),
        PrismaSingleton.instance.announcement.count({
          where: whereClause, // TODO this is probably not efficient
        }),
      ]);

    return {
      announcements,
      totalPages: Math.ceil(totalCount / paginationParams.pageSize),
    };
  }

  public async getAnnouncementById(id: string) {
    const announcement = await PrismaSingleton.instance.announcement.findUnique(
      {
        where: {
          id: id,
        },
        include: {
          teacher: {
            select: {
              id: true,
              user: {
                select: {
                  name: true,
                  surname: true,
                },
              },
            },
          },
          class: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    );

    if (!announcement) {
      throw new Error(`Announcement with id: ${id} was not found`);
    }

    return announcement;
  }

  public async createAnnouncement(
    announcementCreateParams: AnnouncementCreatePersistenceParams,
  ) {
    const { classId, teacherId, ...data } = announcementCreateParams;
    const announcement = await PrismaSingleton.instance.announcement.create({
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
    });
    return announcement;
  }

  public async updateAnnouncement(
    announcementUpdateParams: AnnouncementUpdateParams,
  ) {
    const { id, ...data } = announcementUpdateParams;
    const updatedAnnouncement =
      await PrismaSingleton.instance.announcement.update({
        where: { id: id },
        data: data,
      });
    return updatedAnnouncement;
  }
}
