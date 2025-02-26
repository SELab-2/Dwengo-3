
export type LearningPathJson = {
    title: string;
    description?: string;
    hruid: string;
    language: string;
    image?: string;
    createdAt?: Date;
    updatedAt?: Date;
    learningPathNodes: LearningPathNodeJson[];
    assignments: any[];
}

export type LearningPathNodeJson = {
    loId: string;
    instruction: string;
    startNode: boolean;
}

export type LearningNodeTransitionJson = {
    fromNodeId: string;
    nextNodeId: string;
    condition: string;
}

