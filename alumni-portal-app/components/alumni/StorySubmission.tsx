"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createStory } from "@/lib/db/actions/story.actions";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

export default function StorySubmission() {
  const router = useRouter();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Extract metadata from Clerk user
      const graduationYear = user?.publicMetadata?.graduationYear as string || '';
      const branch = user?.publicMetadata?.branch as string || '';
      
      await createStory({
        ...formData,
        isPublished: false, // Stories need admin approval
        author: user?.fullName || "",
        authorEmail: user?.primaryEmailAddress?.emailAddress || "",
        graduationYear,
        branch,
      });
      
      toast.success("Story submitted successfully! Waiting for admin approval.");
      setFormData({
        title: "",
        content: "",
        image: "",
      });
      router.refresh();
    } catch (error) {
      console.error("Error submitting story:", error);
      toast.error("Failed to submit story. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Share Your Story</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Story Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter a catchy title for your story"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Your Story</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Share your journey, experiences, and achievements..."
            className="min-h-[200px]"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Image URL</Label>
          <Input
            id="image"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="Enter the URL of an image for your story"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-orange-600 hover:bg-orange-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Story"}
        </Button>
      </form>
    </div>
  );
}