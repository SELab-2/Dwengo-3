import { AnnouncementByFilterParams, PaginationParams } from "../domain/types";

//import prisma client from somewhere

export class AnnouncementPersistence {
    public async getAnnouncements(
        filters: AnnouncementByFilterParams,
        paginationParams: PaginationParams
    ) {
        //TODO 


    }

    public async createAnnouncement(query: AnnouncementCreateParams) {
    }

    public async updateAnnouncement(id: string, query: AnnouncementUpdateParams) {
    }
}