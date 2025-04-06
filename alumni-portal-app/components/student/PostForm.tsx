"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPost } from "@/lib/db/actions/post.actions";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { FileUp } from "lucide-react";

export default function PostForm() {
  const router = useRouter();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
    tags: "", // Additional field for students to add tags like #assignment #question etc.
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to create a post");
      return;
    }
    
    setIsSubmitting(true);

    try {
      await createPost({
        title: formData.title,
        content: formData.content,
        image: formData.image,
        author: user.fullName || "",
        authorId: user.id,
        authorEmail: user.primaryEmailAddress?.emailAddress || "",
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ""), // Process tags
        isStudentPost: true, // Flag to identify student posts
      });
      
      toast.success("Post created successfully!");
      setFormData({
        title: "",
        content: "",
        image: "",
        tags: "",
      });
      router.refresh();
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Create Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-gray-700">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter a title for your post"
            className="border-gray-300 focus:ring-orange-500 focus:border-orange-500"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content" className="text-gray-700">Content</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Ask a question, share an idea, or connect with other students..."
            className="min-h-[150px] border-gray-300 focus:ring-orange-500 focus:border-orange-500"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags" className="text-gray-700">Tags (comma separated)</Label>
          <Input
            id="tags"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="e.g. question, assignment, event"
            className="border-gray-300 focus:ring-orange-500 focus:border-orange-500"
          />
          <p className="text-xs text-gray-500">Add relevant tags to help categorize your post</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="image" className="text-gray-700">Image URL (optional)</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="image"
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="border-gray-300 focus:ring-orange-500 focus:border-orange-500"
            />
            <Button 
              type="button" 
              variant="outline"
              className="flex items-center"
              onClick={() => {/* Future image upload functionality */}}
            >
              <FileUp className="w-4 h-4 mr-2" />
              Upload
            </Button>
          </div>
          <p className="text-xs text-gray-500">Add an image URL to accompany your post (optional)</p>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-orange-600 hover:bg-orange-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating Post..." : "Share Post"}
        </Button>
      </form>
    </div>
  );
} 