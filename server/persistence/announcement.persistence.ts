import { Prisma, PrismaClient } from "@prisma/client";
import { AnnouncementByFilterParams, AnnouncementCreateParams, AnnouncementUpdateParams } from "../util/types/announcement.types";
import { PaginationParams } from "../util/types/pagination.types";


//TODO : import prisma client from singleton
const prisma = new PrismaClient();

export class AnnouncementPersistence {
    public async getAnnouncements(
        filters: AnnouncementByFilterParams,
        paginationParams: PaginationParams
    ) {
        const whereClause: Prisma.AnnouncementWhereInput = {
            AND: [
                filters.classId ? { classId: filters.classId } : {},
                filters.teacherId ? { teacherId: filters.teacherId } : {},
                filters.id ? { id: filters.id } : {},
                filters.studentId ?
                    {
                        class: {
                            students: {
                                some: {
                                    id: filters.studentId
                                }
                            }
                        }
                    } : {}
            ]
        };
        const [announcements, totalCount] = await prisma.$transaction([
            prisma.announcement.findMany({
                where: whereClause,
                include: {
                    class: true,
                    teacher: true
                },
                skip: paginationParams.skip,
                take: paginationParams.pageSize
            }),
            prisma.announcement.count({
                where: whereClause  // TODO this is probably not efficient
            })
        ]);

        return {
            announcements,
            totalPages: Math.ceil(totalCount / paginationParams.pageSize)
        };
    }

    public async createAnnouncement(announcementCreateParams: AnnouncementCreateParams) {
        const { classId, teacherId, ...data } = announcementCreateParams;
        const announcement = await prisma.announcement.create({
            data: {
                ...data,
                class: {
                    connect: {
                        id: classId
                    }
                },
                teacher: {
                    connect: {
                        id: teacherId
                    }
                }
            }
        });
        return announcement;
    }

    public async updateAnnouncement(announcementUpdateParams: AnnouncementUpdateParams) {

        const updateData: Partial<{ title: string; content: string }> = {};
        if (announcementUpdateParams.title !== undefined) {
            updateData.title = announcementUpdateParams.title;
        }
        if (announcementUpdateParams.content !== undefined) {
            updateData.content = announcementUpdateParams.content;
        }
        const updatedAnnouncement = await prisma.announcement.update({
            where: { id: announcementUpdateParams.id },
            data: updateData,
        });
        return updatedAnnouncement;
    }
}