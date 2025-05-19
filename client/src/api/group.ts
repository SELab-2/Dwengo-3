import apiClient from './apiClient.ts';
import { ApiRoutes } from './api.routes.ts';
import { GroupDetail } from '../util/interfaces/group.interfaces.ts';

export async function fetchGroupByGroupId(id: string): Promise<GroupDetail> {
  const response = await apiClient.get(ApiRoutes.group.get(id));
  return response.data;
}
