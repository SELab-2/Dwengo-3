import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class ClassPersistence {
  public async getClasses(
    { page, pageSize, skip }: { page: number; pageSize: number; skip: number },
    filters: {
      name?: string;
    }
  ) {
    const where: Prisma.ClassWhereInput = {
      AND: [
        filters.name
          ? {
              name: {
                contains: filters.name,
                mode: Prisma.QueryMode.insensitive,
              },
            }
          : {},
        // Eventueel andere filters
      ],
    };

    const [classes, total] = await prisma.$transaction([
      prisma.class.findMany({ where, skip, take: pageSize }),
      prisma.class.count({ where }),
    ]);

    return {
      data: classes,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
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
