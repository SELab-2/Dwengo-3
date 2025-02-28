import { ClassPersistence } from "../persistence/class.persistance";
import {
  PaginationFilterSchema,
  ClassFilterSchema,
  ClassUpdateSchema,
  ClassCreateSchema,
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

  public async getClassById(id: string) {
    return this.classPersistance.getClassById(id);
  }

  public async createClass(body: any) {
    // Validate and parse class create parameters
    const createParamsResult = ClassCreateSchema.safeParse(body);
    if (!createParamsResult.success) {
      throw createParamsResult.error;
    }
    return this.classPersistance.createClass(createParamsResult.data);
  }

  public async updateClass(id: string, body: any) {
    // Validate and parse class update parameters
    const updateParamsResult = ClassUpdateSchema.safeParse(body);
    if (!updateParamsResult.success) {
      throw updateParamsResult.error;
    }
    return this.classPersistance.updateClass(id, updateParamsResult.data);
  }

  public async deleteClass(id: string) {
    return this.classPersistance.deleteClass(id);
  }
}
