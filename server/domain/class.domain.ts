import { ClassPersistence } from "../persistence/class.persistence";
import { PaginationFilterSchema } from "../util/types/pagination.types";
import {
  ClassFilterSchema,
  ClassCreateSchema,
  UUIDValidationScheme,
  ClassJoinRequestScheme,
} from "../util/types/class.types";

export class ClassDomain {
  private classPersistance;

  constructor() {
    this.classPersistance = new ClassPersistence();
  }

  public async getClasses(query: any) {
    // Validate and parse pagination query parameters
    const paginationResult = PaginationFilterSchema.safeParse(query);
    if (!paginationResult.success) {
      throw paginationResult.error;
    }

    // Validate and parse class filters
    const filtersResult = ClassFilterSchema.safeParse(query);
    if (!filtersResult.success) {
      throw filtersResult.error;
    }

    return this.classPersistance.getClasses(
      paginationResult.data,
      filtersResult.data
    );
  }

  public async createClass(body: any) {
    // Validate and parse class create parameters
    const createParamsResult = ClassCreateSchema.safeParse(body);
    if (!createParamsResult.success) {
      throw createParamsResult.error;
    }

    return this.classPersistance.createClass(createParamsResult.data);
  }

  public async deleteClass(query: any) {
    // TODO: check if the person who is deleting this class is the owner of the class once we have authentication.
    // Validate and check for a valid UUID.
    const UUIDParamsResult = UUIDValidationScheme.safeParse(query);
    if (!UUIDParamsResult.success) {
      throw UUIDParamsResult.error;
    }

    return this.classPersistance.deleteClass(UUIDParamsResult.data);
  }

  public async createClassJoinRequest(body: any) {
    const ClassJoinRequestParams = ClassJoinRequestScheme.safeParse(body);
    if (!ClassJoinRequestParams.success) {
      throw ClassJoinRequestParams.error;
    }

    return this.classPersistance.createClassJoinRequest(ClassJoinRequestParams.data);
  }
}
