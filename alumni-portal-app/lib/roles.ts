"use server";
import { Roles } from '@/types/globals'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

// Utility function to get fresh user data directly from Clerk API
const getFreshUserData = async () => {
  // Force headers read to make this request unique
  headers();
  
  // Get userId from auth
  const { userId } = await auth();
  
  if (!userId) {
    return null;
  }
  
  // Get fresh user data directly from Clerk API
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  
  return user.publicMetadata;
};

// Get the current user's role directly - more efficient than checking each role separately
export const getCurrentRole = async (): Promise<Roles | null> => {
  const metadata = await getFreshUserData();
  console.log("Fresh metadata in getCurrentRole:", metadata);
  
  return metadata?.role as Roles || null;
}

// Check if the user has no roles - directly call Clerk API to avoid cache
export const checkNoRole = async () => {
  // Get fresh user data
  const metadata = await getFreshUserData();
  console.log("Fresh metadata in checkNoRole:", metadata);
  
  return !metadata || !metadata.role;
}

// Check if the user has a specific role - directly call Clerk API to avoid cache
export const checkRole = async (role: Roles) => {
  // Get fresh user data
  const metadata = await getFreshUserData();
  console.log("Fresh metadata in checkRole:", metadata);
  
  return metadata && metadata.role === role;
}

// Create a function to assign a role to the current user
export const assignRole = async (role: Roles) => {
  // Force unique request
  headers();
  
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("No user ID found");
  }
  
  const client = await clerkClient();

  try {
    const res = await client.users.updateUserMetadata(userId, {
      publicMetadata: { role: role },
    });
    
    // Revalidate paths - this is allowed here because it's triggered by a user action
    revalidatePath('/dashboard');
    revalidatePath('/create-profile');
    
    return { message: res.publicMetadata };
  } catch (err) {
    console.error("Error assigning role:", err);
    return { message: err };
  }
}