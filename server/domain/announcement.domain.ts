import { AnnouncementPersistence } from "../persistence/announcement.persistence";
import { ClassPersistence } from "../persistence/class.persistence";
import { AnnouncementByFilterParams, AnnouncementCreateParams, AnnouncementCreateSchema, AnnouncementFilterSchema, AnnouncementUpdateParams, AnnouncementUpdateSchema } from "../util/types/announcement.types";
import { PaginationFilterSchema } from "../util/types/pagination.types";
import { ClassRoleEnum, UserEntity } from "../util/types/user.types";



export class AnnouncementDomain {
    private announcementPersistence;
    private classPersistence;

    constructor() {
        this.announcementPersistence = new AnnouncementPersistence();
        this.classPersistence = new ClassPersistence();
    }

    public async getAnnouncements(
        query: AnnouncementByFilterParams,
        user: UserEntity,
    ) {
        const paginationParseResult = PaginationFilterSchema.safeParse(query);
        if (!paginationParseResult.success) {
            throw paginationParseResult.error;
        }

        const filterResult = AnnouncementFilterSchema.safeParse(query);
        if (!filterResult.success) {
            throw filterResult.error;
        }

        // TODO 
        

        return this.announcementPersistence.getAnnouncements(
            filterResult.data,
            paginationParseResult.data
        );
    }

    public async createAnnouncement(
        query: AnnouncementCreateParams,
        user: UserEntity,
    ) {
        const parseResult = AnnouncementCreateSchema.safeParse(query);
        if (!parseResult.success) {
            throw parseResult.error;
        }

        this.checkTeacherBelongsToClass(user, query.classId);

        return this.announcementPersistence.createAnnouncement(parseResult.data);
    }

    public async updateAnnouncement(
        query: AnnouncementUpdateParams,
        user: UserEntity,
    ) {
        const parseResult = AnnouncementUpdateSchema.safeParse(query);
        if (!parseResult.success) {
            throw parseResult.error;
        }

        this.checkTeacherBelongsToClass(user, query.id);

        return this.announcementPersistence.updateAnnouncement(parseResult.data);
    }

    private async checkTeacherBelongsToClass(
        user: UserEntity,
        classId: string,
    ) {
        // Check if user is a teacher
        if (user.role !== ClassRoleEnum.TEACHER) {
            throw new Error("User must be a teacher to create an announcement.");
        }

        // Check if classId belongs to teacher
        const classById = await this.classPersistence.getClassById(classId);
        const exists = classById?.teachers.some(teacher => teacher.id === user.teacher?.id);
        if (exists) {
            throw new Error("User does not belong to the class.");
        }
    }
}