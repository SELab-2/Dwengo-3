import { z, ZodEffects, ZodObject } from 'zod';
import { PaginationFilterSchema, PaginationParams } from '../types/pagination.types';

export const queryWithPaginationParser = <T extends ZodObject<any> | ZodEffects<ZodObject<any>>>(
  query: any,
  schema: T,
): { dataSchema: z.infer<typeof schema>; dataPagination: PaginationParams } => {
  const pagination = PaginationFilterSchema.parse(query);
  const data = schema.parse(query);
  return {
    dataSchema: data,
    dataPagination: pagination,
  };
};
