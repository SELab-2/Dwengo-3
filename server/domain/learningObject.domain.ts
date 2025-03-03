import { LearningObjectPersistence } from "../persistence/learningObject.persistence";
import { LearningObjectKeywordPersistence } from "../persistence/learningObjectKeyword.persistence";
import { learningObjectsQueryByIdSchema, learningObjectsQuerySchema } from "./types";

export class LearningObjectDomain {
    private learningObjectPersistence;
    private learningObjectKeywordPersistence;

    constructor() {
        this.learningObjectPersistence = new LearningObjectPersistence;
        this.learningObjectKeywordPersistence = new LearningObjectKeywordPersistence;
    }

    public async getLearningObjects(query: any) {
        const parseResult = learningObjectsQuerySchema.safeParse(query);

        if (!parseResult.success) {
            throw parseResult.error;
        }
        if (parseResult.data.keyword) {
            return this.learningObjectPersistence.getLearningObjects(false);
        } else {
            let keyword: string = parseResult.data.keyword ? parseResult.data.keyword : ""
            return this.learningObjectPersistence.getLearningObjectsByKeyword(keyword, false);
        }
    }

    public async createLearningObject(body: any) {
        
    }

    public async getLearningObjectById(id: string) {
        return this.learningObjectPersistence.getLearningObjectById(id, false);
    }

    public async updateLearningObject(id: string, body: any) {
        
    }

    public async deleteLearningObject(id: string) {
        
    }

    public async getLearningObjectKeywords(query: any) {
        
    }

    /* TODO onduidelijk
    public async updateLearningObjectKeyword() {
        
    }

    public async deleteLearningObjectKeyword() {
        
    }
    */
}