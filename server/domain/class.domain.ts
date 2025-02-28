import { ClassPersistence } from "../persistence/class.persistance";
import { PaginationFilterSchema, ClassFilterSchema } from "./types";

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
      filtersResult.success ? filtersResult.data : {}
    );
  }

  public async getClassById(id: string) {
    return this.classPersistance.getClassById(id);
  }

  public async createClass(name: string) {
    return this.classPersistance.createClass(name);
  }

  public async updateClass(id: string, name: string) {
    return this.classPersistance.updateClass(id, name);
  }

  public async deleteClass(id: string) {
    return this.classPersistance.deleteClass(id);
  }
}
