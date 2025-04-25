import { ClassRole, User } from '@prisma/client';
import { PrismaSingleton } from '../prismaSingleton';
import { FullUserType } from '../../util/types/user.types';
import { RegisterParams } from '../../util/types/auth.types';

export class UsersPersistence {
  private readonly prisma = PrismaSingleton.instance;

  async saveUser(user: RegisterParams): Promise<FullUserType> {
    const data: any = {
      ...user,
    };
    const include: any = {};

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

    return this.prisma.user.create({
      data: data,
      include: {
        ...include,
      },
    });
  }

  async getUserById(id: string): Promise<FullUserType | null> {
    return this.prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        teacher: true,
        student: true,
      },
    });
  }

  async getUserByEmail(email: string): Promise<FullUserType | null> {
    return this.prisma.user.findFirst({
      where: {
        email: email,
      },
      include: {
        teacher: true,
        student: true,
      },
    });
  }

  async deleteUser(id: string): Promise<User> {
    return this.prisma.user.delete({
      where: {
        id: id,
      },
    });
  }

  async getUserRoleById(id: string): Promise<{ role: ClassRole } | null> {
    return this.prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        role: true,
      },
    });
  }
}
