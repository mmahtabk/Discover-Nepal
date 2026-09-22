import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import {
  listTrips,
  createTrip,
  getTrip,
  updateTrip,
  deleteTrip,
} from '../controllers/trip.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/', listTrips);
router.post('/', createTrip);
router.get('/:id', getTrip);
router.put('/:id', updateTrip);
router.delete('/:id', deleteTrip);

export default router;