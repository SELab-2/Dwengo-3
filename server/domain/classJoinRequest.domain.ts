import { PaginationFilterSchema } from "../util/types/pagination.types";
import { ClassJoinRequestScheme, ClassJoinRequestFilterSchema } from "../util/types/classJoinRequest.types";
import { ClassJoinRequestPersistence } from "../persistence/classJoinRequest.persistence";

export class ClassJoinRequestDomain {
  private classJoinRequestPersistance;

  constructor() {
    this.classJoinRequestPersistance = new ClassJoinRequestPersistence();
  }

  public async createClassJoinRequest(body: any) {
    const ClassJoinRequestParams = ClassJoinRequestScheme.safeParse(body);
    if (!ClassJoinRequestParams.success) {
      throw ClassJoinRequestParams.error;
    }

    return this.classJoinRequestPersistance.createClassJoinRequest(ClassJoinRequestParams.data);
  }

  public async getStudentJoinRequests(query: any) {
    const paginationResult = PaginationFilterSchema.safeParse(query);
    if (!paginationResult.success) {
      throw paginationResult.error;
    }

    const ClassJoinRequestFilterResult = ClassJoinRequestFilterSchema.safeParse(query);
    if (!ClassJoinRequestFilterResult.success) {
      throw ClassJoinRequestFilterResult.error;
    }

    return this.classJoinRequestPersistance.getStudentJoinRequests(paginationResult.data);
  }

}