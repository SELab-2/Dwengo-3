import { JsonArray } from "@prisma/client/runtime/library";
import { getAllLearningPathsPersistence, getLearningPathByIdPersistence, createLearningPathPersistence } from "../persistence/learningPath.persistence";
import { LearningPathJson, LearningPathJsonSchema } from "../persistence/types";

export const getLearningPathByIdDomain = async (id: string) => {
    return await getLearningPathByIdPersistence(id);
    // todo what if no learningpath is found? error ?
}

export const getAllLearningPathsDomain = async () => {
    return await getAllLearningPathsPersistence();
}


export const createLearningPathDomain = async (lpJson: LearningPathJson) => {
    // todo hier worden checks uitgevoerd 
    const parseResult = LearningPathJsonSchema.safeParse(lpJson);
    if (!parseResult.success) {
        throw new Error(`Invalid LearningPathJson: ${JSON.stringify(parseResult.error.format())}`);
    }

    //todo, do we check the validity of the learningPathNodes here? or somewhere else?

    return await createLearningPathPersistence(lpJson);
}