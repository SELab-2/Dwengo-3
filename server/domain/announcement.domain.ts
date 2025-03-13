import { AnnouncementPersistence } from "../persistence/announcement.persistence";
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
import { UserEntity } from "../util/types/user.types";

export class AnnouncementDomain {
  private announcementPersistence;

  constructor() {
    this.announcementPersistence = new AnnouncementPersistence();
  }

  public async getAnnouncements(query: AnnouncementByFilterParams) {
    // TODO check if the request is allowed by checking the cookies

    const paginationParseResult = PaginationFilterSchema.safeParse(query);
    if (!paginationParseResult.success) {
      throw paginationParseResult.error;
    }

    const filterResult = AnnouncementFilterSchema.safeParse(query);
    if (!filterResult.success) {
      throw filterResult.error;
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
    // TODO check if this is allowed by using cookies

    const parseResult = AnnouncementCreateDomainSchema.safeParse(query);
    if (!parseResult.success) {
      throw parseResult.error;
    }

    const teacherIdParseResult = TeacherIdSchema.safeParse(user.teacher?.id);
    if (!teacherIdParseResult.success) {
      throw teacherIdParseResult.error;
    }

    return this.announcementPersistence.createAnnouncement({
      ...parseResult.data,
      teacherId: teacherIdParseResult.data,
    });
  }

  public async updateAnnouncement(query: AnnouncementUpdateParams) {
    // TODO check if this is allowed by using cookies

    const parseResult = AnnouncementUpdateSchema.safeParse(query);
    if (!parseResult.success) {
      throw parseResult.error;
    }
    return this.announcementPersistence.updateAnnouncement(parseResult.data);
  }
}
