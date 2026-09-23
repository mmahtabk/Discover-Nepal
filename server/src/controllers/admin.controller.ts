import { asyncHandler } from '../middleware/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Province } from '../models/province.model.js';
import { Destination, CATEGORIES } from '../models/destination.model.js';
import type { Category } from '../models/destination.model.js';
import { User } from '../models/user.model.js';
import { Trip } from '../models/trip.model.js';
import { Inquiry, INQUIRY_STATUSES } from '../models/inquiry.model.js';
import { Types } from 'mongoose';

const OBJECT_ID_RE = /^[a-f0-9]{24}$/i;
const DIFFICULTIES = ['easy', 'moderate', 'hard'];

function assertId(raw: unknown, label: string): string {
  if (typeof raw !== 'string' || !OBJECT_ID_RE.test(raw)) {
    throw ApiError.badRequest(`Invalid ${label} id`);
  }
  return raw;
}

function requireString(body: Record<string, unknown>, key: string, label: string): string {
  const value = body[key];
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw ApiError.badRequest(`${label} is required`);
  }
  return value.trim();
}

function optionalString(body: Record<string, unknown>, key: string): string | undefined {
  const value = body[key];
  if (value === undefined || value === null) return undefined;
  if (typeof value !== 'string') throw ApiError.badRequest(`${key} must be a string`);
  return value.trim();
}

function slugify(value: string): string {
  const slug = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'untitled';
}

async function assertProvinceNumberFree(number: number, excludeId?: string): Promise<void> {
  const query: Record<string, unknown> = { number };
  if (excludeId) query._id = { $ne: excludeId };
  const other = await Province.findOne(query).select('_id name').lean();
  if (other) {
    throw ApiError.conflict(
      `Province number ${number} is already used by "${other.name}" — the official 1–7 mapping allows only one province per number`,
    );
  }
}

async function uniqueSlug(base: string, model: 'Province' | 'Destination'): Promise<string> {
  const candidate = (suffix: string) => (suffix ? `${slugify(base)}-${suffix}` : slugify(base));
  if (!(await (model === 'Province' ? Province : Destination).exists({ slug: candidate('') }))) {
    return candidate('');
  }
  for (let i = 1; i < 1000; i += 1) {
    if (!(await (model === 'Province' ? Province : Destination).exists({ slug: candidate(String(i)) }))) {
      return candidate(String(i));
    }
  }
  throw ApiError.conflict(`Could not generate a unique slug for "${base}"`);
}

async function resolveProvince(provinceId: string) {
  const province = await Province.findById(provinceId).lean();
  if (!province) throw ApiError.badRequest('Unknown province');
  return province;
}

// ---------------------------------------------------------------- Provinces

export const createProvince = asyncHandler(async (req, res) => {
  const body = (req.body ?? {}) as Record<string, unknown>;

  const name = requireString(body, 'name', 'Name');
  const description = requireString(body, 'description', 'Description');
  const imageUrl = requireString(body, 'imageUrl', 'Hero image URL');
  const nameNepali = requireString(body, 'nameNepali', 'Nepali name');
  const capital = requireString(body, 'capital', 'Capital');
  const number = body.number;
  if (typeof number !== 'number' || !Number.isInteger(number) || number < 1 || number > 7) {
    throw ApiError.badRequest('Official number must be an integer between 1 and 7');
  }

  const areaKm2 = body.areaKm2;
  const population = body.population;
  const districts = body.districts;
  if (typeof areaKm2 !== 'number' || typeof population !== 'number' || typeof districts !== 'number') {
    throw ApiError.badRequest('areaKm2, population and districts are required numbers');
  }

  await assertProvinceNumberFree(number);

  const slug = optionalString(body, 'slug') ?? (await uniqueSlug(name, 'Province'));
  const highlights = Array.isArray(body.highlights)
    ? body.highlights.filter((h): h is string => typeof h === 'string')
    : [];

  const province = await Province.create({
    name,
    nameNepali,
    slug,
    number,
    capital,
    areaKm2,
    population,
    districts,
    description,
    highlights,
    imageUrl,
  });

  res.status(201).json(ApiResponse.ok(province));
});

