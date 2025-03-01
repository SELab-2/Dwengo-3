import { LearningPathNodeTransitionPersistence } from "../persistence/learningPathNodeTransition.persistence";
import { LearningPathNodeTransitionCreateSchema } from "./types";

export class LearningPathNodeTransitionDomain {
    private learningPathNodeTransitionPersistence;

    constructor() {
        this.learningPathNodeTransitionPersistence = new LearningPathNodeTransitionPersistence();
    }

    public async createLearningPathNodeTransition(query: any) {
        const parseResult = LearningPathNodeTransitionCreateSchema.safeParse(query);
        if (!parseResult.success) {
            throw parseResult.error;
        }
        return this.learningPathNodeTransitionPersistence.createLearningPathNodeTransition(parseResult.data);
    }
}