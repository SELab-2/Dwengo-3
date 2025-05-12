import { Router } from 'express';
import { isAuthenticated } from './auth.routes';
import { GroupDomain } from '../domain/group.domain';

export const router = Router();
const groupDomain = new GroupDomain();
// Group id provided
router.get('/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  res.json(await groupDomain.getGroupById(id));
});
