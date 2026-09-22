import { asyncHandler } from '../middleware/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/user.model.js';
import { Destination } from '../models/destination.model.js';

const SAVED_PROJECTION =
  'name slug provinceId provinceSlug district category subtitle description bestSeason elevationM lat lng imageUrl';

export const getSaved = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user!._id)
    .populate('savedDestinations', SAVED_PROJECTION)
    .lean();
  res.json(ApiResponse.ok(user?.savedDestinations ?? []));
});

const assertDestId = (raw: string | string[] | undefined): string => {
  if (typeof raw !== 'string' || !/^[a-f0-9]{24}$/i.test(raw)) {
    throw ApiError.badRequest('Invalid destination id');
  }
  return raw;
};

export const addSaved = asyncHandler(async (req, res) => {
  const destId = assertDestId(req.params.destId);
  const dest = await Destination.findById(destId).lean();
  if (!dest) throw ApiError.notFound('Destination not found');
  await User.findByIdAndUpdate(
    req.user!._id,
    { $addToSet: { savedDestinations: destId } },
    { new: true },
  );
  res.status(201).json(ApiResponse.ok({ saved: true, destId }));
});

export const removeSaved = asyncHandler(async (req, res) => {
  const destId = assertDestId(req.params.destId);
  await User.findByIdAndUpdate(req.user!._id, { $pull: { savedDestinations: destId } });
  res.json(ApiResponse.ok({ saved: false, destId }));
});