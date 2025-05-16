import { GroupPersistence } from '../persistence/group.persistence';
import { BadRequestError } from '../util/types/error.types';

export class GroupDomain {
  private readonly groupPersistence = new GroupPersistence();

  public async getGroupById(id: string) {
    return await this.groupPersistence.getGroupById(id);
  }

  public async updateCurrentNode(id: string, value: number) {
    const group = await this.groupPersistence.getGroupById(id);

    if (group === null) {
      throw new BadRequestError(40049);
    }
    if (group.currentNodeIndex > value && value !== -1) {
      throw new BadRequestError(40048);
    }
    return await this.groupPersistence.updateCurrentNodeIndex(id, value);
  }
}
