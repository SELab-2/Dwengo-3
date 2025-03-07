import { ClassPersistence } from "../persistence/class.persistence";
import { PaginationFilterSchema } from "../util/types/pagination.types";
import {
  ClassFilterSchema,
  ClassCreateSchema,
  ClassUpdateSchema,
} from "../util/types/class.types";

export class ClassDomain {
  private classPersistance;

  constructor() {
    this.classPersistance = new ClassPersistence();
  }

  public async getClasses(query: any) {
    // TODO: check if the person requesting is in the requested classes.
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
    // TODO: check if the person creating is a teacher.
    // Validate and parse class create parameters
    const createParamsResult = ClassCreateSchema.safeParse(body);
    if (!createParamsResult.success) {
      throw createParamsResult.error;
    }

    return this.classPersistance.createClass(createParamsResult.data);
  }

  public async updateClass(body: any) {
    // TODO: check if the person updating is owner.
    // Validate and parse class update parameters
    const updateParamsResult = ClassUpdateSchema.safeParse(body);
    if (!updateParamsResult.success) {
      throw updateParamsResult.error;
    }
    return this.classPersistance.updateClass(updateParamsResult.data);
  }
}
