import { asyncHandler } from '../middleware/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Province } from '../models/province.model.js';
import { Destination } from '../models/destination.model.js';

export const listProvinces = asyncHandler(async (_req, res) => {
  // Frontend contract: ALWAYS sorted by the official `number` field ascending.
  const provinces = await Province.find().sort({ number: 1 }).lean();
  res.json(ApiResponse.ok(provinces));
});

export const getProvinceBySlug = asyncHandler(async (req, res) => {
  const province = await Province.findOne({ slug: req.params.slug }).lean();
  if (!province) throw ApiError.notFound(`Province '${req.params.slug}' not found`);
  res.json(ApiResponse.ok(province));
});

export const listProvinceDestinations = asyncHandler(async (req, res) => {
  const province = await Province.findOne({ slug: req.params.slug }).lean();
  if (!province) throw ApiError.notFound(`Province '${req.params.slug}' not found`);

  const destinations = await Destination.find({ provinceId: province._id })
    .sort({ name: 1 })
    .populate('provinceId', 'name number slug')
    .lean();

  res.json(ApiResponse.ok(destinations, { province }));
});