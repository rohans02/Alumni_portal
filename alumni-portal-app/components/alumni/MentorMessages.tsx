"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { format } from "date-fns";
import { getMentorStatus } from "@/lib/db/actions/mentor.actions";
import { getMentorMessages, markMessageAsRead } from "@/lib/db/actions/mentor-message.actions";
import { Button } from "@/components/ui/button";
import { Mail, MailOpen } from "lucide-react";

interface Message {
  _id: string;
  studentName: string;
  studentEmail: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function MentorMessages() {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mentorId, setMentorId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  // Fetch mentor status and messages
  useEffect(() => {
    const fetchData = async () => {
      if (!isLoaded || !user) return;
      
      try {
        setLoading(true);
        const email = user.primaryEmailAddress?.emailAddress || '';
        const mentorStatus = await getMentorStatus(email);
        
        if (!mentorStatus || !mentorStatus.isMentor || mentorStatus.status !== 'approved') {
          setMentorId(null);
          setMessages([]);
          return;
        }
        
        setMentorId(mentorStatus.id);
        
        // Fetch messages for this mentor
        const messagesResult = await getMentorMessages(mentorStatus.id);
        if (messagesResult.success) {
          setMessages(messagesResult.data);
        } else {
          toast.error(messagesResult.message);
        }
      } catch (err) {
        console.error("Error fetching mentor messages:", err);
        setError("Failed to load your messages. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isLoaded]);

  // Handle marking a message as read
  const handleMarkAsRead = async (messageId: string) => {
    try {
      const result = await markMessageAsRead(messageId);
      
      if (result.success) {
        // Update the local messages state
        setMessages(messages.map(msg => 
          msg._id === messageId ? { ...msg, read: true } : msg
        ));
        
        // Update selected message if it's the one being marked as read
        if (selectedMessage && selectedMessage._id === messageId) {
          setSelectedMessage({ ...selectedMessage, read: true });
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error marking message as read:", error);
      toast.error("Failed to update message status.");
    }
  };

  // Handle selecting a message to view details
  const handleSelectMessage = (message: Message) => {
    setSelectedMessage(message);
    
    // Mark as read if not already read
    if (!message.read) {
      handleMarkAsRead(message._id);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        {error}
      </div>
    );
  }

  // No mentor status or not approved
  if (!mentorId) {
    return (
      <div className="bg-gray-50 p-6 rounded-md text-center">
        <p className="text-gray-500">
          You need to be an approved mentor to view messages from students.
        </p>
      </div>
    );
  }

  // No messages
  if (messages.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Student Messages</h2>
        <div className="bg-gray-50 p-6 rounded-md text-center">
          <p className="text-gray-500">
            You don&apos;t have any messages from students yet.
          </p>
        </div>
      </div>
    );
  }

  // Count unread messages
  const unreadCount = messages.filter(msg => !msg.read).length;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Student Messages
          {unreadCount > 0 && (
            <span className="ml-2 bg-orange-100 text-orange-800 text-sm px-2 py-1 rounded-full">
              {unreadCount} new
            </span>
          )}
        </h2>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Messages list */}
        <div className="md:w-1/3">
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b">
              <h3 className="font-medium text-gray-700">Messages ({messages.length})</h3>
            </div>
            <div className="divide-y max-h-[500px] overflow-y-auto">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${
                    selectedMessage?._id === msg._id ? 'bg-orange-50' : ''
                  } ${!msg.read ? 'font-medium' : ''}`}
                  onClick={() => handleSelectMessage(msg)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-800">{msg.studentName}</span>
                    <span className="text-xs text-gray-500">
                      {format(new Date(msg.createdAt), 'MMM d, h:mm a')}
                    </span>
                  </div>
                  <div className="flex items-center">
                    {!msg.read ? (
                      <Mail className="h-4 w-4 text-orange-500 mr-2" />
                    ) : (
                      <MailOpen className="h-4 w-4 text-gray-400 mr-2" />
                    )}
                    <p className="text-sm text-gray-600 truncate">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Message details */}
        <div className="md:w-2/3">
          {selectedMessage ? (
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
                <h3 className="font-medium text-gray-700">From: {selectedMessage.studentName}</h3>
                <span className="text-sm text-gray-500">
                  {format(new Date(selectedMessage.createdAt), 'MMM d, yyyy - h:mm a')}
                </span>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-1">Student Email:</div>
                  <a href={`mailto:${selectedMessage.studentEmail}`} className="text-blue-600 hover:underline">
                    {selectedMessage.studentEmail}
                  </a>
                </div>
                <div className="mb-6">
                  <div className="text-sm text-gray-500 mb-1">Message:</div>
                  <div className="bg-gray-50 p-4 rounded whitespace-pre-wrap">
                    {selectedMessage.message}
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    className="bg-orange-600 hover:bg-orange-700"
                    onClick={() => window.open(`mailto:${selectedMessage.studentEmail}`, '_blank')}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Reply via Email
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="border rounded-lg p-8 text-center bg-gray-50 h-full flex flex-col items-center justify-center">
              <Mail className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-500">Select a message to view details</p>
              <p className="text-gray-400 text-sm mt-1">
                Click on any message from the list on the left
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}