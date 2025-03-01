import { Assignment } from "@prisma/client";
import { AssignmentPersistence } from "../persistence_layer/assignment.persistence"
import { AssignmentFilterSchema, IdSchema, AssignmentJson, AssignmentJsonSchema } from "../persistence_layer/types";

export class AssignmentDomain {
    private assignmentPersistence: AssignmentPersistence

    public constructor() {
        this.assignmentPersistence = new AssignmentPersistence();
    }

    public async getAssignment(assignmentId: string): Promise<Assignment | null> {
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

    public async createAssigmen(assignmentJson: AssignmentJson): Promise<Assignment> {
        const parseResult = AssignmentJsonSchema.safeParse(assignmentJson);
        if (!parseResult.success) {
            throw parseResult.error;
        }
        return this.assignmentPersistence.createAssignment(parseResult.data);
    }
}