import { AnnouncementPersistence } from '../persistence/announcement.persistence';
import { ClassDomain } from './class.domain';
import {
  AnnouncementByFilterParams,
  AnnouncementByFilterQueryParams,
  AnnouncementCreateDomainParams,
  AnnouncementCreateDomainSchema,
  AnnouncementFilterQuerySchema,
  AnnouncementUpdateParams,
  AnnouncementUpdateSchema,
} from '../util/types/announcement.types';
import { PaginationFilterSchema } from '../util/types/pagination.types';
import { ClassRoleEnum, UserEntity } from '../util/types/user.types';
import { BadRequestError } from '../util/types/error.types';
import { TeacherIdZod } from '../util/types/util_types';

export class AnnouncementDomain {
  private announcementPersistence;
  private classDomain;

  constructor() {
    this.announcementPersistence = new AnnouncementPersistence();
    this.classDomain = new ClassDomain();
  }

  public async getAnnouncements(query: AnnouncementByFilterQueryParams, user: UserEntity) {
    const pagination = PaginationFilterSchema.parse(query);
    const filterQuery: AnnouncementByFilterQueryParams = AnnouncementFilterQuerySchema.parse(query);
    const filter: AnnouncementByFilterParams = {
      classId: filterQuery.classId,
      teacherId: filterQuery.teacherId,
      studentId: filterQuery.studentId,
      timestamp: filterQuery.timestamp ? new Date(filterQuery.timestamp) : undefined,
      timestampFilterType: filterQuery.timestampFilterType,
    };

    // check if classId is used, user belongs to class
    if (query.classId) {
      await this.classDomain.checkUserBelongsToClass(user, query.classId);
    }

    // check if teacherId is used, it can not get other teacher announcements
    if (query.teacherId) {
      await this.checkUserIsTeacher(user);
      if (query.teacherId !== user.teacher?.id) {
        throw new BadRequestError(40010);
      }
    }

    // check if studentId is used, it can not get other student announcements
    if (query.studentId) {
      await this.checkUserIsStudent(user);
      if (query.studentId !== user.student?.id) {
        throw new BadRequestError(40011);
      }
    }

    return this.announcementPersistence.getAnnouncements(filter, pagination);
  }

  public async getAnnouncementById(id: string, user: UserEntity) {
    const announcement = await this.announcementPersistence.getAnnouncementById(id);

    const classId = announcement.class.id;
    await this.classDomain.checkUserBelongsToClass(user, classId);
    return announcement;
  }

  public async createAnnouncement(query: AnnouncementCreateDomainParams, user: UserEntity) {
    const announcementData = AnnouncementCreateDomainSchema.parse(query);

    await this.checkUserIsTeacher(user);
    await this.classDomain.checkUserBelongsToClass(user, query.classId);

    const teacherData = TeacherIdZod.parse(user.teacher?.id);

    return this.announcementPersistence.createAnnouncement(announcementData, teacherData);
  }

  public async updateAnnouncement(id: string, query: AnnouncementUpdateParams, user: UserEntity) {
    const data = AnnouncementUpdateSchema.parse(query);

    await this.checkUserIsTeacher(user);
    const teacherId = TeacherIdZod.parse(user.teacher?.id);
    await this.announcementPersistence.checkAnnouncementIsFromTeacher(id, teacherId);

    return this.announcementPersistence.updateAnnouncement(id, data);
  }

  private checkUserIsTeacher(user: UserEntity) {
    if (user.role !== ClassRoleEnum.TEACHER) {
      throw new BadRequestError(40012);
    }
  }

  private checkUserIsStudent(user: UserEntity) {
    if (user.role !== ClassRoleEnum.STUDENT) {
      throw new BadRequestError(40013);
    }
  }
}
