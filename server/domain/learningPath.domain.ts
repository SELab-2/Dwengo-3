import { JsonArray } from "@prisma/client/runtime/library";
import { getAllLearningPathsPersistence, getLearningPathByIdPersistence, createLearningPathPersistence } from "../persistence/learningPath.persistence";
import { LearningPathJson } from "../persistence/types";

export const getLearningPathByIdDomain = async (id: string) => {
    return await getLearningPathByIdPersistence(id);
    // todo what if no learningpath is found? error ?
}

export const getAllLearningPathsDomain = async () => {
    return await getAllLearningPathsPersistence();
}


export const createLearningPathDomain = async (lpJson: LearningPathJson) => {
    // todo hier worden checks uitgevoerd 
    return await createLearningPathPersistence(lpJson);
}