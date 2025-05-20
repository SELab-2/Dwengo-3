import { StudentPersistence } from '../persistence/student.persistence';
import { UserEntity } from '../util/types/user.types';
import { PaginationFilterSchema } from '../util/types/pagination.types';
import {
  StudentCreateSchema,
  StudentFilterParams,
  StudentFilterSchema,
} from '../util/types/student.types';
import { ClassPersistence } from '../persistence/class.persistence';
import { UsersPersistence } from '../persistence/auth/users.persistence';
import { Student, Teacher } from '@prisma/client';
import { TeacherPersistence } from '../persistence/teacher.persistence';
import { BadRequestError, NotFoundError } from '../util/types/error.types';
import { ClassRoleEnum } from '../util/types/enums.types';

export class StudentDomain {
  private studentPersistence: StudentPersistence;
  private teacherPersistence: TeacherPersistence;
  private classPersistence: ClassPersistence;
  private readonly userPersistence = new UsersPersistence();

  constructor() {
    this.studentPersistence = new StudentPersistence();
    this.teacherPersistence = new TeacherPersistence();
    this.classPersistence = new ClassPersistence();
    this.userPersistence = new UsersPersistence();
  }

  /**
   * Create a student with the necessary validation.
   *
   * @param body - The body to create the student. This should contain the user ID.
   * @returns The created student.
   */
  public async createStudent(body: unknown) {
    // Validate the body
    const { userId } = StudentCreateSchema.parse(body);

    // Check if the user exists
    const user = await this.userPersistence.getUserById(userId);

    if (!user) {
      throw new NotFoundError(40405);
    }

    // Check if the user already has a student record
    const existingStudent = await this.studentPersistence.getStudentByUserId(userId);

    if (existingStudent) {
      throw new BadRequestError(40023);
    }

    return await this.studentPersistence.createStudent(userId);
  }

  /**
   * Get all students based on a query with the necessary validation.
   *
   * @param query - The query to filter and paginate the students and what to include.
   * @param user - The user making the request.
   * @returns The paginated students and total pages.
   */
  public async getStudents(query: unknown, user: UserEntity) {
    // Validate and parse pagination query parameters
    const pagination = PaginationFilterSchema.parse(query);

    // Validate and parse student filters
    const filters = StudentFilterSchema.parse(query);

    if (user.role === ClassRoleEnum.TEACHER) {
      // Check if the teacher exists
      const teacher = await this.teacherPersistence.getTeacherByUserId(user.id);

      if (!teacher) {
        // This should never happen as the user is a teacher
        throw new NotFoundError(40404);
      }

      await this.validateGetStudentsAsTeacher(filters, teacher);
    }

    // A student can only fetch students in their groups
    if (user.role === ClassRoleEnum.STUDENT) {
      // Check if the student exists
      const student = await this.studentPersistence.getStudentByUserId(user.id);

      if (!student) {
        // This should never happen as the user is a student
        throw new NotFoundError(40403);
      }

      await this.validateGetStudentsAsStudent(filters, student);
    }

    return await this.studentPersistence.getStudents(pagination, filters);
  }

  public async getStudentById(id: string, user: UserEntity) {
    if (user.role === ClassRoleEnum.TEACHER) {
      // Check if the teacher exists
      const teacher = await this.teacherPersistence.getTeacherByUserId(user.id);

      if (!teacher) {
        // This should never happen as the user is a teacher
        throw new NotFoundError(40404);
      }

      // TODO: zie discord, isStudentInTeacherClass functie werkt niet correct
      // const isStudentInTeacherClass = await this.isStudentInTeacherClass(id, teacher.id);
      const isStudentInTeacherClass = true;

      if (!isStudentInTeacherClass) {
        throw new BadRequestError(40036);
      }

      return this.studentPersistence.getStudentById(id);
    }

    if (user.role === ClassRoleEnum.STUDENT) {
      const student = await this.studentPersistence.getStudentByUserId(user.id);

      if (!student) {
        // This should never happen as the user is a student
        throw new NotFoundError(40403);
      }

      // Check if the student exists
      const studentExists = await this.studentPersistence.getStudentById(id);

      //Check if the student shares a group with the student making the request
      const shareGroup = student.groups.some((group) =>
        studentExists.groups.some((group2: any) => group.id === group2.id),
      );

      if (!shareGroup && id !== student.id) {
        throw new BadRequestError(40026);
      }

      return studentExists;
    }
  }

