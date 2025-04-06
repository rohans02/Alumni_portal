import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  location: string;
  image?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { 
      type: String, 
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: { 
      type: String, 
      required: [true, 'Description is required'],
      trim: true
    },
    date: { 
      type: Date, 
      required: [true, 'Event date is required'] 
    },
    location: { 
      type: String, 
      required: [true, 'Location is required'],
      trim: true
    },
    image: { 
      type: String, 
      trim: true 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    }
  },
  {
    timestamps: true
  }
);

// Check if the model is already defined to prevent overwriting during hot reloads
const Event = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event; 