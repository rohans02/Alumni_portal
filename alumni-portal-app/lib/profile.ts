"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { Roles } from "@/types/globals";

// Define the ProfileFormData interface to match original form
export interface ProfileFormData {
  role: Roles;
  name: string;
  branch: string;
  yearOfPassout: string;
  mobileNumber: string;
}

/**
 * Saves the user's profile data as metadata in Clerk
 * This function should be called when a user submits the create-profile form
 */
export async function saveProfileData(formData: ProfileFormData) {
  // Get current user ID from auth
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("User not authenticated");
  }
  
  try {
    // Get Clerk client
    const client = await clerkClient();
    
    // Extract first and last name from full name
    const nameParts = formData.name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    // Update user metadata
    await client.users.updateUser(userId, {
      firstName: firstName,
      lastName: lastName,
      publicMetadata: {
        role: formData.role,
        branch: formData.branch || undefined,
        graduationYear: formData.yearOfPassout || undefined,
        phoneNumber: formData.mobileNumber || undefined,
      },
    });
    
    // Revalidate relevant paths
    revalidatePath('/dashboard');
    revalidatePath('/create-profile');
    
    return { success: true };
  } catch (error) {
    console.error("Error saving profile data:", error);
    return { success: false, error };
  }
}

/**
 * Admin function to update a user's profile data
 */
export async function updateUserProfile(userId: string, formData: Partial<ProfileFormData>) {
  if (!userId) {
    throw new Error("User ID is required");
  }
  
  try {
    // Get Clerk client
    const client = await clerkClient();
    
    // Extract first and last name if provided
    let firstName, lastName;
    if (formData.name) {
      const nameParts = formData.name.trim().split(' ');
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || '';
    }
    
    // Prepare update data
    const updateData: { firstName?: string; lastName?: string; publicMetadata?: { role?: Roles; branch?: string; graduationYear?: string; phoneNumber?: string } } = {};
    
    // Only include fields that are provided
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    
    // Prepare metadata update
    const metadata: { role?: Roles; branch?: string; graduationYear?: string; phoneNumber?: string } = {};
    if (formData.role) metadata.role = formData.role;
    if (formData.branch) metadata.branch = formData.branch;
    if (formData.yearOfPassout) metadata.graduationYear = formData.yearOfPassout;
    if (formData.mobileNumber) metadata.phoneNumber = formData.mobileNumber;
    
    // Only update metadata if there are changes
    if (Object.keys(metadata).length > 0) {
      updateData.publicMetadata = metadata;
    }
    
    // Update user if there are changes
    if (Object.keys(updateData).length > 0) {
      await client.users.updateUser(userId, updateData);
    }
    
    // Revalidate relevant paths
    revalidatePath('/dashboard');
    
    return { success: true };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { success: false, error };
  }
}

/**
 * Admin function to delete a user
 */
export async function deleteUser(userId: string) {
  if (!userId) {
    throw new Error("User ID is required");
  }
  
  try {
    // Get Clerk client
    const client = await clerkClient();
    
    // Delete the user
    await client.users.deleteUser(userId);
    
    // Revalidate relevant paths
    revalidatePath('/dashboard');
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error };
  }
}

/**
 * Admin function to create a new user
 */
export async function createUser(userData: {
  firstName: string;
  lastName: string;
  email: string;
  role: Roles;
  branch?: string;
  yearOfPassout?: string;
  mobileNumber?: string;
}) {
  try {
    // Get Clerk client
    const client = await clerkClient();
    
    // Create the user
    const newUser = await client.users.createUser({
      firstName: userData.firstName,
      lastName: userData.lastName,
      emailAddress: [userData.email],
      publicMetadata: {
        role: userData.role,
        branch: userData.branch || undefined,
        graduationYear: userData.yearOfPassout || undefined,
        phoneNumber: userData.mobileNumber || undefined,
      },
    });
    
    // Revalidate relevant paths
    revalidatePath('/dashboard');
    
    return { success: true, userId: newUser.id };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, error };
  }
}