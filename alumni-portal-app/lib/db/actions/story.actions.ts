"use server";

import connectToDatabase from "../connection";
import Story from "../models/Story";
import { revalidatePath } from "next/cache";

// Interface for creating a new story
interface CreateStoryParams {
  title: string;
  content: string;
  author: string;
  authorEmail?: string;
  graduationYear?: string;
  branch?: string;
  image?: string;
  isPublished?: boolean;
}

// Interface for updating an existing story
interface UpdateStoryParams extends Partial<CreateStoryParams> {
  isPublished?: boolean;
}

// Get all stories
export async function getAllStories(publishedOnly: boolean = false) {
  try {
    await connectToDatabase();
    
    const query = publishedOnly ? { isPublished: true } : {};
    const stories = await Story.find(query).sort({ createdAt: -1 });
    
    return JSON.parse(JSON.stringify(stories));
  } catch (error) {
    console.error("Error fetching stories:", error);
    throw new Error("Failed to fetch stories");
  }
}

// Get story by ID
export async function getStoryById(storyId: string) {
  try {
    await connectToDatabase();
    
    const story = await Story.findById(storyId);
    
    if (!story) {
      throw new Error("Story not found");
    }
    
    return JSON.parse(JSON.stringify(story));
  } catch (error) {
    console.error(`Error fetching story ${storyId}:`, error);
    throw new Error("Failed to fetch story");
  }
}

// Create a new story
export async function createStory(storyData: CreateStoryParams) {
  try {
    await connectToDatabase();
    
    const newStory = await Story.create(storyData);
    
    revalidatePath('/dashboard');
    
    return JSON.parse(JSON.stringify(newStory));
  } catch (error) {
    console.error("Error creating story:", error);
    throw new Error("Failed to create story");
  }
}

// Update an existing story
export async function updateStory(storyId: string, updateData: UpdateStoryParams) {
  try {
    await connectToDatabase();
    
    const updatedStory = await Story.findByIdAndUpdate(
      storyId,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    if (!updatedStory) {
      throw new Error("Story not found");
    }
    
    revalidatePath('/dashboard');
    
    return JSON.parse(JSON.stringify(updatedStory));
  } catch (error) {
    console.error(`Error updating story ${storyId}:`, error);
    throw new Error("Failed to update story");
  }
}

// Delete a story
export async function deleteStory(storyId: string) {
  try {
    await connectToDatabase();
    
    const deletedStory = await Story.findByIdAndDelete(storyId);
    
    if (!deletedStory) {
      throw new Error("Story not found");
    }
    
    revalidatePath('/dashboard');
    
    return { success: true };
  } catch (error) {
    console.error(`Error deleting story ${storyId}:`, error);
    throw new Error("Failed to delete story");
  }
}

// Toggle story publication status
export async function toggleStoryPublishStatus(storyId: string) {
  try {
    await connectToDatabase();
    
    const story = await Story.findById(storyId);
    
    if (!story) {
      throw new Error("Story not found");
    }
    
    story.isPublished = !story.isPublished;
    await story.save();
    
    revalidatePath('/dashboard');
    
    return JSON.parse(JSON.stringify(story));
  } catch (error) {
    console.error(`Error toggling story status ${storyId}:`, error);
    throw new Error("Failed to toggle story status");
  }
}

// Get stories by author email
export async function getStoriesByAuthorEmail(authorEmail: string) {
  try {
    await connectToDatabase();
    
    const stories = await Story.find({ authorEmail }).sort({ createdAt: -1 });
    
    return JSON.parse(JSON.stringify(stories));
  } catch (error) {
    console.error(`Error fetching stories for author ${authorEmail}:`, error);
    return []; // Return empty array instead of throwing
  }
}