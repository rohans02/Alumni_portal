"use client";

import { useState, useEffect } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import Image from "next/image";
import {
  FileText,
  Users,
  Calendar,
  Bookmark,
  Plus,
  X,
  GraduationCap,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PostForm from "./PostForm";
import PostFeed from "./PostFeed";
import StorySubmission from "./StorySubmission";
import MentorSection from "./MentorSection";
import { getAllEvents } from "@/lib/db/actions/event.actions";
import { getStoriesByAuthorEmail } from "@/lib/db/actions/story.actions";
import { format } from "date-fns";

type SidebarTabType =
  | "feed"
  | "network"
  | "events"
  | "myStories"
  | "mentorship";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
}

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

export default function AlumniDashboard() {
  const [activeSidebarTab, setActiveSidebarTab] =
    useState<SidebarTabType>("feed");
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [isStoryDialogOpen, setIsStoryDialogOpen] = useState(false);
  const { user } = useUser();
  const { signOut } = useClerk();

  // Events data state
  const [events, setEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState<string | null>(null);

  // My stories data state
  const [myStories, setMyStories] = useState<Story[]>([]);
  const [storiesLoading, setStoriesLoading] = useState(true);
  const [storiesError, setStoriesError] = useState<string | null>(null);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setEventsLoading(true);
        const data = await getAllEvents(true); // Only get active events
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEventsError("Failed to load events. Please try again.");
      } finally {
        setEventsLoading(false);
      }
    };

    if (activeSidebarTab === "events") {
      fetchEvents();
    }
  }, [activeSidebarTab]);

  // Fetch user stories
  useEffect(() => {
    const fetchStories = async () => {
      try {
        setStoriesLoading(true);
        if (user?.primaryEmailAddress?.emailAddress) {
          const data = await getStoriesByAuthorEmail(
            user.primaryEmailAddress.emailAddress
          );
          setMyStories(data);
        }
      } catch (error) {
        console.error("Error fetching stories:", error);
        setStoriesError("Failed to load your stories. Please try again.");
      } finally {
        setStoriesLoading(false);
      }
    };

    if (activeSidebarTab === "myStories") {
      fetchStories();
    }
  }, [activeSidebarTab, user?.primaryEmailAddress?.emailAddress]);

  // Count stories by status
  const pendingStories = myStories.filter((story) => !story.isPublished).length;
  const publishedStories = myStories.filter(
    (story) => story.isPublished
  ).length;
  const totalStories = myStories.length;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Sidebar - moved above header */}
      <aside className="w-64 bg-black/80 text-white shadow-md fixed top-0 left-0 h-screen z-20 overflow-y-auto flex flex-col">
        {/* College Logo & Name */}
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-2xl font-bold mb-10">Alumni Dashboard</h1>
          <div className="flex items-center justify-center mb-2">
            <div className="w-20 h-20 rounded-full overflow-hidden">
              <Image
                src="/assets/emblem.jpeg"
                alt="MMCOE Logo"
                width={100}
                height={100}
              />
            </div>
          </div>
          <h2 className="text-center text-sm font-medium">
            Marathawada Mitra Mandal
          </h2>
          <h3 className="text-center text-xs text-gray-400">
            College of Engineering
          </h3>
        </div>

        <nav className="py-4 flex-grow">
          <ul className="space-y-1 px-2">
            <li>
              <button
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-md ${
                  activeSidebarTab === "feed"
                    ? "bg-orange-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
                onClick={() => setActiveSidebarTab("feed")}
              >
                <FileText className="h-5 w-5" />
                <span>Feed</span>
              </button>
            </li>
            <li>
              <button
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-md ${
                  activeSidebarTab === "network"
                    ? "bg-orange-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
                onClick={() => setActiveSidebarTab("network")}
              >
                <Users className="h-5 w-5" />
                <span>Network</span>
              </button>
            </li>
            <li>
              <button
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-md ${
                  activeSidebarTab === "events"
                    ? "bg-orange-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
                onClick={() => setActiveSidebarTab("events")}
              >
                <Calendar className="h-5 w-5" />
                <span>Events</span>
              </button>
            </li>
            <li>
              <button
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-md ${
                  activeSidebarTab === "myStories"
                    ? "bg-orange-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
                onClick={() => setActiveSidebarTab("myStories")}
              >
                <Bookmark className="h-5 w-5" />
                <span>My Stories</span>
              </button>
            </li>
            <li>
              <button
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-md ${
                  activeSidebarTab === "mentorship"
                    ? "bg-orange-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
                onClick={() => setActiveSidebarTab("mentorship")}
              >
                <GraduationCap className="h-5 w-5" />
                <span>Mentorship</span>
              </button>
            </li>
          </ul>
        </nav>
        
        {/* Logout button at bottom of sidebar */}
        <div className="mt-auto p-4 border-t border-gray-800">
          <button
            onClick={() => signOut()}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm text-white bg-gray-600 hover:bg-orange-700 rounded-md transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Header - now after sidebar in the DOM */}
      <header className="py-4">
        <div className="mx-auto flex justify-between px-5">
          {/* Empty header, user button removed */}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-6 ml-64">
        <div className="max-w-4xl mx-auto">
          {/* FEED SECTION */}
          {activeSidebarTab === "feed" && (
            <>
              {/* Feed Section */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Alumni Feed
                  </h2>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      className="border-orange-600 text-orange-600 hover:bg-orange-50"
                      onClick={() => setIsStoryDialogOpen(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Submit Story
                    </Button>
                    <Button
                      className="bg-orange-600 hover:bg-orange-700"
                      onClick={() => setIsPostDialogOpen(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Post
                    </Button>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 mb-4">
                    See the latest posts from fellow alumni. Connect, engage,
                    and stay updated.
                  </p>
                  <PostFeed />
                </div>
              </div>
            </>
          )}

          {/* NETWORK SECTION */}
          {activeSidebarTab === "network" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Alumni Network
              </h2>
              <p className="text-gray-600 mb-6">
                Connect with fellow alumni from your college. Search for alumni
                by name, batch, branch, or company.
              </p>
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search alumni..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="bg-gray-50 p-8 rounded-md text-center">
                <p className="text-gray-500">Alumni directory coming soon.</p>
                <p className="text-gray-500 mt-2">
                  Check back later for updates!
                </p>
              </div>
            </div>
          )}

          {/* EVENTS SECTION */}
          {activeSidebarTab === "events" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Upcoming Events
              </h2>
              <p className="text-gray-600 mb-6">
                Stay connected with your alma mater through various alumni
                events and gatherings.
              </p>

              {eventsLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                </div>
              ) : eventsError ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                  {eventsError}
                </div>
              ) : events.length === 0 ? (
                <div className="bg-gray-50 p-8 rounded-md text-center">
                  <p className="text-gray-500">
                    No upcoming events at the moment.
                  </p>
                  <p className="text-gray-500 mt-2">
                    Check back later for new events!
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {events.map((event) => (
                    <div
                      key={event._id}
                      className="border rounded-lg overflow-hidden bg-white shadow-sm"
                    >
                      <div className="flex flex-col md:flex-row">
                        {event.image && (
                          <div className="md:w-1/3 h-48 relative">
                            <Image
                              src={event.image}
                              alt={event.title}
                              layout="fill"
                              objectFit="cover"
                            />
                          </div>
                        )}
                        <div
                          className={`p-6 ${
                            event.image ? "md:w-2/3" : "w-full"
                          }`}
                        >
                          <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            {event.title}
                          </h3>
                          <div className="flex items-center text-gray-600 mb-2">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>
                              {format(
                                new Date(event.date),
                                "MMMM dd, yyyy - h:mm a"
                              )}
                            </span>
                          </div>
                          <div className="text-gray-600 mb-4">
                            <strong>Location:</strong> {event.location}
                          </div>
                          <p className="text-gray-700">{event.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Past Events
                </h3>
                <div className="bg-gray-50 p-8 rounded-md text-center">
                  <p className="text-gray-500">No past events to display.</p>
                </div>
              </div>
            </div>
          )}

          {/* MY STORIES SECTION */}
          {activeSidebarTab === "myStories" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                My Stories
              </h2>
              <p className="text-gray-600 mb-6">
                View, manage, and track the status of your submitted stories.
              </p>

              {/* Story Stats */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  Approval Status
                </h3>
                <div className="flex space-x-4 mb-6">
                  <div className="flex-1 bg-gray-50 p-4 rounded-md text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {pendingStories}
                    </div>
                    <div className="text-gray-500 text-sm">Pending</div>
                  </div>
                  <div className="flex-1 bg-gray-50 p-4 rounded-md text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {publishedStories}
                    </div>
                    <div className="text-gray-500 text-sm">Published</div>
                  </div>
                  <div className="flex-1 bg-gray-50 p-4 rounded-md text-center">
                    <div className="text-2xl font-bold text-gray-600">
                      {totalStories}
                    </div>
                    <div className="text-gray-500 text-sm">Total</div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Your Submitted Stories
                  </h3>
                  <Button
                    className="bg-orange-600 hover:bg-orange-700"
                    onClick={() => setIsStoryDialogOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Submit New Story
                  </Button>
                </div>

                {storiesLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                  </div>
                ) : storiesError ? (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                    {storiesError}
                  </div>
                ) : myStories.length === 0 ? (
                  <div className="bg-gray-50 p-8 rounded-md text-center">
                    <p className="text-gray-500">
                      You haven&apos;t submitted any stories yet.
                    </p>
                    <p className="text-gray-500 mt-2">
                      Share your journey and inspire others!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myStories.map((story) => (
                      <div
                        key={story._id}
                        className="border rounded-lg overflow-hidden bg-white shadow-sm p-4"
                      >
                        <div className="flex justify-between">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {story.title}
                          </h3>
                          <div
                            className={`px-2 py-1 text-xs rounded-full ${
                              story.isPublished
                                ? "bg-green-100 text-green-800"
                                : "bg-orange-100 text-orange-800"
                            }`}
                          >
                            {story.isPublished ? "Published" : "Pending Review"}
                          </div>
                        </div>
                        <p className="text-gray-600 mt-2 line-clamp-2">
                          {story.content}
                        </p>
                        <div className="mt-2 text-sm text-gray-500">
                          Submitted on{" "}
                          {format(new Date(story.createdAt), "MMMM dd, yyyy")}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MENTORSHIP SECTION */}
          {activeSidebarTab === "mentorship" && <MentorSection />}
        </div>
      </main>

      {/* Create Post Dialog */}
      {isPostDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Create New Post
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsPostDialogOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Share your thoughts, updates, or questions with the alumni
                community.
              </p>
              <PostForm />
            </div>
          </div>
        </div>
      )}

      {/* Submit Story Dialog */}
      {isStoryDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Share Your Story
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsStoryDialogOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Share your journey, experiences, and achievements with fellow
                alumni. Your story can inspire others!
              </p>
              <StorySubmission />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
