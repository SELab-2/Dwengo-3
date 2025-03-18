import { AnnouncementPersistence } from "../persistence/announcement.persistence";
import { ClassDomain } from "./class.domain";
import {
  AnnouncementByFilterParams,
  AnnouncementCreateDomainParams,
  AnnouncementCreateDomainSchema,
  AnnouncementFilterSchema,
  AnnouncementUpdateParams,
  AnnouncementUpdateSchema,
  TeacherIdSchema,
} from "../util/types/announcement.types";
import { PaginationFilterSchema } from "../util/types/pagination.types";
import { ClassRoleEnum, UserEntity } from "../util/types/user.types";

export class AnnouncementDomain {
  private announcementPersistence;
  private classDomain;

  constructor() {
    this.announcementPersistence = new AnnouncementPersistence();
    this.classDomain = new ClassDomain();
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

    // check if classId is used, user belongs to class
    if (query.classId) {
      this.classDomain.checkUserBelongsToClass(user, query.classId);
    }

    // check if teacherId is used, it can not get other teacher announcements
    if (query.teacherId) {
      this.checkUserIsTeacher(user);
      if (query.teacherId !== user.teacher?.id) {
        throw new Error("Can not get announcements of other teacher.");
      }
    }

    // check if studentId is used, it can not get other student announcements
    if (query.studentId) {
      this.checkUserIsStudent(user);
      if (query.studentId !== user.student?.id) {
        throw new Error("Can not get announcements of other user.");
      }
    }

    // check if id is used, announcement belongs to class of user
    if (query.id) {
      const res = await this.announcementPersistence.getAnnouncements(
        { id: query.id },
        paginationParseResult.data,
      );
      if (res.announcements.length !== 0) {
        const resClassId = res.announcements[0].classId;
        this.classDomain.checkUserBelongsToClass(user, resClassId);
      }
    }
    return this.announcementPersistence.getAnnouncements(
      filterResult.data,
      paginationParseResult.data,
    );
  }

  public async createAnnouncement(
    query: AnnouncementCreateDomainParams,
    user: UserEntity,
  ) {
    const parseResult = AnnouncementCreateDomainSchema.safeParse(query);
    if (!parseResult.success) {
      throw parseResult.error;
    }

    this.checkUserIsTeacher(user);
    this.classDomain.checkUserBelongsToClass(user, query.classId);

    const teacherIdParseResult = TeacherIdSchema.safeParse(user.teacher?.id);
    if (!teacherIdParseResult.success) {
      throw teacherIdParseResult.error;
    }
    return this.announcementPersistence.createAnnouncement({
      ...parseResult.data,
      teacherId: teacherIdParseResult.data,
    });
  }

  public async updateAnnouncement(
    query: AnnouncementUpdateParams,
    user: UserEntity,
  ) {
    const parseResult = AnnouncementUpdateSchema.safeParse(query);
    if (!parseResult.success) {
      throw parseResult.error;
    }

    this.checkUserIsTeacher(user);
    this.classDomain.checkUserBelongsToClass(user, query.id);

    return this.announcementPersistence.updateAnnouncement(parseResult.data);
  }

  private async checkUserIsTeacher(user: UserEntity) {
    if (user.role !== ClassRoleEnum.TEACHER) {
      throw new Error("User is not a teacher.");
    }
  }

  private async checkUserIsStudent(user: UserEntity) {
    if (user.role !== ClassRoleEnum.STUDENT) {
      throw new Error("User is not a student.");
    }
  }
}
