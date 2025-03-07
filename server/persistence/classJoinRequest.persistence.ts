import { PrismaSingleton } from "../prismaSingleton";
import { PaginationParams } from "../util/types/pagination.types";
import { ClassJoinRequestParams } from "../util/types/classJoinRequest.types";

export class ClassJoinRequestPersistence {
  public async createClassJoinRequest(data: ClassJoinRequestParams) {
    // TODO: Implement this method once we have authentication so we can determine the userId of the requester.
    //return await PrismaSingleton.instance.classJoinRequest.update({

    //});
  }

  public async getStudentJoinRequests(paginationParams: PaginationParams) {
    const [classJoinRequests, totalCount] = await PrismaSingleton.instance.$transaction([
      PrismaSingleton.instance.classJoinRequest.findMany({
        skip: paginationParams.skip,
        take: paginationParams.pageSize,
      }),
      PrismaSingleton.instance.classJoinRequest.count(),
    ]);

    return {
      data: classJoinRequests,
      totalPages: Math.ceil(totalCount / paginationParams.pageSize),
    };
  }
}
