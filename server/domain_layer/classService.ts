import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class ClassService {
  public async getAllClasses() {
    try {
      return await prisma.class.findMany({
        include: {
          students: true,
          teachers: true,
          assignment: true,
          classJoinRequests: true,
        },
      });
    } catch (error) {
      throw new Error("Error retrieving classes");
    }
  }
}
