import mongoose, { Schema, Document } from 'mongoose';

export interface IStory extends Document {
  title: string;
  content: string;
  author: string;
  authorEmail?: string;
  graduationYear?: string;
  branch?: string;
  image?: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StorySchema = new Schema<IStory>(
  {
    title: { 
      type: String, 
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters']
    },
    content: { 
      type: String, 
      required: [true, 'Content is required'],
      trim: true
    },
    author: { 
      type: String, 
      required: [true, 'Author name is required'],
      trim: true
    },
    authorEmail: { 
      type: String, 
      trim: true 
    },
    graduationYear: { 
      type: String, 
      trim: true 
    },
    branch: { 
      type: String, 
      trim: true 
    },
    image: { 
      type: String, 
      trim: true 
    },
    isPublished: { 
      type: Boolean, 
      default: false 
    }
  },
  {
    timestamps: true
  }
);

// Check if the model is already defined to prevent overwriting during hot reloads
const Story = mongoose.models.Story || mongoose.model<IStory>('Story', StorySchema);

export default Story; 