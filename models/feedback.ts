import mongoose, { Document, Schema } from 'mongoose';

export interface IFeedback extends Document {
  title: string;
  posted_by: string;
  description: string;
  clubId: string;
  user_type: string;
  email: string;
  date: Date;
}

const feedbackSchema = new Schema<IFeedback>({
  title: { type: String, required: true },
  posted_by: { type: String, required: true },
  description: { type: String, required: true },
  clubId: { type: String, required: true },
  user_type: { type: String, required: true },
  email: { type: String, required: true },
  date: { type: Date, required: true }
});

export default mongoose.model<IFeedback>('feedback', feedbackSchema);
