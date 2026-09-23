import { Schema, model, type InferSchemaType, type HydratedDocument } from 'mongoose';

export const INQUIRY_STATUSES = ['new', 'contacted', 'closed'] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

const inquirySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    message: { type: String, required: true },
    destinationInterest: { type: Schema.Types.ObjectId, ref: 'Destination', default: null },
    status: { type: String, enum: INQUIRY_STATUSES, default: 'new', index: true },
  },
  { timestamps: true },
);

inquirySchema.index({ createdAt: -1 });

export type InquiryDoc = HydratedDocument<InferSchemaType<typeof inquirySchema>>;

export const Inquiry = model('Inquiry', inquirySchema);