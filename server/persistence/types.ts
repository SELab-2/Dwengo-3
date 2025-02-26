import { z } from "zod";


export type LearningPathJson = {
    hruid: string;
    language: string;
    title: string;
    description?: string;
    image?: string;
    createdAt?: Date;
    updatedAt?: Date;
    learningPathNodes: LearningPathNodeJson[];
}

export type LearningPathNodeJson = {
    loId: string;
    instruction: string;
    startNode: boolean;
    learningPathOutgoingTransitions: LearningNodeTransitionJson[];
}

export type LearningNodeTransitionJson = {
    fromNodeId: string;
    nextNodeId: string;
    condition: string;
}


/* ZOD schemas */
export const LearningNodeTransitionJsonSchema = z.object({
    // id is returned on creation
    fromNodeId: z.string(),
    nextNodeId: z.string(),
    condition: z.string().optional(),
    // nextNode is connected later, after creation of the next node
    // fromNode is connected via froNodeId
});

export const LearningPathNodeJsonSchema = z.object({
    // learningPathId is only known after creating it
    loId: z.string(), // maybe optional bcs is not given if its a new learningObject
    instruction: z.string().optional(),
    startNode: z.boolean(),
    // learningObject is something we need to think about in the future
    // todo differentiate between using exisint learningObjects (via id) and creating new ones 
    learningPathOutgoingTransitions: z.array(LearningNodeTransitionJsonSchema),
    // incoming transitions are connected later 
    // groups are connected later
    // assignments submissions are connected later
});


export const LearningPathJsonSchema = z.object({
    hruid: z.string(),
    language: z.string(),
    title: z.string(),
    description: z.string().optional(),
    image: z.string().optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    learningPathNodes: z.array(LearningPathNodeJsonSchema),
    // assignments are later connected to the learningPath
});


