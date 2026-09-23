import { Router } from 'express';
import { createInquiry } from '../controllers/inquiry.controller.js';

const router = Router();

// Public: visitors (logged in or not) can send an inquiry.
router.post('/', createInquiry);

export default router;