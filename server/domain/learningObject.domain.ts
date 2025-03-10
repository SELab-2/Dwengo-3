import { parse } from "path";
import { LearningObjectPersistence } from "../persistence/learningObject.persistence";
import { LearningObjectKeywordPersistence } from "../persistence/learningObjectKeyword.persistence";
import { LearningObjectCreateParams, LearningObjectCreateSchema, LearningObjectFilterParams, LearningObjectFilterSchema, LearningObjectUpdateParams, LearningObjectUpdateSchema } from "./types";

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

    public async getLearningObjects(query: LearningObjectFilterParams) {
        const parseResult = LearningObjectFilterSchema.safeParse(query);
        if (!parseResult.success) {
            throw parseResult.error;
        }
        return this.learningObjectPersistence.getLearningObjects(parseResult.data);
    }

    public async updateLearningObject(id: string, body: LearningObjectUpdateParams) {
        const parseResult = LearningObjectUpdateSchema.safeParse(body);
        if (!parseResult.success) {
            throw parseResult.error;
        }
        const {learningObjectsKeywords, ...dataWithoutKeywords} = parseResult.data;
        await this.learningObjectPersistence.updateLearningObject(id, dataWithoutKeywords);
        // TODO: Update keywords
    }

    public async deleteLearningObject(id: string) {
        return this.learningObjectPersistence.deleteLearningObject(id);
    }
}