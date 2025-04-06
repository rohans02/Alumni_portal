"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import ConfirmationDialog from "@/components/ui/confirmation-dialog";

import { applyAsMentor } from "@/lib/db/actions/mentor.actions";

// Validation schema using Zod
const applicationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  specializations: z.array(z.string()).min(1, "At least one specialization is required"),
  experience: z.string().min(3, "Experience is required"),
  bio: z.string().min(20, "Bio should be at least 20 characters"),
  graduated: z.string().regex(/^\d{4}$/, "Year must be in YYYY format"),
  branch: z.string().min(2, "Branch of study is required"),
  company: z.string().optional(),
  role: z.string().optional(),
  linkedin: z.string().optional().refine(
    val => !val || val.includes('linkedin.com'),
    { message: "Please enter a valid LinkedIn URL" }
  )
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

interface MentorApplicationFormProps {
  onSubmitSuccess?: () => void;
}

export default function MentorApplicationForm({ onSubmitSuccess }: MentorApplicationFormProps) {
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [specializationInput, setSpecializationInput] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  
  // Initialize form with user data if available
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: user?.fullName || "",
      email: user?.primaryEmailAddress?.emailAddress || "",
      specializations: [],
      experience: "",
      bio: "",
      graduated: "",
      branch: "",
      company: "",
      role: "",
      linkedin: ""
    }
  });
  
  const specializations = watch("specializations");
  
  // Add a specialization tag
  const addSpecialization = () => {
    if (!specializationInput.trim()) return;
    
    // Prevent duplicates
    if (!specializations.includes(specializationInput.trim())) {
      setValue("specializations", [...specializations, specializationInput.trim()]);
    }
    
    setSpecializationInput("");
  };
  
  // Remove a specialization tag
  const removeSpecialization = (specializationToRemove: string) => {
    setValue(
      "specializations", 
      specializations.filter(s => s !== specializationToRemove)
    );
  };
  
  // Handle form submission
  const onSubmit = async (data: ApplicationFormValues) => {
    if (!user?.id) {
      toast.error("You must be logged in to apply as a mentor");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await applyAsMentor({
        userId: user.id,
        ...data
      });
      
      if (result.success) {
        setShowSuccessDialog(true);
        if (onSubmitSuccess) {
          onSubmitSuccess();
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input 
              id="name" 
              {...register("name")}
              disabled={isSubmitting} 
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input 
              id="email" 
              type="email" 
              {...register("email")} 
              disabled
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="graduated">Graduation Year *</Label>
            <Input 
              id="graduated" 
              placeholder="YYYY" 
              {...register("graduated")} 
              disabled={isSubmitting}
            />
            {errors.graduated && (
              <p className="text-sm text-red-500">{errors.graduated.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="branch">Branch/Specialization *</Label>
            <Input 
              id="branch" 
              placeholder="e.g., Computer Science, Mechanical Engineering" 
              {...register("branch")} 
              disabled={isSubmitting}
            />
            {errors.branch && (
              <p className="text-sm text-red-500">{errors.branch.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company">Current Company (Optional)</Label>
            <Input 
              id="company" 
              placeholder="e.g., Google, Microsoft" 
              {...register("company")} 
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Current Role (Optional)</Label>
            <Input 
              id="role" 
              placeholder="e.g., Software Engineer, Product Manager" 
              {...register("role")} 
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="experience">Years of Experience *</Label>
            <Input 
              id="experience" 
              placeholder="e.g., 5+ years in software development" 
              {...register("experience")} 
              disabled={isSubmitting}
            />
            {errors.experience && (
              <p className="text-sm text-red-500">{errors.experience.message}</p>
            )}
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="linkedin">LinkedIn Profile URL (Optional)</Label>
            <Input 
              id="linkedin" 
              placeholder="https://www.linkedin.com/in/yourprofile" 
              {...register("linkedin")} 
              disabled={isSubmitting}
            />
            {errors.linkedin && (
              <p className="text-sm text-red-500">{errors.linkedin.message}</p>
            )}
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="specializations">Areas of Expertise *</Label>
            <div className="flex space-x-2">
              <Input 
                id="specializationInput"
                placeholder="e.g., Web Development, Machine Learning"
                value={specializationInput}
                onChange={(e) => setSpecializationInput(e.target.value)}
                disabled={isSubmitting}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSpecialization();
                  }
                }}
              />
              <Button 
                type="button" 
                onClick={addSpecialization}
                disabled={isSubmitting}
                className="shrink-0 bg-orange-600 hover:bg-orange-700"
              >
                Add
              </Button>
            </div>
            
            {specializations.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {specializations.map((spec) => (
                  <Badge 
                    key={spec} 
                    className="bg-orange-100 text-orange-800 hover:bg-orange-200 pl-2"
                  >
                    {spec}
                    <button
                      type="button"
                      onClick={() => removeSpecialization(spec)}
                      className="ml-1 rounded-full p-1 text-orange-800 hover:bg-orange-200 hover:text-orange-900"
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            
            {errors.specializations && (
              <p className="text-sm text-red-500">{errors.specializations.message}</p>
            )}
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="bio">Bio *</Label>
            <Textarea 
              id="bio" 
              placeholder="Share your experience and what you can offer as a mentor. This will be visible to students."
              {...register("bio")} 
              className="h-32"
              disabled={isSubmitting}
            />
            {errors.bio && (
              <p className="text-sm text-red-500">{errors.bio.message}</p>
            )}
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="bg-orange-600 hover:bg-orange-700 text-white px-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </div>
      </form>

      {/* Success confirmation dialog */}
      <ConfirmationDialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        title="Application Submitted!"
        message={
          <div className="space-y-4">
            <p>
              Thank you for applying to become a mentor! Your application has been submitted successfully and is now under review by our team.
            </p>
            <p>
              You will receive a notification once your application has been processed. In the meantime, you can check the status of your application in the Mentorship tab.
            </p>
          </div>
        }
        confirmText="Got it!"
        type="success"
        showCancel={false}
      />
    </>
  );
} 