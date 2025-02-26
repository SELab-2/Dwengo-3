import { createAssignmentPersistence, getAllAssignmentsByClassIdPersistence, getAllAssignmentsByGroupIdPersistence, getAllAssignmentsByUserIdPersistence, getAssignmentByIdPersistence } from "../persistence_layer/assignment.persistence"
import { AssignmentJson, AssignmentJsonSchema } from "../persistence_layer/types";

export const getAssignmentByIdDomain = async (id: string) => {
    return await getAssignmentByIdPersistence(id);
}

export const getAllAssignmentsByClassIdDomain = async (classId: string) => {
    return await getAllAssignmentsByClassIdPersistence(classId);
}

export const getAllAssignmentsByGroupIdDomain = async (groupId: string) => {
    return await getAllAssignmentsByGroupIdPersistence(groupId);
}

export const getAllAssignmentsByUserIdDomain = async (userId: string) => {
    return await getAllAssignmentsByUserIdPersistence(userId);
}

export const createAssignmentDomain = async (assignmentJson: AssignmentJson) => {
    const parseResult = AssignmentJsonSchema.safeParse(assignmentJson);
    if (!parseResult.success) {
        throw new Error(`Invalid AssignmentJson: ${JSON.stringify(parseResult.error.format())}`);
    }
    return await createAssignmentPersistence(assignmentJson);
}