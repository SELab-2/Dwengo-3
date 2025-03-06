import { PrismaClient} from "@prisma/client";
import { PrismaSingleton } from "./prismaSingleton"
import { DiscussionFilterParams } from "../util/types/discussion.types";
import { PaginationParams } from "../util/types/pagination.types";

export class DiscussionPersistence {
    private prisma: PrismaClient;

    public constructor() {
        this.prisma = PrismaSingleton.instance;
    }

    public async getDiscussion(
        filters: DiscussionFilterParams,
        paginationParams: PaginationParams
    ): Promise Discussion{

    }
}