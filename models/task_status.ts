import mongoose, { Document, Schema } from 'mongoose';

export interface ITaskStatus extends Document {
  title: string;
  posted_by: string;
  assigned_to: string;
  description: string;
  task_status: number;
  clubId: string;
  task_completion_date: string;
  task_assign_date: string;
  createdAt: Date;
  updatedAt: Date;
}

const taskStatusSchema = new Schema<ITaskStatus>({
  title: { type: String, required: true },
  posted_by: { type: String, required: true },
  assigned_to: { type: String, required: true },
  description: { type: String, required: true },
  task_status: { type: Number, required: true },
  clubId: { type: String, required: true },
  task_completion_date: { type: String, required: true },
  task_assign_date: { type: String, required: true }
}, {
  timestamps: true
});

export default mongoose.model<ITaskStatus>('task_status', taskStatusSchema);
