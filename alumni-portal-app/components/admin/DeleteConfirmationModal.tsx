"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { deleteUser } from "@/lib/profile";

interface DeleteConfirmationModalProps {
  userId: string;
  userName: string;
  onClose: () => void;
  onUserDeleted: () => void;
}

export default function DeleteConfirmationModal({ 
  userId, 
  userName, 
  onClose, 
  onUserDeleted 
}: DeleteConfirmationModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    
    try {
      const result = await deleteUser(userId);
      
      if (result.success) {
        onUserDeleted();
        onClose();
      } else {
        setError("Failed to delete user. Please try again.");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Delete User</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
            {error}
          </div>
        )}
        
        <div className="mb-6">
          <p className="text-gray-700">
            Are you sure you want to delete the user <span className="font-semibold">{userName}</span>?
            This action cannot be undone.
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-400"
          >
            {isDeleting ? "Deleting..." : "Delete User"}
          </button>
        </div>
      </div>
    </div>
  );
} 