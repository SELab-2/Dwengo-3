import { parse } from "path";
import { LearningPathByIdSchema, LearningPathCreateSchema, LearningPathFilterSchema } from "./types";

export class LearningPathDomain {
    private learningPathPersistence;

    constructor() {
        this.learningPathPersistence = new LearningPathPersistence();
    }

    public async getLearningPaths(query: any) {
        // validate and parse keywords and age filters
        const filtersResult = LearningPathFilterSchema.safeParse(query);
        if (!filtersResult.success) {
            throw filtersResult.error;
        }

        return this.learningPathPersistence.getLearningPaths(
            filtersResult.data
        );
    }

    public async getLearningPathById(id: string) {
        const parseResult = LearningPathByIdSchema.safeParse({ id });

        if (!parseResult.success) {
            throw parseResult.error;
        }

        return this.learningPathPersistence.getLearningPathById(parseResult.data);
    }

    public async createLearningPath(query: any) {
        const parseResult = LearningPathCreateSchema.safeParse(query);
        if (!parseResult.success) {
            throw parseResult.error;
        }
        return this.learningPathPersistence.createLearningPath(parseResult.data);

    }
}