"use server";

import { revalidatePath } from "next/cache";
import { getDBConnection } from "../mongodb";
import MentorMessage from "../models/MentorMessage";

/**
 * Send a message to a mentor
 */
export async function sendMentorMessage() {
  try {
    await getDBConnection();

    revalidatePath('/dashboard/alumni');
    revalidatePath('/dashboard/student');

    return { 
      success: true, 
      message: "Message sent successfully! The mentor will be notified." 
    };
  } catch (error: unknown) {
    console.error("Error sending mentor message:", error);
    return { 
      success: false, 
      message: (error as Error).message || "Failed to send message. Please try again." 
    };
  }
}

/**
 * Get messages for a mentor
 * @param mentorId Mentor ID
 */
export async function getMentorMessages(mentorId: string) {
  try {
    await getDBConnection();
    
    const messages = await MentorMessage.find({ mentorId })
      .sort({ createdAt: -1 });
    
    return { 
      success: true, 
      data: JSON.parse(JSON.stringify(messages)) 
    };
  } catch (error: unknown) {
    console.error("Error getting mentor messages:", error);
    return { 
      success: false, 
      message: (error as Error).message || "Failed to retrieve messages. Please try again.",
      data: [] 
    };
  }
}

/**
 * Mark a message as read
 * @param messageId Message ID
 */
export async function markMessageAsRead(messageId: string) {
  try {
    await getDBConnection();
    
    const message = await MentorMessage.findByIdAndUpdate(
      messageId,
      { read: true },
      { new: true }
    );
    
    if (!message) {
      return { success: false, message: "Message not found" };
    }
    
    revalidatePath('/dashboard/alumni');
    
    return { 
      success: true, 
      message: "Message marked as read",
      data: JSON.parse(JSON.stringify(message))
    };
  } catch (error: unknown) {
    console.error("Error marking message as read:", error);
    return { 
      success: false, 
      message: (error as Error).message || "Failed to update message status. Please try again." 
    };
  }
}