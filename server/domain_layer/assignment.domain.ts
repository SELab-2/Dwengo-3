import { Assignment } from "@prisma/client";
import { AssignmentPersistence } from "../persistence_layer/assignment.persistence"
import { AssignmentCreateParams, AssignmentFilterSchema, AssignmentSchema, IdSchema, Uuid } from "../persistence_layer/types";

export class AssignmentDomain {
    private assignmentPersistence: AssignmentPersistence

    public constructor() {
        this.assignmentPersistence = new AssignmentPersistence();
    }

    public async getAssignment(assignmentId: Uuid): Promise<Assignment | null> {
        const parseResult = IdSchema.safeParse(assignmentId);
        if (!parseResult.success) {
            throw  parseResult.error;
        }
        return this.assignmentPersistence.getAssignmentById(parseResult.data);
    }

    public async getAssignments(query: any): Promise<Assignment[]> {
        const filtersResults = AssignmentFilterSchema.safeParse(query);
        if (!filtersResults.success) {
            throw filtersResults.error;
        }
        return this.assignmentPersistence.getAssignments(filtersResults.data);
    }

    public async createAssigment(query: any): Promise<Assignment> {
        const parseResult = AssignmentSchema.safeParse(query);
        if (!parseResult.success) {
            throw parseResult.error;
        }
        return this.assignmentPersistence.createAssignment(parseResult.data);
    }
}