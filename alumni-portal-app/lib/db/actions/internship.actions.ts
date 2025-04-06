"use server";

import connectToDatabase from "../connection";
import Internship from "../models/Internship";
import { revalidatePath } from "next/cache";

// Interface for creating a new internship
interface CreateInternshipParams {
  title: string;
  company: string;
  location: string;
  type: string;
  duration: string;
  stipend: string;
  description: string;
  deadline: Date;
}

// Function to create a new internship
export async function createInternship(params: CreateInternshipParams) {
  try {
    await connectToDatabase();

    const newInternship = await Internship.create(params);
    
    // Revalidate relevant paths
    revalidatePath('/dashboard');
    
    return JSON.parse(JSON.stringify(newInternship));
  } catch (error) {
    console.error("Error creating internship:", error);
    throw error;
  }
}

// Function to get all internships
export async function getAllInternships(activeOnly: boolean = false) {
  try {
    await connectToDatabase();

    let query = {};
    
    // If activeOnly is true, only return internships with deadlines in the future
    if (activeOnly) {
      query = {
        deadline: { $gte: new Date() }
      };
    }
    
    const internships = await Internship.find(query)
      .sort({ createdAt: -1 }) // Most recent first
      .lean();
    
    return JSON.parse(JSON.stringify(internships));
  } catch (error) {
    console.error("Error fetching internships:", error);
    return [];
  }
}

// Function to get a single internship by ID
export async function getInternshipById(id: string) {
  try {
    await connectToDatabase();
    
    const internship = await Internship.findById(id).lean();
    
    if (!internship) {
      throw new Error("Internship not found");
    }
    
    return JSON.parse(JSON.stringify(internship));
  } catch (error) {
    console.error("Error fetching internship:", error);
    throw error;
  }
}

// Function to delete an internship
export async function deleteInternship(id: string) {
  try {
    await connectToDatabase();
    
    const deletedInternship = await Internship.findByIdAndDelete(id);
    
    if (!deletedInternship) {
      throw new Error("Internship not found");
    }
    
    // Revalidate relevant paths
    revalidatePath('/dashboard');
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting internship:", error);
    throw error;
  }
} 