export const updateProvince = asyncHandler(async (req, res) => {
  const id = assertId(req.params.id, 'province');
  const province = await Province.findById(id);
  if (!province) throw ApiError.notFound('Province not found');

  const body = (req.body ?? {}) as Record<string, unknown>;

  if (body.number !== undefined) {
    const number = body.number;
    if (typeof number !== 'number' || !Number.isInteger(number) || number < 1 || number > 7) {
      throw ApiError.badRequest('Official number must be an integer between 1 and 7');
    }
    await assertProvinceNumberFree(number, id);
    province.number = number;
  }

  const name = optionalString(body, 'name');
  if (name !== undefined) {
    province.name = name;
    const newSlug = await uniqueSlug(name, 'Province');
    if (newSlug !== province.slug) province.slug = newSlug;
  }
  const nameNepali = optionalString(body, 'nameNepali');
  if (nameNepali !== undefined) province.nameNepali = nameNepali;
  const capital = optionalString(body, 'capital');
  if (capital !== undefined) province.capital = capital;
  const description = optionalString(body, 'description');
  if (description !== undefined) province.description = description;
  const imageUrl = optionalString(body, 'imageUrl');
  if (imageUrl !== undefined) province.imageUrl = imageUrl;

  for (const key of ['areaKm2', 'population', 'districts'] as const) {
    if (body[key] !== undefined) {
      if (typeof body[key] !== 'number') throw ApiError.badRequest(`${key} must be a number`);
      province[key] = body[key] as number;
    }
  }

  if (Array.isArray(body.highlights)) {
    province.highlights = body.highlights.filter((h): h is string => typeof h === 'string');
  }

  await province.save();
  res.json(ApiResponse.ok(province));
});

export const deleteProvince = asyncHandler(async (req, res) => {
  const id = assertId(req.params.id, 'province');
  const province = await Province.findById(id);
  if (!province) throw ApiError.notFound('Province not found');

  const destCount = await Destination.countDocuments({ provinceId: id });
  if (destCount > 0) {
    throw ApiError.conflict(
      `Cannot delete "${province.name}" — ${destCount} destination${destCount === 1 ? '' : 's'} are still linked to it. Reassign or delete those destinations first.`,
    );
  }

  await Province.findByIdAndDelete(id);
  res.json(ApiResponse.ok({ id, deleted: true }));
});

// ------------------------------------------------------------- Destinations

const DEFAULT_COORDS = { lat: 27.7172, lng: 85.324 }; // Kathmandu fallback for admin-added entries

function assertCategory(value: unknown): Category {
  if (typeof value !== 'string' || !(CATEGORIES as readonly string[]).includes(value)) {
    throw ApiError.badRequest('Category must be one of: trek, nature, culture, hidden-gem');
  }
  return value as Category;
}

function assertDifficulty(value: unknown): 'easy' | 'moderate' | 'hard' | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value !== 'string' || !(DIFFICULTIES as readonly string[]).includes(value)) {
    throw ApiError.badRequest('Difficulty must be one of: easy, moderate, hard');
  }
  return value as 'easy' | 'moderate' | 'hard';
}

function subtitleFrom(overview: string): string {
  const clean = overview.trim().replace(/\s+/g, ' ');
  return clean.length > 110 ? `${clean.slice(0, 107)}…` : clean;
}

export const createDestination = asyncHandler(async (req, res) => {
  const body = (req.body ?? {}) as Record<string, unknown>;

  const name = requireString(body, 'name', 'Name');
  const provinceId = assertId(body.provinceId, 'province');
  const province = await resolveProvince(provinceId);
  const category = assertCategory(body.category);
  const bestSeason = requireString(body, 'bestSeason', 'Best season');
  const overview = requireString(body, 'overview', 'Overview');
  const imageUrl = requireString(body, 'imageUrl', 'Image URL');

  const difficulty = assertDifficulty(body.difficulty);
  const costEstimate = optionalString(body, 'costEstimate');
  const district = optionalString(body, 'district') ?? province.name;
  const subtitle = optionalString(body, 'subtitle') ?? subtitleFrom(overview);

  const lat = body.lat === undefined ? DEFAULT_COORDS.lat : body.lat;
  const lng = body.lng === undefined ? DEFAULT_COORDS.lng : body.lng;
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    throw ApiError.badRequest('lat and lng must be numbers');
  }

  const slug = await uniqueSlug(name, 'Destination');

  const destination = await Destination.create({
    name,
    slug,
    provinceId,
    provinceSlug: province.slug,
    district,
    category,
    subtitle,
    description: overview,
    bestSeason,
    ...(difficulty !== undefined ? { difficulty } : {}),
    ...(costEstimate !== undefined ? { costEstimate } : {}),
    lat,
    lng,
    imageUrl,
  });

  res.status(201).json(ApiResponse.ok(destination));
});

