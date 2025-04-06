"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { getMentorStatus, deleteMentor } from "@/lib/db/actions/mentor.actions";
import MentorApplicationForm from "./MentorApplicationForm";
import ConfirmationDialog from "@/components/ui/confirmation-dialog";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define a type for mentor status
interface MentorStatusType {
  id: string;
  status: string;
  isMentor: boolean;
  data: MentorData;
}

interface MentorData {
  specializations: string[];
}

export default function MentorSection() {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mentorStatus, setMentorStatus] = useState<MentorStatusType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Fetch mentor status
  useEffect(() => {
    const checkMentorStatus = async () => {
      if (!isLoaded || !user) return;

      try {
        setLoading(true);
        const email = user.primaryEmailAddress?.emailAddress || '';
        const status = await getMentorStatus(email);
        setMentorStatus(status);
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
      const email = user.primaryEmailAddress?.emailAddress || '';
      getMentorStatus(email).then(status => {
        setMentorStatus(status);
      });
    }
  };

  // Handle delete mentorship
  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  // Confirm deletion
  const handleDeleteConfirm = async () => {
    if (!user || !mentorStatus) return;

    setIsDeleting(true);
    try {
      const result = await deleteMentor(
        mentorStatus.id,
        user.primaryEmailAddress?.emailAddress || '',
        false
      );

      if (result.success) {
        toast.success("You've successfully removed yourself from the mentorship program");
        setMentorStatus(null);
      } else {
        toast.error(result.message || "Failed to remove mentorship");
      }
    } catch (error: unknown) {
      console.error("Error removing mentorship:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to remove mentorship. Please try again."
      );
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Mentorship Program</h2>

      {!mentorStatus?.isMentor ? (
        <div className="space-y-6">
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-orange-700">
                  Share your knowledge and experience with current students by becoming a mentor.
                </p>
              </div>
            </div>
          </div>

          <div className="prose max-w-none text-gray-600 mb-6">
            <h3 className="text-gray-800 font-medium text-lg">Why Become a Mentor?</h3>
            <ul>
              <li>Give back to your alma mater and help shape future professionals</li>
              <li>Share your industry experience and knowledge</li>
              <li>Build your professional network and leadership skills</li>
              <li>Make a meaningful impact on students&apos; career journeys</li>
            </ul>

            <h3 className="text-gray-800 font-medium text-lg mt-4">What&apos;s Expected from Mentors?</h3>
            <ul>
              <li>Be available for scheduled mentoring sessions</li>
              <li>Provide guidance on career paths, industry insights, and professional development</li>
              <li>Share your experience and advice on navigating the professional world</li>
              <li>Commit to at least 2-3 hours per month for mentoring activities</li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Apply to Become a Mentor</h3>
            <MentorApplicationForm onSuccess={handleApplicationSuccess} />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className={`bg-${mentorStatus.status === 'approved' ? 'green' : 'orange'}-50 border-l-4 border-${mentorStatus.status === 'approved' ? 'green' : 'orange'}-500 p-4 mb-6`}>
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-gray-700">
                  {mentorStatus.status === 'approved'
                    ? "You are an approved mentor! Students can now request mentoring sessions with you."
                    : "Your mentor application is currently under review. We'll notify you once it's approved."}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-1">Application Status</h3>
                <p className="text-gray-600 text-sm">
                  Thank you for applying to our mentorship program!
                </p>
              </div>

              {mentorStatus.data && mentorStatus.data.specializations && (
                <div className="mt-4">
                  <h4 className="text-md font-medium text-gray-700 mb-2">Your Specializations</h4>
                  <div className="flex flex-wrap gap-2">
                    {mentorStatus.data.specializations.map((specialization: string) => (
                      <span key={specialization} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
                        {specialization}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 mt-6 border-t border-gray-100">
                <Button
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={handleDeleteClick}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {mentorStatus.status === 'approved' 
                    ? "Remove Mentorship" 
                    : "Withdraw Application"}
                </Button>
              </div>
            </div>
          </div>

          {/* Delete Confirmation Dialog */}
          <ConfirmationDialog
            isOpen={showDeleteDialog}
            onClose={() => setShowDeleteDialog(false)}
            onConfirm={handleDeleteConfirm}
            title={mentorStatus?.status === 'approved' ? "Remove Mentorship" : "Withdraw Application"}
            message={
              <div className="space-y-4">
                <p>
                  {mentorStatus?.status === 'approved'
                    ? "Are you sure you want to remove yourself from the mentorship program? Students will no longer be able to contact you for mentoring."
                    : "Are you sure you want to withdraw your mentorship application? You can apply again in the future."}
                </p>
                <p className="text-red-600 font-medium">
                  This action cannot be undone.
                </p>
              </div>
            }
            confirmText={mentorStatus?.status === 'approved' ? "Yes, Remove Mentorship" : "Yes, Withdraw Application"}
            type="danger"
          />
        </div>
      )}
    </div>
  );
}