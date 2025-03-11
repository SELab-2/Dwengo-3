import { z, ZodEffects, ZodObject } from "zod";
import { PaginationFilterSchema, PaginationParams } from "../types/pagination.types";

export const queryWithPaginationParser = <T extends ZodObject<any> | ZodEffects<ZodObject<any>>>(query:any, schema: T): {dataSchema: z.infer<typeof schema>, dataPagination: PaginationParams} => {
    const paginationResult = PaginationFilterSchema.safeParse(query);
    if (!paginationResult.success) {
        throw paginationResult.error;
    }
    const parseResult = schema.safeParse(query);
    if (!parseResult.success) {
        throw parseResult.error;
    }
    return {dataSchema: parseResult.data, dataPagination: paginationResult.data};
}