import mongoose, { Document, Schema } from 'mongoose';

export interface IFlagSubmission extends Document {
  challengeId: string;
  userId: string;
  flagText: string;
  note: string;
  isCorrect: boolean;
  createdAt: Date;
}

const FlagSubmissionSchema: Schema = new Schema({
  challengeId: {
    type: String,
    required: true,
    ref: 'Challenge'
  },
  userId: {
    type: String,
    required: true
  },
  flagText: {
    type: String,
    required: true,
    trim: true
  },
  note: {
    type: String,
    default: ''
  },
  isCorrect: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.models.FlagSubmission || mongoose.model<IFlagSubmission>('FlagSubmission', FlagSubmissionSchema);