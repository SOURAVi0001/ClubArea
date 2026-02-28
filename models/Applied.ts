import mongoose, { Document, Schema } from 'mongoose';

export interface IAppliedJob extends Document {
  applicantEmail: string;
  jobId: mongoose.Types.ObjectId;
  clubName: string;
  teamName: string;
  createdAt: Date;
  updatedAt: Date;
}

const appliedJobSchema = new Schema<IAppliedJob>({
  applicantEmail: { type: String, required: true },
  jobId: { type: Schema.Types.ObjectId, ref: 'JobOpening', required: true },
  clubName: { type: String, required: true },
  teamName: { type: String, required: true }
}, { 
  timestamps: true 
});

export default mongoose.model<IAppliedJob>('AppliedJob', appliedJobSchema);
