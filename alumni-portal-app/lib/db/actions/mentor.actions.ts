"use server";

import { revalidatePath } from "next/cache";
import { getDBConnection } from "../mongodb";
import Mentor from "../models/Mentor";

/**
 * Apply to become a mentor
 * @param userId User ID from Clerk
 * @param email User's email
 * @param name User's full name
 * @param specializations Areas of expertise
 * @param experience Years of experience
 * @param bio Short bio
 * @param graduated Graduation year
 * @param branch Branch of study
 * @param company Current company (optional)
 * @param role Current role (optional)
 * @param linkedin LinkedIn URL (optional)
 * @param availability When the mentor is available (optional)
 * @param mentorshipFormats Preferred mentorship formats (optional)
 * @param mentorshipTopics Specific topics they can mentor on (optional)
 * @param maxMentees Maximum number of mentees they can support (optional)
 */
export async function applyAsMentor({
  userId,
  email,
  name,
  specializations,
  experience,
  bio,
  graduated,
  branch,
  company,
  role,
  linkedin,
  availability,
  mentorshipFormats,
  mentorshipTopics,
  maxMentees
}: {
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
  availability?: string[];
  mentorshipFormats?: string[];
  mentorshipTopics?: string[];
  maxMentees?: number;
}) {
  try {
    await getDBConnection();

    // Check if application already exists
    const existingApplication = await Mentor.findOne({ email });
    
    if (existingApplication) {
      return { success: false, message: "You have already submitted an application." };
    }

    // Create new mentor application
    const newMentor = new Mentor({
      userId,
      email,
      name,
      specializations,
      experience,
      bio,
      graduated,
      branch,
      company,
      role,
      linkedin,
      // New mentorship fields
      availability,
      mentorshipFormats,
      mentorshipTopics,
      maxMentees: maxMentees || 1,
      status: 'pending'
    });

    // Save to database
    await newMentor.save();

    revalidatePath('/dashboard/alumni');

    return { success: true, message: "Application submitted successfully! We'll review it soon." };
  } catch (error: unknown) {
    console.error("Error applying as mentor:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Failed to submit application. Please try again." 
    };
  }
}

/**
 * Get mentor status by user email
 * @param email User's email address
 */
export async function getMentorStatus(email: string) {
  try {
    if (!email) return null;
    
    await getDBConnection();
    
    const mentor = await Mentor.findOne({ email });
    
    if (!mentor) return null;

    // Convert MongoDB document to plain object and stringify the _id
    const mentorData = JSON.parse(JSON.stringify(mentor));
    
    return {
      id: mentorData._id,
      status: mentorData.status,
      isMentor: true,
      data: mentorData
    };
  } catch (error) {
    console.error("Error getting mentor status:", error);
    return null;
  }
}

/**
 * Get all mentors (admin function)
 * @param approvedOnly Only return approved mentors
 */
export async function getAllMentors(approvedOnly: boolean = false) {
  try {
    await getDBConnection();
    
    const query = approvedOnly ? { status: 'approved' } : {};
    
    const mentors = await Mentor.find(query).sort({ createdAt: -1 });
    
    return JSON.parse(JSON.stringify(mentors));
  } catch (error) {
    console.error("Error getting all mentors:", error);
    return [];
  }
}

/**
 * Update mentor application status (admin function)
 * @param mentorId Mentor ID
 * @param status New status (approved or rejected)
 */
export async function updateMentorStatus(mentorId: string, status: 'approved' | 'rejected') {
  try {
    await getDBConnection();
    
    const mentor = await Mentor.findById(mentorId);
    
    if (!mentor) {
      return { success: false, message: "Mentor application not found" };
    }
    
    mentor.status = status;
    await mentor.save();
    
    // Convert to plain object for serialization
    const updatedMentor = JSON.parse(JSON.stringify(mentor));
    
    revalidatePath('/dashboard/admin');
    
    return { 
      success: true, 
      message: `Mentor application ${status === 'approved' ? 'approved' : 'rejected'} successfully`,
      data: updatedMentor
    };
  } catch (error: unknown) {
    console.error("Error updating mentor status:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Failed to update mentor status. Please try again." 
    };
  }
}

/**
 * Delete a mentor application (can be used by admin or the mentor themselves)
 * @param mentorId Mentor ID
 * @param userEmail Email of the user making the request (for authorization)
 * @param isAdmin Whether the user is an admin
 */
export async function deleteMentor(mentorId: string, userEmail: string, isAdmin: boolean = false) {
  try {
    await getDBConnection();
    
    // Find the mentor document
    const mentor = await Mentor.findById(mentorId);
    
    if (!mentor) {
      return { success: false, message: "Mentor application not found" };
    }
    
    // Only allow deletion if user is admin or if it's their own application
    if (!isAdmin && mentor.email !== userEmail) {
      return { 
        success: false, 
        message: "Unauthorized. You can only delete your own mentor application." 
      };
    }
    
    // Delete the mentor document
    await Mentor.findByIdAndDelete(mentorId);
    
    // Revalidate both admin and alumni paths
    revalidatePath('/dashboard/admin');
    revalidatePath('/dashboard/alumni');
    
    return { 
      success: true, 
      message: "Mentor application deleted successfully" 
    };
  } catch (error: unknown) {
    console.error("Error deleting mentor:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Failed to delete mentor application. Please try again." 
    };
  }
}