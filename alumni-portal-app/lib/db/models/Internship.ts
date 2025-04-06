import mongoose from 'mongoose';

export interface IInternship {
  title: string;
  company: string;
  location: string;
  type: string;
  duration: string;
  stipend: string;
  description: string;
  deadline: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InternshipSchema = new mongoose.Schema<IInternship>(
  {
    title: {
      type: String,
      required: [true, 'Title is required']
    },
    company: {
      type: String,
      required: [true, 'Company name is required']
    },
    location: {
      type: String,
      required: [true, 'Location is required']
    },
    type: {
      type: String,
      required: [true, 'Type is required'],
      enum: ['Full-time', 'Part-time', 'Remote', 'Hybrid']
    },
    duration: {
      type: String,
      required: [true, 'Duration is required']
    },
    stipend: {
      type: String,
      required: [true, 'Stipend is required']
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    deadline: {
      type: Date,
      required: [true, 'Application deadline is required']
    }
  },
  {
    timestamps: true
  }
);

const Internship = mongoose.models.Internship || mongoose.model<IInternship>('Internship', InternshipSchema);

export default Internship; 