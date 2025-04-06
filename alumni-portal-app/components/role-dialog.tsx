"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { assignRole } from "@/lib/roles";
import { useState } from "react";

export default function RoleSelectionDialog() {
  const [isOpen, setOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  async function handleRoleSelection(role: 'student' | 'alumni') {
    try {
      setIsLoading(true);
      await assignRole(role);
      setOpen(false);
      // Navigate to dashboard with a new URL parameter to force a full reload
      window.location.href = `/dashboard?t=${Date.now()}`;
    } catch (error) {
      console.error("Error assigning role:", error);
      setIsLoading(false);
    }
  }
  
  return (
    <Dialog open={isOpen}>
      {/* <DialogTrigger>
          <button className="bg-blue-500 text-white p-2 rounded-md">
            Select Role
          </button>
        </DialogTrigger> */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Role</DialogTitle>
          <DialogDescription>
            Please select a role to continue
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center space-x-4">
          <button
            className="bg-blue-500 text-white p-2 rounded-md disabled:opacity-50"
            onClick={() => handleRoleSelection('student')}
            disabled={isLoading}
          >
            {isLoading ? 'Please wait...' : 'Student'}
          </button>
          <button
            className="bg-blue-500 text-white p-2 rounded-md disabled:opacity-50"
            onClick={() => handleRoleSelection('alumni')}
            disabled={isLoading}
          >
            {isLoading ? 'Please wait...' : 'Alumni'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
