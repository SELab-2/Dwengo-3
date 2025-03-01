import { LearningPathByFilterParams, LearningPathCreateParams, LearningPathCreateSchema, LearningPathFilterSchema } from "./types";
import { LearningPathPersistence } from "../persistence/learningPath.persistence";

export class LearningPathDomain {
    private learningPathPersistence;

    constructor() {
        this.learningPathPersistence = new LearningPathPersistence();
    }

    public async getLearningPaths(query: LearningPathByFilterParams) {
        const filtersResult = LearningPathFilterSchema.safeParse(query);
        if (!filtersResult.success) {
            throw filtersResult.error;
        }

        return this.learningPathPersistence.getLearningPaths(
            filtersResult.data
        );
    }

    public async createLearningPath(query: LearningPathCreateParams) {
        const parseResult = LearningPathCreateSchema.safeParse(query);
        if (!parseResult.success) {
            throw parseResult.error;
        }
        return this.learningPathPersistence.createLearningPath(parseResult.data);
    }
}



