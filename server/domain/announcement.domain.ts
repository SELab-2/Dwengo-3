import { AnnouncementPersistence } from "../persistence/announcement.persistence";
import { AnnouncementByFilterParams, AnnouncementCreateParams, AnnouncementFilterSchema, PaginationFilterSchema } from "./types";


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
            paginationParseResult.data
        );
    }

    public async createAnnouncement(query: AnnouncementCreateParams) {
        //TODO
    }

    public async updateAnnouncement(query: AnnouncementCreateParams) {
        //TODO 
    }

}