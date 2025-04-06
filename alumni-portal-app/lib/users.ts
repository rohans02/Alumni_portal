"use server";

import { clerkClient } from '@clerk/nextjs/server';
import { User } from '@clerk/nextjs/server';
import { Roles } from '@/types/globals';

// Interface for user data structure
export interface UserData {
  id: string;
  name: string;
  email: string;
  role: Roles | string | null;
  branch?: string;
  year?: string;
  createdAt: Date;
}

// Get all users from Clerk API
export async function getAllUsers(): Promise<UserData[]> {
    const client = await clerkClient()
  try {
    const { data: users } = await client.users.getUserList();

    return users.map((user: User) => {
      const metadata = user.publicMetadata;
      return {
        id: user.id,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown',
        email: user.emailAddresses[0]?.emailAddress || '',
        role: (metadata?.role as string) || null,
        branch: (metadata?.branch as string) || undefined,
        year: (metadata?.graduationYear as string) || undefined,
        createdAt: new Date(user.createdAt),
      };
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

// Get users by role
export async function getUsersByRole(role: Roles): Promise<UserData[]> {
  const allUsers = await getAllUsers();
  return allUsers.filter(user => user.role === role);
}

// Get analytics data
export async function getAnalyticsData() {
  const allUsers = await getAllUsers();
  
  // Count users by role
  const usersByRole = allUsers.reduce((acc: Record<string, number>, user) => {
    const role = user.role || 'unassigned';
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});
  
  // Count users by branch
  const usersByBranch = allUsers.reduce((acc: Record<string, number>, user) => {
    const branch = user.branch || 'Unknown';
    acc[branch] = (acc[branch] || 0) + 1;
    return acc;
  }, {});
  
  // Count active users (simplified - in real app would use login data)
  // Here we're just counting users created in last week/month
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const lastWeekCount = allUsers.filter(user => new Date(user.createdAt) > oneWeekAgo).length;
  const lastMonthCount = allUsers.filter(user => new Date(user.createdAt) > oneMonthAgo).length;
  
  return {
    usersByRole,
    usersByBranch,
    activeUsers: {
      lastWeek: lastWeekCount,
      lastMonth: lastMonthCount
    },
    totalUsers: allUsers.length
  };
} 