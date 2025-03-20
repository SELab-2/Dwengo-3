import { StudentPersistence } from '../persistence/student.persistence';
import { z } from 'zod';
import { ClassRoleEnum, UserEntity } from '../util/types/user.types';
import { PaginationFilterSchema } from '../util/types/pagination.types';
import {
  StudentCreateSchema,
  StudentDeleteSchema,
  StudentFilterParams,
  StudentFilterSchema,
  StudentIncludeSchema,
  StudentUpdateSchema,
} from '../util/types/student.types';
import { ClassPersistence } from '../persistence/class.persistence';
import { getUserById } from '../persistence/auth/users.persistance';
import { Student, Teacher } from '@prisma/client';
import { TeacherPersistence } from '../persistence/teacher.persistence';

export class StudentDomain {
  private studentPersistence: StudentPersistence;
  private teacherPersistence: TeacherPersistence;
  private classPersistence: ClassPersistence;

  constructor() {
    this.studentPersistence = new StudentPersistence();
    this.teacherPersistence = new TeacherPersistence();
    this.classPersistence = new ClassPersistence();
  }

  /**
   * Create a student with the necessary validation.
   *
   * @param body - The body to create the student. This should contain the user ID.
   * @returns The created student.
   */
  public async createStudent(body: unknown) {
    // Validate the body
    const { userId } = this.validateQuery(StudentCreateSchema, body);

    // Check if the user exists
    const user = await getUserById(userId);

    if (!user) {
      throw new Error('User not found.');
    }

    // Check if the user already has a student record
    const existingStudent =
      await this.studentPersistence.getStudentByUserId(userId);

    if (existingStudent) {
      throw new Error('A student is already linked to this user.');
    }

    return await this.studentPersistence.createStudent(userId);
  }

  /**
   * A generic function to validate a query based on a given schema.
   *
   * @param schema - The schema to validate the query against.
   * @param query - The query to validate.
   * @returns The parsed query data.
   */
  private validateQuery<T extends z.ZodSchema<any>>(
    schema: T,
    query: unknown,
  ): z.infer<T> {
    const result = schema.safeParse(query);

    if (!result.success) {
      throw result.error;
    }

    return result.data;
  }

