"use server";

import connectToDatabase from "../connection";
import Event from "../models/Event";
import { revalidatePath } from "next/cache";

// Interface for creating a new event
interface CreateEventParams {
  title: string;
  description: string;
  date: Date;
  location: string;
  image?: string;
}

// Interface for updating an existing event
interface UpdateEventParams extends Partial<CreateEventParams> {
  isActive?: boolean;
}

// Get all events
export async function getAllEvents(activeOnly: boolean = false) {
  try {
    await connectToDatabase();
    
    const query = activeOnly ? { isActive: true } : {};
    const events = await Event.find(query).sort({ date: -1 });
    
    return JSON.parse(JSON.stringify(events));
  } catch (error) {
    console.error("Error fetching events:", error);
    throw new Error("Failed to fetch events");
  }
}

// Get event by ID
export async function getEventById(eventId: string) {
  try {
    await connectToDatabase();
    
    const event = await Event.findById(eventId);
    
    if (!event) {
      throw new Error("Event not found");
    }
    
    return JSON.parse(JSON.stringify(event));
  } catch (error) {
    console.error(`Error fetching event ${eventId}:`, error);
    throw new Error("Failed to fetch event");
  }
}

// Create a new event
export async function createEvent(eventData: CreateEventParams) {
  try {
    await connectToDatabase();
    
    const newEvent = await Event.create(eventData);
    
    revalidatePath('/dashboard');
    
    return JSON.parse(JSON.stringify(newEvent));
  } catch (error) {
    console.error("Error creating event:", error);
    throw new Error("Failed to create event");
  }
}

// Update an existing event
export async function updateEvent(eventId: string, updateData: UpdateEventParams) {
  try {
    await connectToDatabase();
    
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    if (!updatedEvent) {
      throw new Error("Event not found");
    }
    
    revalidatePath('/dashboard');
    
    return JSON.parse(JSON.stringify(updatedEvent));
  } catch (error) {
    console.error(`Error updating event ${eventId}:`, error);
    throw new Error("Failed to update event");
  }
}

// Delete an event
export async function deleteEvent(eventId: string) {
  try {
    await connectToDatabase();
    
    const deletedEvent = await Event.findByIdAndDelete(eventId);
    
    if (!deletedEvent) {
      throw new Error("Event not found");
    }
    
    revalidatePath('/dashboard');
    
    return { success: true };
  } catch (error) {
    console.error(`Error deleting event ${eventId}:`, error);
    throw new Error("Failed to delete event");
  }
}

// Toggle event active status
export async function toggleEventStatus(eventId: string) {
  try {
    await connectToDatabase();
    
    const event = await Event.findById(eventId);
    
    if (!event) {
      throw new Error("Event not found");
    }
    
    event.isActive = !event.isActive;
    await event.save();
    
    revalidatePath('/dashboard');
    
    return JSON.parse(JSON.stringify(event));
  } catch (error) {
    console.error(`Error toggling event status ${eventId}:`, error);
    throw new Error("Failed to toggle event status");
  }
}

// Get recent events for the landing page (limited to 4)
export async function getRecentEvents(limit: number = 4) {
  try {
    await connectToDatabase();
    
    // Only get active events, sorted by date in ascending order (upcoming events first)
    const events = await Event.find({ isActive: true })
      .sort({ date: 1 })
      .limit(limit);
    
    return JSON.parse(JSON.stringify(events));
  } catch (error) {
    console.error("Error fetching recent events:", error);
    // Return empty array instead of throwing error for better UX
    return [];
  }
}