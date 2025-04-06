import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface for mentor message documents
export interface IMentorMessage extends Document {
  mentorId: string;
  mentorName: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  message: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const MentorMessageSchema = new Schema<IMentorMessage>(
  {
    mentorId: {
      type: String,
      required: [true, 'Mentor ID is required'],
      index: true
    },
    mentorName: {
      type: String,
      required: [true, 'Mentor name is required']
    },
    studentId: {
      type: String,
      required: [true, 'Student ID is required'],
      index: true
    },
    studentName: {
      type: String,
      required: [true, 'Student name is required']
    },
    studentEmail: {
      type: String,
      required: [true, 'Student email is required']
    },
    message: {
      type: String,
      required: [true, 'Message content is required']
    },
    read: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Get or create the MentorMessage model
let MentorMessage: Model<IMentorMessage>;

try {
  // Use existing model if it exists
  MentorMessage = mongoose.model<IMentorMessage>('MentorMessage');
} catch {
  // Create new model if it doesn't exist
  MentorMessage = mongoose.model<IMentorMessage>('MentorMessage', MentorMessageSchema);
}

export default MentorMessage; 