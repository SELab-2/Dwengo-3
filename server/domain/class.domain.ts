import { ClassPersistance } from "../persistence/class.persistance";
const classPersistance = new ClassPersistance();

export class ClassService {
  public async getAllClasses() {
    return classPersistance.getAllClasses();
  }

  public async getClassById(id: string) {
    return classPersistance.getClassById(id);
  }
}
