import { LearningPathNodeTransitionPersistence } from "../persistence/learningPathNodeTransition.persistence";
import { LearningPathNodeTransitionCreateParams, LearningPathNodeTransitionCreateSchema } from "./types";

export class LearningPathNodeTransitionDomain {
    private learningPathNodeTransitionPersistence;

    constructor() {
        this.learningPathNodeTransitionPersistence = new LearningPathNodeTransitionPersistence();
    }

    public async createLearningPathNodeTransition(query: LearningPathNodeTransitionCreateParams) {
        const parseResult = LearningPathNodeTransitionCreateSchema.safeParse(query);
        if (!parseResult.success) {
            throw parseResult.error;
        }
        return this.learningPathNodeTransitionPersistence.createLearningPathNodeTransition(parseResult.data);
    }
}