import mongoose, { Document, Schema } from 'mongoose';

export interface IInterviewApplication extends Document {
  applicantName: string;
  applicantEmail: string;
  scholarNo: string;
  phone?: string;
  address: string;
  clubName: string;
  teamName: string;
  role: string;
  motivation: string;
  resumeFileName: string;
  resumePath: string;
  status: 'pending' | 'approved' | 'rejected' | 'interview_scheduled' | 'accepted' | 'active';
  openingId?: mongoose.Types.ObjectId;
  reviewedBy?: string;
  reviewedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IInterviewApplication>({
  applicantName: { type: String, required: true, trim: true },
  applicantEmail: { type: String, required: true, lowercase: true, trim: true },
  scholarNo: { type: String, required: true, unique: true, trim: true },
  phone: { type: String, trim: true },
  address: { type: String, required: true, trim: true },
  clubName: { type: String, required: true, trim: true },
  teamName: { type: String, required: true, trim: true },
  role: { type: String, required: true, default: 'member' },
  motivation: { type: String, required: true, trim: true },
  resumeFileName: { type: String, required: true },
  resumePath: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'interview_scheduled', 'accepted', 'active'],
    default: 'pending'
  },
  openingId: { type: Schema.Types.ObjectId, ref: 'Opening', required: false },
  reviewedBy: { type: String },
  reviewedDate: { type: Date }
}, {
  timestamps: true
});

export default mongoose.model<IInterviewApplication>('InterviewApplication', applicationSchema);
