import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content: string;
  author: string;
  authorId: string;
  authorEmail?: string;
  image?: string;
  likes: number;
  comments: Array<{
    content: string;
    author: string;
    authorId: string;
    createdAt: Date;
  }>;
  tags?: string[];
  isStudentPost?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: { 
      type: String, 
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
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
    authorId: {
      type: String,
      required: [true, 'Author ID is required'],
      trim: true
    },
    authorEmail: { 
      type: String, 
      trim: true 
    },
    image: { 
      type: String, 
      trim: true 
    },
    likes: {
      type: Number,
      default: 0
    },
    comments: [{
      content: {
        type: String,
        required: true,
        trim: true
      },
      author: {
        type: String,
        required: true,
        trim: true
      },
      authorId: {
        type: String,
        required: true,
        trim: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    tags: [{
      type: String,
      trim: true
    }],
    isStudentPost: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Check if the model is already defined to prevent overwriting during hot reloads
const Post = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);

export default Post; 