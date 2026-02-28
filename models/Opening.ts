import mongoose, { Document, Schema } from 'mongoose';

export interface IOpening extends Document {
  clubId: string;
  clubName: string;
  role: string;
  teamName: string;
  description: string;
  requirements: string;
  maxApplicants: number;
  status: 'active' | 'closed';
  createdBy: string;
  createdDate: Date;
  closedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const openingSchema = new Schema<IOpening>({
  clubId: { type: String, required: true },
  clubName: { type: String, required: true },
  role: { type: String, required: true },
  teamName: { type: String, required: true },
  description: { type: String, required: true },
  requirements: { type: String, required: true },
  maxApplicants: { type: Number, default: 10 },
  status: { type: String, enum: ['active', 'closed'], default: 'active' },
  createdBy: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
  closedDate: { type: Date }
}, {
  timestamps: true
});

export default mongoose.model<IOpening>('Opening', openingSchema);
