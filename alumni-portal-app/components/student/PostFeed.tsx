"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { getAllPosts, likePost, deletePost } from "@/lib/db/actions/post.actions";
import { Heart, MessageSquare, Share, Tag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { getCurrentRole } from "@/lib/roles";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Comment {
  content: string;
  author: string;
  authorId: string;
  createdAt: string;
}

interface Post {
  _id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  authorEmail?: string;
  image?: string;
  likes: number;
  comments: Comment[];
  tags?: string[];
  isStudentPost?: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function PostFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  useEffect(() => {
    const checkRole = async () => {
      try {
        const role = await getCurrentRole();
        setIsAdmin(role === "admin");
      } catch (err) {
        console.error("Error checking role:", err);
      }
    };

    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await getAllPosts();
        setPosts(data);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    checkRole();
    fetchPosts();
  }, []);

  const handleLike = async (postId: string) => {
    try {
      const updatedPost = await likePost(postId);

      setPosts(posts.map(post => 
        post._id === postId ? { ...post, likes: updatedPost.likes } : post
      ));

      toast.success("Post liked!");
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error("Failed to like post. Please try again.");
    }
  };

  const handleDeleteClick = (postId: string) => {
    setPostToDelete(postId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;

    try {
      await deletePost(postToDelete);

      setPosts(posts.filter(post => post._id !== postToDelete));

      toast.success("Post deleted successfully!");
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post. Please try again.");
    }
  };

  const allTags = Array.from(
    new Set(
      posts.flatMap(post => post.tags || [])
    )
  );

  const filteredPosts = activeTag 
    ? posts.filter(post => post.tags?.includes(activeTag))
    : posts;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        {error}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 p-8 rounded-md text-center">
        <p className="text-gray-500">No posts have been shared yet.</p>
        <p className="text-gray-500 mt-2">Be the first to share a post with your fellow students!</p>
      </div>
    );
  }

  return (
    <div>
      {allTags.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Filter by tag:</h3>
          <div className="flex flex-wrap gap-2">
            <button 
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                activeTag === null 
                  ? 'bg-orange-100 text-orange-800' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTag(null)}
            >
              All Posts
            </button>
            
            {allTags.map(tag => (
              <button 
                key={tag}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  activeTag === tag 
                    ? 'bg-orange-100 text-orange-800' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {filteredPosts.map((post) => (
          <div key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                    {post.author.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <div className="flex items-center">
                      <h3 className="font-medium text-gray-800">{post.author}</h3>
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                        post.isStudentPost ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {post.isStudentPost ? 'Student' : 'Alumni'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleDeleteClick(post._id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    aria-label="Delete post"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-700 whitespace-pre-line">{post.content}</p>
              
              {post.tags && post.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 cursor-pointer"
                      onClick={() => setActiveTag(tag)}
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {post.image && (
              <div className="relative h-64 w-full">
                <Image 
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            
            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
              <div className="flex space-x-6">
                <button 
                  className="flex items-center text-gray-500 hover:text-orange-600"
                  onClick={() => handleLike(post._id)}
                >
                  <Heart className="w-5 h-5 mr-1" />
                  <span className="text-sm">{post.likes || 0}</span>
                </button>
                <button className="flex items-center text-gray-500 hover:text-orange-600">
                  <MessageSquare className="w-5 h-5 mr-1" />
                  <span className="text-sm">{post.comments?.length || 0}</span>
                </button>
              </div>
              <button className="flex items-center text-gray-500 hover:text-orange-600">
                <Share className="w-5 h-5 mr-1" />
                <span className="text-sm">Share</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}