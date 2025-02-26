import { getAllLearningPathsPersistence, getLearningPathByIdPersistence } from "../persistence/learningPath.persistence";

export const getLearningPathByIdDomain = async (id: string) => {
    return await getLearningPathByIdPersistence(id);
    // todo what if no learningpath is found? error ?
}

export const getAllLearningPathsDomain = async () => {
    return await getAllLearningPathsPersistence();
}