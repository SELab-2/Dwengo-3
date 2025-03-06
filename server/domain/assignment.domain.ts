import { Assignment } from "@prisma/client";
import { AssignmentPersistence } from "../persistence/assignment.persistence"
import { AssignmentFilterSchema, AssignmentCreateSchema, PaginationFilterSchema, Uuid } from "./types";

export class AssignmentDomain {
    private assignmentPersistence: AssignmentPersistence

    public constructor() {
        this.assignmentPersistence = new AssignmentPersistence();
    }

    public async getAssignments(query: any): Promise<{data: Assignment[], totalPages: number}> {
        const paginationParseResult = PaginationFilterSchema.safeParse(query);
        if (!paginationParseResult.success) {
            throw paginationParseResult.error;
        }
        const filtersResults = AssignmentFilterSchema.safeParse(query);
        if (!filtersResults.success) {
            throw filtersResults.error;
        }
        return this.assignmentPersistence.getAssignments(
            filtersResults.data,
            paginationParseResult.data
        );
    }

    public async createAssigment(query: any): Promise<Assignment> {
        const parseResult = AssignmentCreateSchema.safeParse(query);
        if (!parseResult.success) {
            throw parseResult.error;
        }
        return this.assignmentPersistence.createAssignment(parseResult.data);
    }
}