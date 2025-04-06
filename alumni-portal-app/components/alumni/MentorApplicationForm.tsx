"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { applyAsMentor } from "@/lib/db/actions/mentor.actions";
import { useUser } from "@clerk/nextjs";
import ConfirmationDialog from "@/components/ui/confirmation-dialog";

// Specialization options
const SPECIALIZATIONS = [
  "Web Development",
  "Mobile App Development",
  "Data Science",
  "Machine Learning",
  "Artificial Intelligence",
  "DevOps",
  "Cloud Computing",
  "Cybersecurity",
  "UI/UX Design",
  "Software Engineering",
  "Blockchain",
  "IoT",
  "AR/VR",
  "Robotics",
  "Embedded Systems"
];

// Mentorship format options
const MENTORSHIP_FORMATS = [
  "One-on-one meetings",
  "Virtual meetings",
  "Email exchanges",
  "Phone calls",
  "Group sessions"
];

// Availability options
const AVAILABILITY_OPTIONS = [
  "Weekday mornings",
  "Weekday afternoons",
  "Weekday evenings",
  "Weekend mornings",
  "Weekend afternoons",
  "Weekend evenings"
];

interface FormData {
  graduated: string;
  branch: string;
  experience: string;
  bio: string;
  company: string;
  role: string;
  linkedin: string;
  maxMentees: string; // Changed to string for form input but will be converted to number
  mentorshipTopics: string;
}

