import { Discussion } from "@prisma/client";
import { DiscussionPersistence } from "../persistence/discussion.persistence";
import { queryWithPaginationParser } from "../util/pagination/queryWithPaginationParser.util";
import {
  DiscussionCreateSchema,
  DiscussionFilterSchema,
} from "../util/types/discussion.types";

export class DiscussionDomain {
  private discussionPersistence: DiscussionPersistence;

  public constructor() {
    this.discussionPersistence = new DiscussionPersistence();
  }

  public async getDiscussions(
    query: any,
  ): Promise<{ data: Discussion[]; totalPages: number }> {
    const parseResult = queryWithPaginationParser(
      query,
      DiscussionFilterSchema,
    );
    return this.discussionPersistence.getDiscussions(
      parseResult.dataSchema,
      parseResult.dataPagination,
    );
  }

  public async createDiscussion(query: any): Promise<Discussion> {
    const parseResult = DiscussionCreateSchema.safeParse(query);
    if (!parseResult.success) {
      throw parseResult.error;
    }
    return this.discussionPersistence.createDiscussion(parseResult.data);
  }
}
