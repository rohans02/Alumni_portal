"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { getMentorStatus, deleteMentor } from "@/lib/db/actions/mentor.actions";
import MentorApplicationForm from "./MentorApplicationForm";
import ConfirmationDialog from "@/components/ui/confirmation-dialog";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define mentor status type to avoid type errors
interface MentorStatusType {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  availability?: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
    preferredTime: string;
  };
}

export default function MentorSection() {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mentorStatus, setMentorStatus] = useState<MentorStatusType | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch mentor status
  useEffect(() => {
    const checkMentorStatus = async () => {
      if (!isLoaded || !user) return;
      
      try {
        setLoading(true);
        const status = await getMentorStatus(user.id);
        if (status) {
          setMentorStatus({
            id: status.id as string,
            status: status.status
          });
        }
      } catch (err) {
        console.error("Error checking mentor status:", err);
        setError("Failed to check mentor status. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    checkMentorStatus();
  }, [user, isLoaded]);

  // Handle after successful application
  const handleApplicationSuccess = () => {
    // Refetch the mentor status
    if (user) {
      getMentorStatus(user.id).then(status => {
        if (status) {
          setMentorStatus({
            id: status.id as string,
            status: status.status
          });
          toast.success("Your application has been submitted for review!");
        }
      });
    }
  };

  // Handle delete click
  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!user || !mentorStatus) return;
    
    setIsDeleting(true);
    try {
      const result = await deleteMentor(mentorStatus.id, user.id);
      
      if (result.success) {
        setMentorStatus(null);
        toast.success("Successfully resigned from the mentor program");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error deleting mentor:", error);
      toast.error("Failed to resign from the mentor program. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
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

  return (
    <div className="max-w-4xl mx-auto">
      {!mentorStatus ? (
        // Show application form if not a mentor
        <div className="space-y-6">
          <div className="bg-orange-50 border border-orange-200 text-orange-700 p-4 rounded-md">
            <h3 className="font-semibold mb-2">Become a Mentor</h3>
            <p>
              Share your knowledge and experience with current students. As a mentor, you can help 
              guide students in their academic and professional journey.
            </p>
          </div>
          
          <MentorApplicationForm onSubmitSuccess={handleApplicationSuccess} />
        </div>
      ) : (
        // Show mentor status and management options
        <div className="space-y-4">
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 p-4 rounded-md">
            <h3 className="font-semibold mb-2">You&apos;re an approved mentor!</h3>
            <p>
              You&apos;re now part of our mentorship program. Students can view your profile and 
              request mentorship.
            </p>
            <p>Here&apos;s a list of students who have reached out to you.</p>
            <p>You don&apos;t have any mentorship requests yet.</p>
          </div>
          
          <div className="pt-4 border-t border-gray-100 mt-6">
            <Button 
              variant="outline" 
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={handleDeleteClick}
              disabled={isDeleting}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Resign from Mentor Program
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        title="Resign from Mentor Program"
        message="Are you sure you want to resign from the mentor program? This action cannot be undone."
        confirmText="Yes, Resign"
        type="warning"
      />
    </div>
  );
}