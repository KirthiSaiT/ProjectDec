import mongoose, { Document, Schema } from 'mongoose';

export interface ICTF extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const CTFSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.models.CTF || mongoose.model<ICTF>('CTF', CTFSchema);