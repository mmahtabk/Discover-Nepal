import { Router } from 'express';
import {
  listProvinces,
  getProvinceBySlug,
  listProvinceDestinations,
} from '../controllers/province.controller.js';

const router = Router();

router.get('/', listProvinces);
router.get('/:slug', getProvinceBySlug);
router.get('/:slug/destinations', listProvinceDestinations);

export default router;