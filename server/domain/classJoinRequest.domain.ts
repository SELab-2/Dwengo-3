import { PaginationFilterSchema } from "../util/types/pagination.types";
import {
  ClassJoinRequestCreateScheme,
  ClassJoinRequestDecisionSchema,
  ClassJoinRequestFilterSchema,
  ClassJoinRequestGetType,
} from "../util/types/classJoinRequest.types";
import { ClassJoinRequestPersistence } from "../persistence/classJoinRequest.persistence";

export class ClassJoinRequestDomain {
  private classJoinRequestPersistance: ClassJoinRequestPersistence;

  constructor() {
    this.classJoinRequestPersistance = new ClassJoinRequestPersistence();
  }

  public async createClassJoinRequest(body: unknown) {
    const ClassJoinRequestParams = ClassJoinRequestCreateScheme.safeParse(body);
    if (!ClassJoinRequestParams.success) {
      throw ClassJoinRequestParams.error;
    }

    return this.classJoinRequestPersistance.createClassJoinRequest(
      ClassJoinRequestParams.data,
    );
  }

  public async getJoinRequests(type: ClassJoinRequestGetType, query: unknown) {
    const paginationResult = PaginationFilterSchema.safeParse(query);
    if (!paginationResult.success) {
      throw paginationResult.error;
    }

    const ClassJoinRequestFilterResult =
      ClassJoinRequestFilterSchema.safeParse(query);
    if (!ClassJoinRequestFilterResult.success) {
      throw ClassJoinRequestFilterResult.error;
    }

    return this.classJoinRequestPersistance.getJoinRequests(
      type,
      paginationResult.data,
      ClassJoinRequestFilterResult.data,
    );
  }

  public async handleJoinRequest(body: unknown) {
    const ClassJoinRequestDecisionParams =
      ClassJoinRequestDecisionSchema.safeParse(body);
    if (!ClassJoinRequestDecisionParams.success) {
      throw ClassJoinRequestDecisionParams.error;
    }

    return this.classJoinRequestPersistance.handleJoinRequest(
      ClassJoinRequestDecisionParams.data,
    );
  }
}
