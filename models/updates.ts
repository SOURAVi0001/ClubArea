import mongoose, { Document, Schema } from 'mongoose';

export interface IUpdate extends Document {
  title: string;
  posted_by: string;
  description: string;
  clubId: string;
  type: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const updateSchema = new Schema<IUpdate>({
  title: { type: String, required: true },
  posted_by: { type: String, required: true },
  description: { type: String, required: true },
  clubId: { type: String, required: true },
  type: { type: String, required: true },
  date: { type: Date, required: true }
}, {
  timestamps: true
});

export default mongoose.model<IUpdate>('updates', updateSchema);
