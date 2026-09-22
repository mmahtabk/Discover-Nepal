import { asyncHandler } from '../middleware/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Trip } from '../models/trip.model.js';
import type { Types } from 'mongoose';

type TripInput = {
  title?: unknown;
  startDate?: unknown;
  endDate?: unknown;
  destinationIds?: unknown;
  notes?: unknown;
};

function assertValidTripInput(body: TripInput): {
  title: string;
  startDate?: Date;
  endDate?: Date;
  destinationIds: Types.ObjectId[];
  notes?: string;
} {
  const destinationIds: Types.ObjectId[] = [];
  if (body.destinationIds !== undefined) {
    if (!Array.isArray(body.destinationIds)) {
      throw ApiError.badRequest('destinationIds must be an array');
    }
    for (const id of body.destinationIds) {
      if (typeof id !== 'string' || !/^[a-f0-9]{24}$/i.test(id)) {
        throw ApiError.badRequest(`Invalid destination id: ${String(id)}`);
      }
      destinationIds.push(id as unknown as Types.ObjectId);
    }
  }

  let startDate: Date | undefined;
  let endDate: Date | undefined;
  if (body.startDate !== undefined) {
    startDate = new Date(body.startDate as string);
    if (Number.isNaN(startDate.getTime())) throw ApiError.badRequest('Invalid startDate');
  }
  if (body.endDate !== undefined) {
    endDate = new Date(body.endDate as string);
    if (Number.isNaN(endDate.getTime())) throw ApiError.badRequest('Invalid endDate');
  }
  if (startDate && endDate && endDate < startDate) {
    throw ApiError.badRequest('endDate must be after startDate');
  }

  if (typeof body.title !== 'string' || body.title.trim().length === 0) {
    throw ApiError.badRequest('Title is required');
  }

  return {
    title: body.title.trim(),
    startDate,
    endDate,
    destinationIds,
    notes: typeof body.notes === 'string' ? body.notes : undefined,
  };
}

export const listTrips = asyncHandler(async (req, res) => {
  const trips = await Trip.find({ user: req.user!._id })
    .populate('destinationIds', 'name slug provinceId imageUrl')
    .sort({ createdAt: -1 })
    .lean();
  res.json(ApiResponse.ok(trips));
});

export const createTrip = asyncHandler(async (req, res) => {
  const input = assertValidTripInput((req.body ?? {}) as TripInput);
  const trip = await Trip.create({ user: req.user!._id, ...input });
  const populated = await trip.populate('destinationIds', 'name slug provinceId imageUrl');
  res.status(201).json(ApiResponse.ok(populated));
});

export const getTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({ _id: req.params.id, user: req.user!._id })
    .populate('destinationIds', 'name slug provinceId imageUrl')
    .lean();
  if (!trip) throw ApiError.notFound('Trip not found');
  res.json(ApiResponse.ok(trip));
});

export const updateTrip = asyncHandler(async (req, res) => {
  const existing = await Trip.findOne({ _id: req.params.id, user: req.user!._id });
  if (!existing) throw ApiError.notFound('Trip not found');

  const { title, startDate, endDate, destinationIds, notes } = assertValidTripInput(
    (req.body ?? {}) as TripInput,
  );
  existing.title = title;
  existing.startDate = startDate ?? existing.startDate;
  existing.endDate = endDate ?? existing.endDate;
  existing.destinationIds = destinationIds.length ? destinationIds : existing.destinationIds;
  existing.notes = notes ?? existing.notes;
  await existing.save();

  const populated = await existing.populate('destinationIds', 'name slug provinceId imageUrl');
  res.json(ApiResponse.ok(populated));
});

export const deleteTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findOneAndDelete({ _id: req.params.id, user: req.user!._id });
  if (!trip) throw ApiError.notFound('Trip not found');
  res.json(ApiResponse.ok({ id: req.params.id, deleted: true }));
});