import { Class, ClassRole, LearningPath, LearningPathNode, PrismaClient, Student, Teacher } from "@prisma/client";
import dotenv from "dotenv";
import { AssignmentDomain } from "./domain_layer/assignment.domain";

dotenv.config({path:"../.env"});

class TestData {
    private prisma: PrismaClient;
    private assignmentDomain: AssignmentDomain;

    public  constructor() {
        this.prisma = new PrismaClient();
        this.assignmentDomain = new AssignmentDomain();
    }

    public async init(): Promise<void> {
        const student1 = await this.add_user("student1", ClassRole.STUDENT);
        console.log(`STUDENT: ${student1.id}`);
        const student2 = await this.add_user("student2", ClassRole.STUDENT);
        console.log(`STUDENT: ${student2.id}`);
        const teacher = await this.add_user("teacher", ClassRole.TEACHER);
        console.log(`TEACHER: ${teacher.id}`);

        const class1 = await this.add_class([student1.id, student2.id], [teacher.id]);
        console.log(`class: ${class1.id}`);

        const lp = await this.add_LP("test", "NL", "test");
        console.log(`LP: ${lp.id}`);

        const node = await this.add_node(lp.id);
        console.log(`node: ${node.id}`);

        const assignment = await this.assignmentDomain.createAssigment({
            groups: [[student1.id], [student2.id]],
            classId: class1.id,
            teacherId: teacher.id,
            learningPathId: lp.id
        });

        console.log(assignment);
    }

    private async add_user(name: string, classRole: ClassRole): Promise<Student | Teacher> {
        const user = await this.prisma.user.create({
            data: {
                name: name,
                surname: name,
                role: classRole
            },
            select: {
                id: true
            }
        });
        if (classRole === ClassRole.STUDENT) {
            return this.prisma.student.create({
                data: {
                    userId: user.id
                }
            });
        } else {
            return this.prisma.teacher.create({
                data: {
                    userId: user.id
                }
            });
        }
    }
    
    private async add_class(students: string[], teachers: string[]): Promise<Class> {
        return this.prisma.class.create({
            data: {
                teachers: {
                    connect: teachers.map((teacher: string) => ({id: teacher}))
                },
                students: {
                    connect: students.map((student: string) => ({id: student}))
                }
            }
        })
    }

    private async add_LP(hruid: string, language: string, title: string): Promise<LearningPath> {
        return this.prisma.learningPath.create({
            data: {
                hruid: hruid,
                language: language,
                title: title
            }
        });
    }

    private async add_node(lpId: string): Promise<LearningPathNode> {
        const lo = await this.prisma.learningObject.upsert({
            where: {
                hruid_version_language: {
                    hruid: "test",
                    version: 1,
                    language: "NL"
                }
            },
            update: {},
            create: {
                hruid: "test",
                uuid: "test",
                version: 1,
                language: "NL",
                title: "test",
                targetAges: [10, 11],
                skosConcepts: [],
                educationalGoals: [],
                content: "test",
                multipleChoice: {
                    question: "test",
                    options: ["a", "b", "c"],
                    correct: "b"
                },
                canUploadSubmission: true
            }
        });
        return this.prisma.learningPathNode.create({
            data: {
                lpId: lpId,
                loId: lo.id,
                startNode: true
            }
        });
    }
}

async function main() {
    const testData = new TestData();
    await testData.init();
}

main();