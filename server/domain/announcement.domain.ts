import { AnnouncementByFilterParams, AnnouncementFilterSchema, PaginationFilterSchema } from "./types";


export class AnnouncementDomain {
    private announcementPersistence;

    constructor() {
        this.announcementPersistence = new AnnouncementPersistence();
    }

    public async getAnnouncements(query: AnnouncementByFilterParams) {
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
            paginationParseResult.data
        );
    }

    public async createAnnouncement(query: AnnouncementCreateParams) {
    }

    public async updateAnnouncement(id: string, query: AnnouncementUpdateParams) {
    }

}