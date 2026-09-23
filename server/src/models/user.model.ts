import { Schema, model, type HydratedDocument, type Model, type Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  savedDestinations: Types.ObjectId[];
  isAdmin: boolean;
}

interface IUserMethods {
  comparePassword(candidate: string): Promise<boolean>;
}

type EmptyQueryHelpers = Record<string, never>;
export type UserDoc = HydratedDocument<IUser, IUserMethods>;
type UserModel = Model<IUser, EmptyQueryHelpers, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    savedDestinations: { type: [Schema.Types.ObjectId], ref: 'Destination', default: [] },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true },
);

userSchema.methods.comparePassword = async function comparePassword(candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.passwordHash);
};

export const User: UserModel = model<IUser, UserModel>('User', userSchema);