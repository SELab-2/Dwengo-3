import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ClassPersistence {
  public async getAllClasses() {
    return await prisma.class.findMany();
  }

  public async getClassById(id: string) {
    return await prisma.class.findUnique({
      where: { id },
    });
  }

  public async createClass(name: string) {
    return await prisma.class.create({
      data: { name },
    });
  }

  public async updateClass(id: string, name: string) {
    return await prisma.class.update({
      where: { id },
      data: { name },
    });
  }

  public async deleteClass(id: string) {
    return await prisma.class.delete({
      where: { id },
    });
  }
}
