import { Router } from 'express';
import { isAuthenticated } from './auth.routes';
import { GroupDomain } from '../domain/group.domain';
import { UpdateIndexParams, UpdateIndexSchema } from '../util/types/group.types';

export const router = Router();
const groupDomain = new GroupDomain();
// Group id provided
router.get('/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  res.json(await groupDomain.getGroupById(id));
});

router.patch('/node', isAuthenticated, async (req, res) => {
  const data: UpdateIndexParams = UpdateIndexSchema.parse(req.body);
  res.json(await groupDomain.updateCurrentNode(data.id, data.index));
});
