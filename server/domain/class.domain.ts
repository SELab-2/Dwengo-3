import { ClassPersistence } from "../persistence/class.persistence";
import {
  PaginationFilterSchema,
  ClassFilterSchema,
  ClassUpdateSchema,
  ClassCreateSchema,
  IdScheme,
} from "./types";

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

  public async updateClass(query: any, body: any) {
    // Validate and check for a valid UUID.
    const idParamsResult = IdScheme.safeParse(query);
    if (!idParamsResult.success) {
      throw idParamsResult.error;
    }

    // Validate and parse class update parameters
    const updateParamsResult = ClassUpdateSchema.safeParse(body);
    if (!updateParamsResult.success) {
      throw updateParamsResult.error;
    }

    return this.classPersistance.updateClass(
      idParamsResult.data,
      updateParamsResult.data
    );
  }

  public async deleteClass(query: any) {
    // Validate and check for a valid UUID.
    const idParamsResult = IdScheme.safeParse(query);
    if (!idParamsResult.success) {
      throw idParamsResult.error;
    }

    return this.classPersistance.deleteClass(idParamsResult.data);
  }
}
