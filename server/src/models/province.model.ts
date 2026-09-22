import { Schema, model, type InferSchemaType, type HydratedDocument } from 'mongoose';

const provinceSchema = new Schema(
  {
    name: { type: String, required: true },
    nameNepali: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    // OFFICIAL Nepal province number (1..7). Never derive from index/order/sort.
    number: { type: Number, required: true, min: 1, max: 7, unique: true, index: true },
    capital: { type: String, required: true },
    areaKm2: { type: Number, required: true },
    population: { type: Number, required: true },
    districts: { type: Number, required: true },
    description: { type: String, required: true },
    highlights: { type: [String], default: [] },
    imageUrl: { type: String, required: true },
  },
  { timestamps: true },
);

export type ProvinceDoc = HydratedDocument<InferSchemaType<typeof provinceSchema>>;

export const Province = model('Province', provinceSchema);