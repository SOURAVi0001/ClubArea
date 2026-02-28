import mongoose, { Document, Schema } from 'mongoose';

export interface IClubAdmin extends Document {
  name?: string;
  email?: string;
  password?: string;
  role: 'leader' | 'member';
  clubId: string;
  clubName: string;
  teamName?: string;
}

const AdminSchema = new Schema<IClubAdmin>({
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  role: { type: String, enum: ['leader', 'member'], required: true },
  clubId: { type: String, required: true },
  clubName: { type: String, required: true },
  teamName: {
    type: String,
    required: function (this: IClubAdmin) {
      return this.role === 'member';
    }
  }
});

export default mongoose.model<IClubAdmin>('admindb', AdminSchema);
