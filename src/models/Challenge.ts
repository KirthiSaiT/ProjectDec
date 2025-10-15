import mongoose, { Document, Schema } from 'mongoose';

export interface IChallenge extends Document {
  ctfId: string;
  title: string;
  description: string;
  category: string;
  fileUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const ChallengeSchema: Schema = new Schema({
  ctfId: {
    type: String,
    required: true,
    ref: 'CTF'
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Crypto', 'Rev', 'OSINT', 'PWN', 'Binary Exploitation', 'Forensics', 'Web', 'Misc']
  },
  fileUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.models.Challenge || mongoose.model<IChallenge>('Challenge', ChallengeSchema);