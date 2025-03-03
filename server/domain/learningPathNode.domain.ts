import { LearningPathNodePersistence } from "../persistence/learningPathNode.persistence";
import { LearningPathNodeCreateSchema } from "./types";


export class LearningPathNodeDomain {
    private learningPathNodePersistence;

    constructor() {
        this.learningPathNodePersistence = new LearningPathNodePersistence();
    }

    public async createLearningPathNode(query: any) {
        const parseResult = LearningPathNodeCreateSchema.safeParse(query);
        if (!parseResult.success) {
            throw parseResult.error;
        }
        return this.learningPathNodePersistence.createLearningPathNode(parseResult.data);
    }
}