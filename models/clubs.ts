import mongoose, { Document, Schema } from 'mongoose';

export interface IClub extends Document {
  id: string;
  name: string;
  description?: string;
  photo?: string;
  createdAt: Date;
  updatedAt: Date;
}

const clubSchema = new Schema<IClub>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  photo: { type: String }
}, { timestamps: true });

export default mongoose.model<IClub>('Club', clubSchema);
