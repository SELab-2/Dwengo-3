import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ClassPersistance {
  public async getAllClasses() {
    const classes = await prisma.class.findMany();
    return classes;
  }

  public async getClassById(id: string) {
    const classById = await prisma.class.findUnique({
      where: {
        id: id,
      },
    });
    return classById;
  }
}
