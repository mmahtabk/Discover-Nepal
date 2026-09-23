import { asyncHandler } from '../middleware/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Inquiry } from '../models/inquiry.model.js';
import { Destination } from '../models/destination.model.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OBJECT_ID_RE = /^[a-f0-9]{24}$/i;

export const createInquiry = asyncHandler(async (req, res) => {
  const body = (req.body ?? {}) as Record<string, unknown>;

  const { name, email, message, destinationInterest } = body;

  if (typeof name !== 'string' || name.trim().length < 2) {
    throw ApiError.badRequest('Name is required (min 2 characters)');
  }
  if (typeof email !== 'string' || !EMAIL_RE.test(email)) {
    throw ApiError.badRequest('A valid email is required');
  }
  if (typeof message !== 'string' || message.trim().length < 5) {
    throw ApiError.badRequest('Message is required (min 5 characters)');
  }

  let interest = null;
  if (destinationInterest !== undefined && destinationInterest !== null && destinationInterest !== '') {
    if (typeof destinationInterest !== 'string' || !OBJECT_ID_RE.test(destinationInterest)) {
      throw ApiError.badRequest('destinationInterest must be a valid destination id');
    }
    const dest = await Destination.findById(destinationInterest).select('_id').lean();
    if (!dest) throw ApiError.badRequest('destinationInterest does not reference an existing destination');
    interest = destinationInterest;
  }

  const inquiry = await Inquiry.create({
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
    destinationInterest: interest,
    status: 'new',
  });

  res.status(201).json(ApiResponse.ok(inquiry));
});