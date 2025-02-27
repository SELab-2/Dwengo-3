import { ClassPersistence } from "../persistence/class.persistance";
import { PaginationFilterSchema, ClassFilterSchema } from "./types";

export class ClassDomain {
  private classPersistance;
  private paginationFilterSchema;
  private classFilterSchema;

  constructor() {
    this.classPersistance = new ClassPersistence();
    this.paginationFilterSchema = PaginationFilterSchema;
    this.classFilterSchema = ClassFilterSchema;
  }

  public async getClasses(query: any) {
    // Validate and parse pagination query parameters
    const paginationResult = this.paginationFilterSchema.safeParse(query);
    if (!paginationResult.success) {
      throw paginationResult.error;
    }
    // Validate and parse name filter
    const nameResult = this.classFilterSchema.safeParse(query);
    const filters: { name?: string } = {};

    if (nameResult.success) {
      if (nameResult.data.name) {
        filters.name = nameResult.data.name;
      }
    } else {
      if (query.name !== undefined) {
        throw nameResult.error;
      }
    }

    return await this.classPersistance.getClasses(
      paginationResult.data,
      filters
    );
  }

  public async getClassById(id: string) {
    return await this.classPersistance.getClassById(id);
  }

  public async createClass(name: string) {
    return await this.classPersistance.createClass(name);
  }

  public async updateClass(id: string, name: string) {
    return await this.classPersistance.updateClass(id, name);
  }

  public async deleteClass(id: string) {
    return await this.classPersistance.deleteClass(id);
  }
}
