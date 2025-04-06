"use server";

import connectToDatabase from "../connection";
import Post from "../models/Post";
import { revalidatePath } from "next/cache";

// Interface for creating a new post
interface CreatePostParams {
  title: string;
  content: string;
  author: string;
  authorId: string;
  authorEmail?: string;
  image?: string;
  tags?: string[];
  isStudentPost?: boolean;
}

// Interface for updating an existing post
interface UpdatePostParams {
  title?: string;
  content?: string;
  author?: string;
  authorId?: string;
  authorEmail?: string;
  image?: string;
  tags?: string[];
  isStudentPost?: boolean;
}

// Get all posts
export async function getAllPosts() {
  try {
    await connectToDatabase();
    
    const posts = await Post.find().sort({ createdAt: -1 });
    
    return JSON.parse(JSON.stringify(posts));
  } catch (error) {
    console.error("Error fetching posts:", error);
    return []; // Return empty array instead of throwing
  }
}

// Get posts by user ID
export async function getPostsByUser(authorId: string) {
  try {
    await connectToDatabase();
    
    const posts = await Post.find({ authorId }).sort({ createdAt: -1 });
    
    return JSON.parse(JSON.stringify(posts));
  } catch (error) {
    console.error(`Error fetching posts for user ${authorId}:`, error);
    return []; // Return empty array instead of throwing
  }
}

// Get post by ID
export async function getPostById(postId: string) {
  try {
    await connectToDatabase();
    
    const post = await Post.findById(postId);
    
    if (!post) {
      throw new Error("Post not found");
    }
    
    return JSON.parse(JSON.stringify(post));
  } catch (error) {
    console.error(`Error fetching post ${postId}:`, error);
    throw new Error("Failed to fetch post");
  }
}

// Create a new post
export async function createPost(postData: CreatePostParams) {
  try {
    await connectToDatabase();
    
    const newPost = await Post.create(postData);
    
    revalidatePath('/dashboard');
    
    return JSON.parse(JSON.stringify(newPost));
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error("Failed to create post");
  }
}

// Update an existing post
export async function updatePost(postId: string, updateData: UpdatePostParams) {
  try {
    await connectToDatabase();
    
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    if (!updatedPost) {
      throw new Error("Post not found");
    }
    
    revalidatePath('/dashboard');
    
    return JSON.parse(JSON.stringify(updatedPost));
  } catch (error) {
    console.error(`Error updating post ${postId}:`, error);
    throw new Error("Failed to update post");
  }
}

// Delete a post
export async function deletePost(postId: string) {
  try {
    await connectToDatabase();
    
    const deletedPost = await Post.findByIdAndDelete(postId);
    
    if (!deletedPost) {
      throw new Error("Post not found");
    }
    
    revalidatePath('/dashboard');
    
    return { success: true };
  } catch (error) {
    console.error(`Error deleting post ${postId}:`, error);
    throw new Error("Failed to delete post");
  }
}

// Like a post
export async function likePost(postId: string) {
  try {
    await connectToDatabase();
    
    const post = await Post.findByIdAndUpdate(
      postId,
      { $inc: { likes: 1 } },
      { new: true }
    );
    
    if (!post) {
      throw new Error("Post not found");
    }
    
    revalidatePath('/dashboard');
    
    return JSON.parse(JSON.stringify(post));
  } catch (error) {
    console.error(`Error liking post ${postId}:`, error);
    throw new Error("Failed to like post");
  }
}

// Add a comment to a post
export async function addComment(postId: string, comment: { content: string, author: string, authorId: string }) {
  try {
    await connectToDatabase();
    
    const post = await Post.findByIdAndUpdate(
      postId,
      { 
        $push: { 
          comments: {
            ...comment,
            createdAt: new Date()
          } 
        } 
      },
      { new: true }
    );
    
    if (!post) {
      throw new Error("Post not found");
    }
    
    revalidatePath('/dashboard');
    
    return JSON.parse(JSON.stringify(post));
  } catch (error) {
    console.error(`Error adding comment to post ${postId}:`, error);
    throw new Error("Failed to add comment");
  }
} 