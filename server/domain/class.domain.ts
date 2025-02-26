import { ClassPersistence } from "../persistence/class.persistance";
const classPersistance = new ClassPersistence();

export class ClassService {
  public async getAllClasses() {
    return await classPersistance.getAllClasses();
  }

  public async getClassById(id: string) {
    return await classPersistance.getClassById(id);
  }

  public async createClass(name: string) {
    return await classPersistance.createClass(name);
  }

  public async updateClass(id: string, name: string) {
    return await classPersistance.updateClass(id, name);
  }

  public async deleteClass(id: string) {
    return await classPersistance.deleteClass(id);
  }
}
