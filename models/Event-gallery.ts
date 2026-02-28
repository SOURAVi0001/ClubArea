import mongoose, { Document, Schema } from 'mongoose';

export interface IEventGallery extends Document {
  title: string;
  date: Date;
  time: string;
  venue?: string;
  description?: string;
  photos: string[];
  clubId: string;
  clubName: string;
  createdAt: Date;
}

const EventSchema = new Schema<IEventGallery>({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  venue: { type: String },
  description: { type: String },
  photos: [{ type: String }],
  clubId: { type: String, required: true },
  clubName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IEventGallery>('Event-gallery', EventSchema);