export const updateDestination = asyncHandler(async (req, res) => {
  const id = assertId(req.params.id, 'destination');
  const destination = await Destination.findById(id);
  if (!destination) throw ApiError.notFound('Destination not found');

  const body = (req.body ?? {}) as Record<string, unknown>;

  const name = optionalString(body, 'name');
  if (name !== undefined) {
    destination.name = name;
    const newSlug = await uniqueSlug(name, 'Destination');
    if (newSlug !== destination.slug) destination.slug = newSlug;
  }

  if (body.provinceId !== undefined) {
    const provinceId = assertId(body.provinceId, 'province');
    const province = await resolveProvince(provinceId);
    destination.provinceId = new Types.ObjectId(provinceId);
    destination.provinceSlug = province.slug;
  }

  if (body.category !== undefined) destination.category = assertCategory(body.category);
  const bestSeason = optionalString(body, 'bestSeason');
  if (bestSeason !== undefined) destination.bestSeason = bestSeason;
  const overview = optionalString(body, 'overview');
  if (overview !== undefined) {
    destination.description = overview;
    const subtitle = optionalString(body, 'subtitle') ?? subtitleFrom(overview);
    destination.subtitle = subtitle;
  }
  const district = optionalString(body, 'district');
  if (district !== undefined) destination.district = district;
  const imageUrl = optionalString(body, 'imageUrl');
  if (imageUrl !== undefined) destination.imageUrl = imageUrl;
  const difficulty = body.difficulty === undefined ? undefined : assertDifficulty(body.difficulty);
  if (body.difficulty !== undefined) destination.difficulty = difficulty;
  const costEstimate = body.costEstimate === undefined ? undefined : optionalString(body, 'costEstimate');
  if (body.costEstimate !== undefined) destination.costEstimate = costEstimate;

  if (body.elevationM !== undefined) {
    if (typeof body.elevationM !== 'number') throw ApiError.badRequest('elevationM must be a number');
    destination.elevationM = body.elevationM;
  }
  if (body.lat !== undefined || body.lng !== undefined) {
    if (typeof body.lat !== 'number' || typeof body.lng !== 'number') {
      throw ApiError.badRequest('lat and lng must be numbers');
    }
    destination.lat = body.lat as number;
    destination.lng = body.lng as number;
  }

  await destination.save();
  res.json(ApiResponse.ok(destination));
});

export const deleteDestination = asyncHandler(async (req, res) => {
  const id = assertId(req.params.id, 'destination');
  const destination = await Destination.findByIdAndDelete(id);
  if (!destination) throw ApiError.notFound('Destination not found');

  await Promise.all([
    User.updateMany({ savedDestinations: id }, { $pull: { savedDestinations: id } }),
    Trip.updateMany({ destinationIds: id }, { $pull: { destinationIds: id } }),
    Inquiry.updateMany({ destinationInterest: id }, { $set: { destinationInterest: null } }),
  ]);

  res.json(ApiResponse.ok({ id, deleted: true }));
});

// ---------------------------------------------------------------- Inquiries

export const listInquiries = asyncHandler(async (req, res) => {
  const status = req.query.status;
  const filter: Record<string, unknown> = {};
  if (typeof status === 'string' && status !== '') {
    if (!(INQUIRY_STATUSES as readonly string[]).includes(status)) {
      throw ApiError.badRequest('status must be one of: new, contacted, closed');
    }
    filter.status = status;
  }

  const inquiries = await Inquiry.find(filter)
    .sort({ createdAt: -1 })
    .populate('destinationInterest', 'name slug provinceSlug imageUrl')
    .lean();

  const [total, open] = await Promise.all([
    Inquiry.countDocuments(filter),
    Inquiry.countDocuments({ ...filter, status: 'new' }),
  ]);

  res.json(ApiResponse.ok(inquiries, { total, open, filter: status || undefined }));
});

export const updateInquiryStatus = asyncHandler(async (req, res) => {
  const id = assertId(req.params.id, 'inquiry');
  const body = (req.body ?? {}) as Record<string, unknown>;

  const status = body.status;
  if (typeof status !== 'string' || !(INQUIRY_STATUSES as readonly string[]).includes(status)) {
    throw ApiError.badRequest('status must be one of: new, contacted, closed');
  }

  const inquiry = await Inquiry.findByIdAndUpdate(
    id,
    { status },
    { new: true },
  ).populate('destinationInterest', 'name slug provinceSlug imageUrl');

  if (!inquiry) throw ApiError.notFound('Inquiry not found');

  res.json(ApiResponse.ok(inquiry));
});

// ------------------------------------------------------------------- Stats

export const getStats = asyncHandler(async (_req, res) => {
  const [destinations, provinces, users, inquiries, inquiriesNew] = await Promise.all([
    Destination.countDocuments({}),
    Province.countDocuments({}),
    User.countDocuments({}),
    Inquiry.countDocuments({}),
    Inquiry.countDocuments({ status: 'new' }),
  ]);

  res.json(ApiResponse.ok({ destinations, provinces, users, inquiries, inquiriesNew }));
});