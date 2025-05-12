import { GroupPersistence } from '../persistence/group.persistence';

export class GroupDomain {
  private readonly groupPersistence = new GroupPersistence();

  public async getGroupById(id: string) {
    return await this.groupPersistence.getGroupById(id);
  }
}
