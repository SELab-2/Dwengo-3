import { Prisma, PrismaClient } from "@prisma/client";
import {
  AnnouncementByFilterParams,
  AnnouncementCreateParams,
  AnnouncementUpdateParams,
} from "../util/types/announcement.types";
import { PaginationParams } from "../util/types/pagination.types";
import { PrismaSingleton } from "./prismaSingleton";

export class AnnouncementPersistence {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = PrismaSingleton.instance;
  }

  private buildWhereClause(
    filters: AnnouncementByFilterParams,
  ): Prisma.AnnouncementWhereInput {
    return {
      AND: [
        filters.classId ? { classId: filters.classId } : {},
        filters.teacherId ? { teacherId: filters.teacherId } : {},
        filters.id ? { id: filters.id } : {},
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
  }

  public async getAnnouncements(
    filters: AnnouncementByFilterParams,
    paginationParams: PaginationParams,
  ): Promise<{
    announcements: Prisma.AnnouncementGetPayload<{
      include: { class: true; teacher: true };
    }>[];
    totalPages: number;
  }> {
    const whereClause: Prisma.AnnouncementWhereInput =
      this.buildWhereClause(filters);

    const [announcements, totalCount]: [
      Prisma.AnnouncementGetPayload<{
        include: { class: true; teacher: true };
      }>[],
      number,
    ] = await PrismaSingleton.instance.$transaction([
      // TODO: this functionstructure is common for many endtypes, consider generalising it
      this.prisma.announcement.findMany({
        where: whereClause,
        include: {
          class: true,
          teacher: true,
        },
        skip: paginationParams.skip,
        take: paginationParams.pageSize,
      }),
      PrismaSingleton.instance.announcement.count({
        where: whereClause,
      }),
    ]);

    // TODO this also might be generalised
    return {
      announcements,
      totalPages: Math.ceil(totalCount / paginationParams.pageSize),
    };
  }

  public async createAnnouncement(
    announcementCreateParams: AnnouncementCreateParams,
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
    const updateData: Partial<{ title: string; content: string }> = {};
    if (announcementUpdateParams.title !== undefined) {
      updateData.title = announcementUpdateParams.title;
    }
    if (announcementUpdateParams.content !== undefined) {
      updateData.content = announcementUpdateParams.content;
    }
    const updatedAnnouncement =
      await PrismaSingleton.instance.announcement.update({
        where: { id: announcementUpdateParams.id },
        data: updateData,
      });
    return updatedAnnouncement;
  }
}
