import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface for mentor documents
export interface IMentor extends Document {
  userId: string;
  email: string;
  name: string;
  specializations: string[];
  experience: string;
  bio: string;
  graduated: string;
  branch: string;
  company?: string;
  role?: string;
  linkedin?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const MentorSchema = new Schema<IMentor>(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      index: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true
    },
    name: {
      type: String,
      required: [true, 'Name is required']
    },
    specializations: {
      type: [String],
      required: [true, 'At least one specialization is required'],
      validate: {
        validator: function(v: string[]) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'At least one specialization is required'
      }
    },
    experience: {
      type: String,
      required: [true, 'Experience is required']
    },
    bio: {
      type: String,
      required: [true, 'Bio is required']
    },
    graduated: {
      type: String,
      required: [true, 'Graduation year is required']
    },
    branch: {
      type: String,
      required: [true, 'Branch is required']
    },
    company: {
      type: String
    },
    role: {
      type: String
    },
    linkedin: {
      type: String,
      validate: {
        validator: function(v: string) {
          return !v || v.includes('linkedin.com');
        },
        message: 'LinkedIn URL must be from linkedin.com'
      }
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

// Get or create the Mentor model
let Mentor: Model<IMentor>;

try {
  // Use existing model if it exists
  Mentor = mongoose.model<IMentor>('Mentor');
} catch {
  // Create new model if it doesn't exist
  Mentor = mongoose.model<IMentor>('Mentor', MentorSchema);
}

export default Mentor; 