

export class AnnouncementDomain {
    private announcementPersistence;

    constructor() {
        this.announcementPersistence = new AnnouncementPersistence();
    }

    public async getAnnouncements(query: AnnouncementByFilterParams) {
    }

    public async createAnnouncement(query: AnnouncementCreateParams) {
    }

    public async updateAnnouncement(id: string, query: AnnouncementUpdateParams) {
    }

}