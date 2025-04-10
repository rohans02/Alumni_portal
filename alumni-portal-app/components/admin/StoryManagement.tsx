"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getAllStories, toggleStoryPublishStatus, deleteStory } from "@/lib/db/actions/story.actions";
import { format } from "date-fns";
import { toast } from "sonner";
import { Trash2, Eye, EyeOff } from "lucide-react";

interface Story {
  _id: string;
  title: string;
  content: string;
  author: string;
  authorEmail?: string;
  graduationYear?: string;
  branch?: string;
  image?: string;
  isPublished: boolean;
  createdAt: string;
}

export default function StoryManagement() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError,] = useState<string | null>(null);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const data = await getAllStories(false); // Get all stories, including unpublished
      setStories(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching stories:", err);
      setError("Failed to load stories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleTogglePublish = async (storyId: string) => {
    try {
      await toggleStoryPublishStatus(storyId);
      toast.success("Story status updated successfully");
      fetchStories(); // Refresh the list
    } catch (error) {
      console.error("Error toggling story status:", error);
      toast.error("Failed to update story status");
    }
  };

  const handleDelete = async (storyId: string) => {
    if (!confirm("Are you sure you want to delete this story?")) return;

    try {
      await deleteStory(storyId);
      toast.success("Story deleted successfully");
      fetchStories(); // Refresh the list
    } catch (error) {
      console.error("Error deleting story:", error);
      toast.error("Failed to delete story");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-row-reverse justify-between items-center">
        <div className="flex gap-2">
          <span className="text-sm text-gray-500">
            {stories.filter(s => !s.isPublished).length} pending approval
          </span>
        </div>
      </div>

      <div className="grid gap-6">
        {stories.map((story) => (
          <div
            key={story._id}
            className="bg-white rounded-lg shadow-md p-6 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{story.title}</h3>
                <p className="text-gray-500 text-sm truncate">
                  By: {story.author} {story.graduationYear && `(${story.graduationYear}${story.branch ? ` - ${story.branch}` : ''})`}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTogglePublish(story._id)}
                  className={story.isPublished ? "text-green-600" : "text-orange-600"}
                >
                  {story.isPublished ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-1" />
                      Unpublish
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-1" />
                      Publish
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(story._id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>

            {story.image && (
              <div className="relative h-48 w-full overflow-hidden rounded-md bg-gray-100">
                <img 
                  src={story.image}
                  alt={`Image for ${story.title}`}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    // Replace broken image with a placeholder
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x200?text=Image+Not+Available";
                  }}
                />
              </div>
            )}

            <div className="prose max-w-none">
              <p className="text-gray-600 line-clamp-3">{story.content}</p>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>
                Submitted on {format(new Date(story.createdAt), "MMMM d, yyyy")}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                story.isPublished
                  ? "bg-green-100 text-green-800"
                  : "bg-orange-100 text-orange-800"
              }`}>
                {story.isPublished ? "Published" : "Pending Approval"}
              </span>
            </div>
          </div>
        ))}

        {stories.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No stories found</p>
          </div>
        )}
      </div>
    </div>
  );
}