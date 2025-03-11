import { Assignment, Group, PrismaClient, Student, Teacher } from "@prisma/client";
import { PrismaSingleton } from "./prismaSingleton";
import { Uuid } from "../util/types/assignment.types";

export class GroupPersistence {
    private prisma: PrismaClient;

    public constructor() {
        this.prisma = PrismaSingleton.instance;
    }

    public async getGroupById(groupId: Uuid): Promise<Group & {assignment: Assignment & {teacher: Teacher}; students: Student[]} | null> {
        return this.prisma.group.findUnique({
            where: {
                id: groupId
            },
            include: {
                assignment: {
                    include: {
                        teacher: true
                    }
                },
                students: true,
            }
        })
    }
}