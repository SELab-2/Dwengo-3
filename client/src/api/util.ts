/**
 * Utility function to fetch nested data by IDs.
 *
 * @param ids - The IDs of the items to be fetched.
 * @param fetchFn - The function to fetch the items by their IDs.
 * @returns A promise that resolves to an array of fetched items.
 */
export async function fetchNestedData<T>(
  ids: string[],
  fetchFn: (id: string) => Promise<T>,
): Promise<T[]> {
  return await Promise.all(ids.map((id) => fetchFn(id)));
}