  /**
   * Validate the get students query for a teacher.
   *
   * @param query - The query to filter and paginate the students.
   * @param teacher - The teacher making the request.
   */
  private async validateGetStudentsAsTeacher(query: StudentFilterParams, teacher: Teacher) {
    // A teacher can fetch students of a class they're a teacher of
    if (query.classId) {
      // Check if the class exists
      const classExists = await this.classPersistence.getClassById(query.classId);

      if (!classExists) {
        throw new NotFoundError(40401);
      }

      // Check if the teacher is a teacher of the class
      const isTeacherOfClass = await this.classPersistence.isTeacherFromClass(
        teacher.id,
        query.classId,
      );

      if (!isTeacherOfClass) {
        throw new BadRequestError(40024);
      }
    }

    if (query.userId) {
      // Check if the user exists
      const userExists = await this.userPersistence.getUserById(query.userId);

      if (!userExists) {
        throw new NotFoundError(40405);
      }

      // Check if the user is a student
      if (userExists.role !== ClassRoleEnum.STUDENT || userExists.student === null) {
        throw new BadRequestError(40013);
      }

      // Check if the student is in the teacher's class
      const isStudentInTeacherClass = await this.isStudentInTeacherClass(
        userExists.student!.id,
        teacher.id,
      );

      if (!isStudentInTeacherClass) {
        throw new BadRequestError(40024);
      }
    }

    // A teacher can fetch students that are in a group of a class they're a teacher of
    if (query.groupId) {
      // TODO Check if the group exists
      // TODO Check if the group is in one of the teacher's classes
    }
  }

  private async validateGetStudentsAsStudent(
    query: StudentFilterParams,
    student: Student & { groups: { id: string }[] },
  ) {
    // A student can fetch students in their own groups
    if (query.groupId) {
      const isStudentInGroup = await this.isStudentInGroup(query.groupId, student.id);

      if (!isStudentInGroup) {
        throw new BadRequestError(40025);
      }
    }

    // A student can fetch their own student record
    if (query.userId) {
      // Check if the student exists
      const studentExists = await this.studentPersistence.getStudentByUserId(query.userId);

      if (!studentExists) {
        throw new NotFoundError(40403);
      }

      //Check if the student shares a group with the student making the request
      const shareGroup = student.groups.some((group) =>
        studentExists.groups.some((group2) => group.id === group2.id),
      );

      if (!shareGroup && query.userId !== student.userId) {
        throw new BadRequestError(40026);
      }
    }
  }

  /**
   * Check if a student is in a group.
   *
   * @param groupId - The ID of the group to check.
   * @param studentId - The ID of the student to check.
   * @returns Whether the student is in the group.
   */
  private async isStudentInGroup(groupId: string, studentId: string) {
    // TODO make isStudentInGroup function in group domain to replace this

    // TODO check if the group exists

    // Fetch all students in the group
    const students = await this.studentPersistence.getStudents(
      { page: 1, pageSize: 100, skip: 0 },
      { groupId },
    );

    // Check if the student exists
    const studentExists = await this.studentPersistence.getStudentById(studentId);

    if (!studentExists) {
      throw new NotFoundError(40403);
    }

    // Check if the student is in the group
    return students.data.some((student: { id: string }) => student.id === studentId);
  }

  private async isStudentInTeacherClass(studentId: string, teacherId: string) {
    // TODO make isStudentInTeacherClass function in class domain to replace this

    // Check if the student exists
    const student = await this.studentPersistence.getStudentById(studentId);

    if (!student) {
      throw new NotFoundError(40403);
    }

    // Fetch all classes of the teacher
    const classes = await this.classPersistence.getClasses(
      { page: 1, pageSize: 100, skip: 0 }, // TODO BUG FIX!!
      { teacherId },
    );

    console.log(classes);

    return classes.data.some((classData: { students: { id: string }[] }) =>
      classData.students.some((student: { id: string }) => student.id === studentId),
    );
  }
}
