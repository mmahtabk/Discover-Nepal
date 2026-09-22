import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { getSaved, addSaved, removeSaved } from '../controllers/user.controller.js';

const router = Router();

router.use(requireAuth);
router.get('/me/saved', getSaved);
router.post('/me/saved/:destId', addSaved);
router.delete('/me/saved/:destId', removeSaved);

export default router;