import { LearningObjectPersistence } from "../persistence/learningObject.persistence";
import { LearningObjectKeywordPersistence } from "../persistence/learningObjectKeyword.persistence";
import { LearningObjectCreateParams, LearningObjectCreateSchema } from "./types";

export class LearningObjectDomain {
    private learningObjectPersistence;
    private learningObjectKeywordPersistence;

    constructor() {
        this.learningObjectPersistence = new LearningObjectPersistence;
        this.learningObjectKeywordPersistence = new LearningObjectKeywordPersistence;
    }

    public async createLearningObject(query: LearningObjectCreateParams) {
        const parseResult = LearningObjectCreateSchema.safeParse(query);
        if (!parseResult.success) {
            throw parseResult.error;
        }
        const {learningObjectsKeywords, ...dataWithoutKeywords} = parseResult.data;
        const learningObject = await this.learningObjectPersistence.createLearningObject(dataWithoutKeywords);
        learningObjectsKeywords?.map(({keyword}) => this.learningObjectKeywordPersistence.createLearningObjectKeyword({
            loId: learningObject.id,
            keyword: keyword
        }));
    }

    public async getLearningObjectById(id: string) {
        return this.learningObjectPersistence.getLearningObjectById(id);
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