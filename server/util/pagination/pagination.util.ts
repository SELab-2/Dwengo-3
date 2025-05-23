import { PrismaSingleton } from '../../persistence/prismaSingleton';
import { PaginationParams } from '../types/pagination.types';

/**
 * Generic pagination function for Prisma models.
 *
 * @param model - The Prisma model delegate (e.g., `prisma.announcement`).
 * @param whereClause - The `where` clause for filtering.
 * @param paginationParams - Pagination parameters (`skip` and `pageSize`).
 * @param include - Optional `include` clause for related models.
 * @returns Paginated data and total pages.
 */
export async function searchAndPaginate<
  T extends { findMany: Function; count: Function },
  WhereInput,
  IncludeInput,
  SelectInput,
>(
  model: T,
  whereClause: WhereInput,
  paginationParams: PaginationParams,
  include?: IncludeInput,
  select?: SelectInput,
) {
  if (include && select) {
    throw new Error('Cannot use both `include` and `select` at the same time.');
  }
  const [data, totalCount] = await PrismaSingleton.instance.$transaction([
    model.findMany({
      where: whereClause,
      include,
      select,
      skip: paginationParams.skip,
      take: paginationParams.pageSize,
    }),
    model.count({
      where: whereClause,
    }),
  ]);

  return {
    data,
    totalPages: Math.ceil(totalCount / paginationParams.pageSize),
  };
}
