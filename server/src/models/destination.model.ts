import { Schema, model, type InferSchemaType, type HydratedDocument } from 'mongoose';

export const CATEGORIES = ['trek', 'nature', 'culture', 'hidden-gem'] as const;
export type Category = (typeof CATEGORIES)[number];

const destinationSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    provinceId: { type: Schema.Types.ObjectId, ref: 'Province', required: true, index: true },
    provinceSlug: { type: String, required: true, index: true },
    district: { type: String, required: true },
    category: { type: String, enum: CATEGORIES, required: true, index: true },
    subtitle: { type: String, required: true },
    description: { type: String, required: true },
    bestSeason: { type: String, required: true },
    elevationM: { type: Number },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    imageUrl: { type: String, required: true },
  },
  { timestamps: true },
);

destinationSchema.index({ provinceId: 1, category: 1 });
destinationSchema.index({ name: 'text', description: 'text' });

export type DestinationDoc = HydratedDocument<InferSchemaType<typeof destinationSchema>>;

export const Destination = model('Destination', destinationSchema);