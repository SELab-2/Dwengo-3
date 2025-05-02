import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { AssignmentDetail } from '../../server/util/types/assignment.types';
import { AssignmentPersistence } from '../../server/persistence/assignment.persistence';
import { deleteAllData, insertAssignments } from './testData';
import { PrismaSingleton } from '../../server/persistence/prismaSingleton';
import { ClassPersistence } from '../../server/persistence/class.persistence';

let assignments: AssignmentDetail[] = [];
const assignmentPersistence: AssignmentPersistence = new AssignmentPersistence();
const classPersistence: ClassPersistence = new ClassPersistence();

describe('assignment persistence test', () => {
  beforeAll(async () => {
    assignments = await insertAssignments();
    expect(assignments).not.toEqual([]);
    for (const assignment of assignments) {
      expect(assignment.groups).not.toEqual([]);
    }
  });

  afterAll(async () => {
    await deleteAllData();
    await PrismaSingleton.instance.$disconnect();
  });

  describe('test get assignment by id', () => {
    test('request with existing id responds correctly', async () => {
      for (const assignment of assignments) {
        const req = assignmentPersistence.getAssignmentId(assignment.id);
        await expect(req).resolves.toStrictEqual(assignment);
      }
    });

    test('request with unexisting id responds with an error', async () => {
      const req = assignmentPersistence.getAssignmentId('lksjfqmklfqmf');
      await expect(req).rejects.toThrow();
    });
  });

  describe('test get assignments', () => {
    test('request with existing classId responds correctly', async () => {
      for (const assignment of assignments) {
        const req = assignmentPersistence.getAssignments(
          { classId: assignment.class.id },
          { page: 1, pageSize: 10, skip: 0 },
        );
        const expectedAssignments = assignments
          .filter((ass) => ass.class.id === assignment.class.id)
          .map((ass) => ({
            id: ass.id,
            deadline: ass.deadline,
            groups: ass.groups.map((group) => ({
              assignmentId: ass.id,
              id: group.id,
              name: group.name,
              progress: group.progress,
              students: group.students.map((student) => ({
                id: student.id,
                user: {
                  name: student.user.name,
                  surname: student.user.surname,
                },
                userId: student.userId,
              })),
            })),
            learningPath: {
              id: ass.learningPath.id,
              learningPathNodes: ass.learningPath.learningPathNodes.map((learningPathNode) => ({
                learningObject: {
                  estimatedTime: learningPathNode.learningObject.estimatedTime,
                },
              })),
              title: ass.learningPath.title,
            },
          }));
        expect(expectedAssignments).not.toEqual([]);
        await expect(req).resolves.toEqual({
          data: expect.arrayContaining(expectedAssignments),
          totalPages: 1,
        });
      }
    });

    test('request with existing groupId responds correctly', async () => {
      for (const assignment of assignments) {
        for (const group of assignment.groups) {
          const req = assignmentPersistence.getAssignments(
            { groupId: group.id },
            { page: 1, pageSize: 10, skip: 0 },
          );
          const expectedAssignments = [
            {
              id: assignment.id,
              deadline: assignment.deadline,
              groups: assignment.groups.map((group) => ({
                assignmentId: assignment.id,
                id: group.id,
                name: group.name,
                progress: group.progress,
                students: group.students.map((student) => ({
                  id: student.id,
                  user: {
                    name: student.user.name,
                    surname: student.user.surname,
                  },
                  userId: student.userId,
                })),
              })),
              learningPath: {
                id: assignment.learningPath.id,
                learningPathNodes: assignment.learningPath.learningPathNodes.map(
                  (learningPathNode) => ({
                    learningObject: {
                      estimatedTime: learningPathNode.learningObject.estimatedTime,
                    },
                  }),
                ),
                title: assignment.learningPath.title,
              },
            },
          ];
          expect(expectedAssignments.sort((a, b) => a.id.localeCompare(b.id))).not.toEqual([]);
          await expect(req).resolves.toEqual({
            data: expect.arrayContaining(expectedAssignments),
            totalPages: 1,
          });
        }
      }
    });

    test('request with existing teacherId responds correctly', async () => {
      const expectedAssignments = assignments.map((ass) => ({
        id: ass.id,
        deadline: ass.deadline,
        groups: ass.groups.map((group) => ({
          assignmentId: ass.id,
          id: group.id,
          name: group.name,
          progress: group.progress,
          students: group.students.map((student) => ({
            id: student.id,
            user: {
              name: student.user.name,
              surname: student.user.surname,
            },
            userId: student.userId,
          })),
        })),
        learningPath: {
          id: ass.learningPath.id,
          learningPathNodes: ass.learningPath.learningPathNodes.map((learningPathNode) => ({
            learningObject: {
              estimatedTime: learningPathNode.learningObject.estimatedTime,
            },
          })),
          title: ass.learningPath.title,
        },
      }));
      expect(expectedAssignments).not.toEqual([]);
      for (const assignment of assignments) {
        const classData = await classPersistence.getClassById(assignment.class.id);
        for (const teacher of classData.teachers) {
          const req = assignmentPersistence.getAssignments(
            { teacherId: teacher.id },
            { page: 1, pageSize: 10, skip: 0 },
          );
          await expect(req).resolves.toEqual({
            data: expect.arrayContaining(expectedAssignments),
            totalPages: 1,
          });
        }
      }
    });

    test('request with existing studentId responds correctly', async () => {
      const expectedAssignments = assignments.map((ass) => ({
        id: ass.id,
        deadline: ass.deadline,
        groups: ass.groups.map((group) => ({
          assignmentId: ass.id,
          id: group.id,
          name: group.name,
          progress: group.progress,
          students: group.students.map((student) => ({
            id: student.id,
            user: {
              name: student.user.name,
              surname: student.user.surname,
            },
            userId: student.userId,
          })),
        })),
        learningPath: {
          id: ass.learningPath.id,
          learningPathNodes: ass.learningPath.learningPathNodes.map((learningPathNode) => ({
            learningObject: {
              estimatedTime: learningPathNode.learningObject.estimatedTime,
            },
          })),
          title: ass.learningPath.title,
        },
      }));
      expect(expectedAssignments).not.toEqual([]);
      for (const assignment of assignments) {
        const classData = await classPersistence.getClassById(assignment.class.id);
        for (const student of classData.students) {
          const req = assignmentPersistence.getAssignments(
            { studentId: student.id },
            { page: 1, pageSize: 10, skip: 0 },
          );
          await expect(req).resolves.toEqual({
            data: expect.arrayContaining(expectedAssignments),
            totalPages: 1,
          });
        }
      }
    });
  });
});