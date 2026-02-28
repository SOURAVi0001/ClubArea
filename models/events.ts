import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  date: Date;
  venue: string;
  clubId: string;
  time: string;
}

const eventSchema = new Schema<IEvent>({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  venue: { type: String, required: true },
  clubId: { type: String, required: true },
  time: { type: String, required: true }
});

export default mongoose.model<IEvent>('event', eventSchema);
