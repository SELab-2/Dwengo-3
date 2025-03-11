import { ClassRole, User } from "@prisma/client";
import { PrismaSingleton } from "../prismaSingleton";

const prisma = PrismaSingleton.instance;

export async function saveUser(user: Omit<User, "id">): Promise<User> {
  let data: any = {
    ...user,
  };
  let include: any = {};

  if (user.role === ClassRole.TEACHER) {
    data.teacher = {
      create: {},
    };
    include.teacher = true;
  }
  if (user.role === ClassRole.STUDENT) {
    data.student = {
      create: {},
    };
    include.student = true;
  }

  return prisma.user.create({
    data: data,
    include: {
      ...include,
    },
  });
}

export async function getUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: {
      id: id,
    },
    include: {
      teacher: true,
      student: true,
    },
  });
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findFirst({
    where: {
      email: email,
    },
  });
}

export async function deleteUser(id: string): Promise<User> {
  return prisma.user.delete({
    where: {
      id: id,
    },
  });
}

export async function getUserRoleById(
  id: string,
): Promise<{ role: ClassRole } | null> {
  return prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      role: true,
    },
  });
}
