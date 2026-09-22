import { Schema, model, type InferSchemaType, type HydratedDocument } from 'mongoose';

const tripSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    startDate: { type: Date },
    endDate: { type: Date },
    destinationIds: { type: [Schema.Types.ObjectId], ref: 'Destination', default: [] },
    notes: { type: String, default: '' },
  },
  { timestamps: true },
);

export type TripDoc = HydratedDocument<InferSchemaType<typeof tripSchema>>;

export const Trip = model('Trip', tripSchema);