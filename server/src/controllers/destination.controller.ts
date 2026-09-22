import { asyncHandler } from '../middleware/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Destination } from '../models/destination.model.js';
import { Province } from '../models/province.model.js';
import { CATEGORIES } from '../models/destination.model.js';

export const listDestinations = asyncHandler(async (req, res) => {
  const { tag, province, q } = req.query as Record<string, string | undefined>;

  const filter: Record<string, unknown> = {};

  if (tag) {
    const valid = (CATEGORIES as readonly string[]).includes(tag);
    if (!valid) throw ApiError.badRequest(`Unknown category tag: ${tag}`);
    filter.category = tag;
  }

  if (province) {
    const p = await Province.findOne({ slug: province }).lean();
    if (!p) throw ApiError.badRequest(`Unknown province: ${province}`);
    filter.provinceId = p._id;
  }

  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { subtitle: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { district: { $regex: q, $options: 'i' } },
    ];
  }

  const destinations = await Destination.find(filter)
    .sort({ name: 1 })
    .populate('provinceId', 'name number slug')
    .lean();

  res.json(ApiResponse.ok(destinations, { count: destinations.length, tag, province, q }));
});

export const getDestinationBySlug = asyncHandler(async (req, res) => {
  const destination = await Destination.findOne({ slug: req.params.slug })
    .populate('provinceId', 'name number slug capital')
    .lean();

  if (!destination) throw ApiError.notFound(`Destination '${req.params.slug}' not found`);

  res.json(ApiResponse.ok(destination));
});