  /**
   * Validate the get students query for a teacher.
   *
   * @param query - The query to filter and paginate the students.
   * @param teacher - The teacher making the request.
   */
  private async validateGetStudentsAsTeacher(
    query: StudentFilterParams,
    teacher: Teacher,
  ) {
    // A teacher can fetch students of a class they're a teacher of
    if (query.classId) {
      // Check if the class exists
      const classExists = await this.classPersistence.getClassById(
        query.classId,
      );

      if (!classExists) {
        throw new Error('Class not found.');
      }

      // Check if the teacher is a teacher of the class
      const isTeacherOfClass = await this.classPersistence.isTeacherFromClass(
        query.classId,
        teacher.id,
      );

      if (!isTeacherOfClass) {
        throw new Error(
          "Can't fetch students of a class you're not a teacher of.",
        );
      }
    }

    // A teacher can fetch students they're a teacher of
    if (query.userId) {
      // Check if the user exists
      const userExists = await getUserById(query.userId);

      if (!userExists) {
        throw new Error('User not found.');
      }

      // Check if the user is a student
      if (
        userExists.role !== ClassRoleEnum.STUDENT ||
        userExists.student === null
      ) {
        throw new Error('User is not a student.');
      }

      // Check if the student is in the teacher's class
      const isStudentInTeacherClass = await this.isStudentInTeacherClass(
        userExists.student!.id,
        teacher.id,
      );

      if (!isStudentInTeacherClass) {
        throw new Error("Can't fetch students you're not a teacher of.");
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
      const isStudentInGroup = await this.isStudentInGroup(
        query.groupId,
        student.id,
      );

      if (!isStudentInGroup) {
        throw new Error("Can't fetch students of a group you're not in.");
      }
    }

    // A student can fetch their own student record
    if (query.userId) {
      // Check if the student exists
      const studentExists = await this.studentPersistence.getStudentByUserId(
        query.userId,
      );

      if (!studentExists) {
        throw new Error('Student not found.');
      }

      //Check if the student shares a group with the student making the request
      const shareGroup = student.groups.some((group) =>
        studentExists.groups.some((group2) => group.id === group2.id),
      );

      if (!shareGroup && query.userId !== student.userId) {
        throw new Error("Can't fetch other students.");
      }
    }
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
    const pagination = this.validateQuery(PaginationFilterSchema, query);

    // Validate and parse student filters
    const filters = this.validateQuery(StudentFilterSchema, query);

    // Validate and parse student include
    const include = this.validateQuery(StudentIncludeSchema, query);

    if (user.role === ClassRoleEnum.TEACHER) {
      // Check if the teacher exists
      const teacher = await this.teacherPersistence.getTeacherByUserId(user.id);

      if (!teacher) {
        // This should never happen as the user is a teacher
        throw new Error('Teacher not found.');
      }

      await this.validateGetStudentsAsTeacher(filters, teacher);
    }

    // A student can only fetch students in their groups
    if (user.role === ClassRoleEnum.STUDENT) {
      // Check if the student exists
      const student = await this.studentPersistence.getStudentByUserId(user.id);

      if (!student) {
        // This should never happen as the user is a student
        throw new Error('Student not found.');
      }

      await this.validateGetStudentsAsStudent(filters, student);
    }

    return await this.studentPersistence.getStudents(
      pagination,
      filters,
      include,
    );
  }

  public async getStudentById(id: string, user: UserEntity) {
    if (user.role === ClassRoleEnum.TEACHER) {
      // Check if the teacher exists
      const teacher = await this.teacherPersistence.getTeacherByUserId(user.id);

      if (!teacher) {
        // This should never happen as the user is a teacher
        throw new Error('Teacher not found.');
      }

      const isStudentInTeacherClass = await this.isStudentInTeacherClass(
        id,
        teacher.id,
      );

      if (!isStudentInTeacherClass) {
        throw new Error("Can't fetch students you're not a teacher of.");
      }

      return this.studentPersistence.getStudentById(id);
    }

    if (user.role === ClassRoleEnum.STUDENT) {
      const student = await this.studentPersistence.getStudentByUserId(user.id);

      if (!student) {
        // This should never happen as the user is a student
        throw new Error('Student not found.');
      }

      // Check if the student exists
      const studentExists = await this.studentPersistence.getStudentById(id);

      //Check if the student shares a group with the student making the request
      const shareGroup = student.groups.some((group) =>
        studentExists.groups.some((group2: any) => group.id === group2.id),
      );

      if (!shareGroup && id !== student.id) {
        throw new Error("Can't fetch other students.");
      }

      return studentExists;
    }
  }

  /**
   * Update a student with the necessary validation.
   *
   * @param body - The body to update the student. This should contain the student ID and the new data.
   * @param user - The user making the request.
   * @returns The updated student.
   */
  public async updateStudent(body: unknown, user: UserEntity) {
    // Validate and parse body
    const updateData = this.validateQuery(StudentUpdateSchema, body);

    const { id, classes, groups } = updateData;

    // Check if the student exists
    const student = await this.studentPersistence.getStudentById(id);

    if (!student) {
      throw new Error('Student not found.');
    }

    // A teacher can not update a student's info
    if (user.role === ClassRoleEnum.TEACHER) {
      throw new Error("Can't update student info as a teacher.");
    }

    // A student can only update their own student record
    if (user.role === ClassRoleEnum.STUDENT) {
      if (student.userId !== user.id) {
        throw new Error("Can't update other students.");
      }
    }

    return await this.studentPersistence.updateStudent(updateData);
  }

  /**
   * Delete a student with the necessary validation.
   *
   * @param body - The body to delete the student. This should contain the student ID.
   * @param user - The user making the request.
   */
  public async deleteStudent(body: unknown, user: UserEntity): Promise<void> {
    // Validate the body
    const { id } = this.validateQuery(StudentDeleteSchema, body);

    // Check if the student exists
    const student = await this.studentPersistence.getStudentById(id);

    if (!student) {
      throw new Error('Student not found.');
    }

    // A teacher can not delete a student
    if (user.role === ClassRoleEnum.TEACHER) {
      throw new Error("Can't delete a student as a teacher.");
    }

    // A student can only delete their own student record
    if (user.role === ClassRoleEnum.STUDENT) {
      if (student.userId !== user.id) {
        throw new Error("Can't delete other students.");
      }
    }

    await this.studentPersistence.deleteStudent(id);
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
      { page: 1, pageSize: Infinity, skip: 0 },
      { groupId },
      { user: false, classes: false, groups: false },
    );

    // Check if the student exists
    const studentExists =
      await this.studentPersistence.getStudentById(studentId);

    if (!studentExists) {
      throw new Error('Student not found.');
    }

    // Check if the student is in the group
    return students.data.some(
      (student: { id: string }) => student.id === studentId,
    );
  }

  private async isStudentInTeacherClass(studentId: string, teacherId: string) {
    // TODO make isStudentInTeacherClass function in class domain to replace this

    // Check if the student exists
    const student = await this.studentPersistence.getStudentById(studentId);

    if (!student) {
      throw new Error('Student not found.');
    }

    // Fetch all classes of the teacher
    const classes = await this.classPersistence.getClasses(
      { page: 1, pageSize: Infinity, skip: 0 },
      { teacherId },
    );

    return classes.data.some((classData: { students: { id: string }[] }) =>
      classData.students.some(
        (student: { id: string }) => student.id === studentId,
      ),
    );
  }
}
