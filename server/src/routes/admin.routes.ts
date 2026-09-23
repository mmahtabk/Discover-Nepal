import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { adminOnly } from '../middleware/admin.middleware.js';
import {
  createProvince,
  updateProvince,
  deleteProvince,
  createDestination,
  updateDestination,
  deleteDestination,
  listInquiries,
  updateInquiryStatus,
  getStats,
} from '../controllers/admin.controller.js';

const router = Router();

router.use(requireAuth, adminOnly);

router.get('/stats', getStats);

router.get('/inquiries', listInquiries);
router.patch('/inquiries/:id', updateInquiryStatus);

router.post('/provinces', createProvince);
router.put('/provinces/:id', updateProvince);
router.delete('/provinces/:id', deleteProvince);

router.post('/destinations', createDestination);
router.put('/destinations/:id', updateDestination);
router.delete('/destinations/:id', deleteDestination);

export default router;