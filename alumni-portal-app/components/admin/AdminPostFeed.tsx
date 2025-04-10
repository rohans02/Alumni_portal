"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { getAllPosts, likePost, deletePost } from "@/lib/db/actions/post.actions";
import { MessageSquare, Trash2, Filter, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  createdAt: string;
  updatedAt: string;
  isStudentPost: boolean;
}

export default function AdminPostFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'student' | 'alumni'>('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  useEffect(() => {
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

    fetchPosts();
  }, []);

  const handleDeleteClick = (postId: string) => {
    setPostToDelete(postId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;

    try {
      await deletePost(postToDelete);

      // Remove the deleted post from the state
      setPosts(posts.filter(post => post._id !== postToDelete));

      toast.success("Post deleted successfully!");
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post. Please try again.");
    }
  };

  const toggleFilterMenu = () => {
    setShowFilterMenu(!showFilterMenu);
  };

  const setFilter = (type: 'all' | 'student' | 'alumni') => {
    setFilterType(type);
    setShowFilterMenu(false);
  };

  const filteredPosts = filterType === 'all' 
    ? posts 
    : posts.filter(post => 
        filterType === 'student' ? post.isStudentPost : !post.isStudentPost
      );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md flex items-center">
        <AlertCircle className="h-5 w-5 mr-2" />
        {error}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 p-8 rounded-md text-center">
        <p className="text-gray-500">No posts have been shared yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">
          Community Posts Feed
        </h3>
        <div className="relative">
          <Button 
            variant="outline" 
            onClick={toggleFilterMenu}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filter: {filterType === 'all' ? 'All Posts' : filterType === 'student' ? 'Student Posts' : 'Alumni Posts'}</span>
          </Button>
          
          {showFilterMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <div className="py-1">
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setFilter('all')}
                >
                  All Posts
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setFilter('student')}
                >
                  Student Posts
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setFilter('alumni')}
                >
                  Alumni Posts
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-4 rounded-md shadow-sm mb-4">
        <div className="flex gap-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            <span>Student Posts: {posts.filter(post => post.isStudentPost).length}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
            <span>Alumni Posts: {posts.filter(post => !post.isStudentPost).length}</span>
          </div>
          <div className="flex items-center ml-auto">
            <span className="font-medium">Total: {posts.length} posts</span>
          </div>
        </div>
      </div>

      {filteredPosts.map((post) => (
        <div key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          {/* Post Header */}
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center">
              <div className={`h-10 w-10 rounded-full ${post.isStudentPost ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'} flex items-center justify-center font-bold`}>
                {post.author.charAt(0)}
              </div>
              <div className="ml-3">
                <div className="flex items-center">
                  <h3 className="font-medium text-gray-800">{post.author}</h3>
                  <Badge 
                    className={`ml-2 ${post.isStudentPost ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' : 'bg-orange-100 text-orange-800 hover:bg-orange-100'}`}
                  >
                    {post.isStudentPost ? 'Student' : 'Alumni'}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDeleteClick(post._id)}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                aria-label="Delete post"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Post Content */}
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-700 whitespace-pre-line">{post.content}</p>
          </div>

          {/* Post Image (if any) */}
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

          {/* Post Stats */}
          <div className="p-4 border-t border-gray-100 flex space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <span className="font-medium mr-1">{post.likes}</span>
              <span>likes</span>
            </div>
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span>{post.comments.length} comments</span>
            </div>
          </div>

          {/* Comments Section - Preview */}
          {post.comments.length > 0 && (
            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium text-gray-700">
                  Comments ({post.comments.length})
                </h4>
                {post.comments.length > 2 && (
                  <button className="text-xs text-blue-600 hover:text-blue-800">
                    View all
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {post.comments.slice(0, 2).map((comment, index) => (
                  <div key={index} className="flex space-x-2">
                    <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">
                      {comment.author.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <p className="text-xs font-medium text-gray-800">{comment.author}</p>
                        <span className="mx-1 text-gray-300">•</span>
                        <p className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      <p className="text-sm text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Delete Confirmation Dialog */}
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