export default function MentorApplicationForm({ onSuccess }: { onSuccess?: () => void }) {
  const { user, isLoaded } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>({
    graduated: "",
    branch: "",
    experience: "",
    bio: "",
    company: "",
    role: "",
    linkedin: "",
    maxMentees: "1",
    mentorshipTopics: ""
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user metadata from Clerk when component loads
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isLoaded || !user) return;

      try {
        setIsLoading(true);

        // Get branch and graduation year from user metadata with type assertions
        const userMetadata = user.publicMetadata as Record<string, string>;
        const branch = userMetadata.branch;
        const graduationYear = userMetadata.graduationYear;

        if (branch || graduationYear) {
          setFormData(prev => ({
            ...prev,
            branch: branch || "",
            graduated: graduationYear || ""
          }));
        }
      } catch (error) {
        console.error("Error fetching user metadata:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user, isLoaded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id || !user?.fullName || !user?.primaryEmailAddress?.emailAddress) {
      toast.error("User information not available");
      return;
    }

    if (selectedSpecializations.length === 0) {
      toast.error("Please select at least one specialization");
      return;
    }

    if (selectedAvailability.length === 0) {
      toast.error("Please select at least one availability option");
      return;
    }

    if (selectedFormats.length === 0) {
      toast.error("Please select at least one mentorship format");
      return;
    }

    setIsSubmitting(true);

    try {
      // Save the mentor application to the database
      const result = await applyAsMentor({
        userId: user.id,
        name: user.fullName,
        email: user.primaryEmailAddress.emailAddress,
        specializations: selectedSpecializations,
        experience: formData.experience,
        bio: formData.bio,
        graduated: formData.graduated,
        branch: formData.branch,
        company: formData.company,
        role: formData.role,
        linkedin: formData.linkedin,
        // New mentorship fields
        availability: selectedAvailability,
        mentorshipFormats: selectedFormats,
        mentorshipTopics: formData.mentorshipTopics.split(',').map(topic => topic.trim()),
        maxMentees: parseInt(formData.maxMentees) || 1
      });

      if (result.success) {
        setShowSuccessDialog(true);
        // Reset form
        setSelectedSpecializations([]);
        setSelectedAvailability([]);
        setSelectedFormats([]);
        setFormData({
          graduated: "",
          branch: "",
          experience: "",
          bio: "",
          company: "",
          role: "",
          linkedin: "",
          maxMentees: "1",
          mentorshipTopics: ""
        });

        // Call the success callback if provided
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(result.message || "Failed to submit application");
      }
    } catch (error: unknown) {
      console.error("Error submitting mentor application:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to submit application. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle a specialization in the selected list
  const toggleSpecialization = (specialization: string) => {
    if (selectedSpecializations.includes(specialization)) {
      setSelectedSpecializations(selectedSpecializations.filter(s => s !== specialization));
    } else {
      setSelectedSpecializations([...selectedSpecializations, specialization]);
    }
  };

  // Toggle availability option
  const toggleAvailability = (option: string) => {
    if (selectedAvailability.includes(option)) {
      setSelectedAvailability(selectedAvailability.filter(a => a !== option));
    } else {
      setSelectedAvailability([...selectedAvailability, option]);
    }
  };

  // Toggle mentorship format
  const toggleFormat = (format: string) => {
    if (selectedFormats.includes(format)) {
      setSelectedFormats(selectedFormats.filter(f => f !== format));
    } else {
      setSelectedFormats([...selectedFormats, format]);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-4">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Education and Background Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">Education & Background</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="graduated" className="text-gray-700">Graduation Year</Label>
              <Input
                id="graduated"
                value={formData.graduated}
                onChange={(e) => setFormData({ ...formData, graduated: e.target.value })}
                placeholder="e.g. 2018"
                className="border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                required
                readOnly={Boolean((user?.publicMetadata as Record<string, string>)?.graduationYear)}
              />
              {Boolean((user?.publicMetadata as Record<string, string>)?.graduationYear) && (
                <p className="text-xs text-gray-500 mt-1">
                  Auto-filled from your profile
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="branch" className="text-gray-700">Branch/Department</Label>
              <Input
                id="branch"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                placeholder="e.g. Computer Science"
                className="border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                required
                readOnly={Boolean((user?.publicMetadata as Record<string, string>)?.branch)}
              />
              {Boolean((user?.publicMetadata as Record<string, string>)?.branch) && (
                <p className="text-xs text-gray-500 mt-1">
                  Auto-filled from your profile
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company" className="text-gray-700">Current Company (Optional)</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. Google"
                className="border-gray-300 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-gray-700">Current Role (Optional)</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. Senior Software Engineer"
                className="border-gray-300 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="linkedin" className="text-gray-700">LinkedIn Profile (Optional)</Label>
              <Input
                id="linkedin"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                placeholder="e.g. https://linkedin.com/in/yourprofile"
                className="border-gray-300 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Experience Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">Expertise & Experience</h3>

          <div className="space-y-4">
            <div>
              <Label className="text-gray-700 block mb-2">Areas of Specialization</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-y-2">
                {SPECIALIZATIONS.map((specialization) => (
                  <div key={specialization} className="flex items-center space-x-2">
                    <Checkbox
                      id={`specialization-${specialization}`}
                      checked={selectedSpecializations.includes(specialization)}
                      onCheckedChange={() => toggleSpecialization(specialization)}
                    />
                    <label
                      htmlFor={`specialization-${specialization}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {specialization}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience" className="text-gray-700">Years of Experience</Label>
              <Input
                id="experience"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="e.g. 5 years in software development"
                className="border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-gray-700">Professional Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Briefly describe your professional journey, achievements, and how you can help students..."
                className="min-h-[120px] border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Mentorship Preferences Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">Mentorship Preferences</h3>

          <div className="space-y-4">
            <div>
              <Label className="text-gray-700 block mb-2">Availability</Label>
              <p className="text-sm text-gray-500 mb-2">When are you typically available for mentoring?</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-y-2">
                {AVAILABILITY_OPTIONS.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`availability-${option}`}
                      checked={selectedAvailability.includes(option)}
                      onCheckedChange={() => toggleAvailability(option)}
                    />
                    <label
                      htmlFor={`availability-${option}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-gray-700 block mb-2">Preferred Mentorship Formats</Label>
              <p className="text-sm text-gray-500 mb-2">How would you like to connect with mentees?</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
                {MENTORSHIP_FORMATS.map((format) => (
                  <div key={format} className="flex items-center space-x-2">
                    <Checkbox
                      id={`format-${format}`}
                      checked={selectedFormats.includes(format)}
                      onCheckedChange={() => toggleFormat(format)}
                    />
                    <label
                      htmlFor={`format-${format}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {format}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mentorshipTopics" className="text-gray-700">Topics You Can Mentor On</Label>
              <p className="text-sm text-gray-500 mb-2">Specific topics you're comfortable mentoring on (comma-separated)</p>
              <Textarea
                id="mentorshipTopics"
                value={formData.mentorshipTopics}
                onChange={(e) => setFormData({ ...formData, mentorshipTopics: e.target.value })}
                placeholder="e.g. Career guidance, Interview preparation, Project management, Technical skills"
                className="border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxMentees" className="text-gray-700">Maximum Number of Mentees</Label>
              <p className="text-sm text-gray-500 mb-2">How many mentees can you support at once?</p>
              <Input
                id="maxMentees"
                type="number"
                min="1"
                max="10"
                value={formData.maxMentees}
                onChange={(e) => setFormData({ ...formData, maxMentees: e.target.value })}
                className="w-24 border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-4 flex justify-end">
          <Button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting Application..." : "Submit Application"}
          </Button>
        </div>
      </form>

      {/* Success Dialog */}
      <ConfirmationDialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        title="Application Submitted!"
        message={
          <div className="space-y-4">
            <p>
              Thank you for applying to become a mentor! Your application has been successfully submitted and is now under review.
            </p>
            <p>
              We&apos;ll review your application shortly.
            </p>
            <p>
              If you have any questions, please contact the alumni office.
            </p>
          </div>
        }
        confirmText="Got it!"
        type="success"
        showCancel={false}
      />
    </div>
  );
}