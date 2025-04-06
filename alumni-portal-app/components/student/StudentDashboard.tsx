"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useClerk } from "@clerk/nextjs";
import {
  FileText,
  Users,
  Calendar,
  Plus,
  X,
  GraduationCap,
  Briefcase,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllEvents } from "@/lib/db/actions/event.actions";
import { format } from "date-fns";
import PostForm from "./PostForm";
import PostFeed from "./PostFeed";
import MentorshipSection from "@/components/student/MentorshipSection";
import CareerSection from "./CareerSection";
import { getAllInternships } from "@/lib/db/actions/internship.actions";

type SidebarTabType = "feed" | "network" | "events" | "career" | "mentorship";

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

interface Internship {
  _id: string;
  title: string;
  company: string;
  type: string;
  deadline: string;
  description?: string;
  requirements?: string[];
  isActive: boolean;
  createdAt?: string;
}

export default function StudentDashboard() {
  const [activeSidebarTab, setActiveSidebarTab] =
    useState<SidebarTabType>("feed");
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const { signOut } = useClerk();

  // Events data state
  const [events, setEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState<string | null>(null);

  // Internships data state
  const [internships, setInternships] = useState<Internship[]>([]);
  const [internshipsLoading, setInternshipsLoading] = useState(true);
  const [internshipsError, setInternshipsError] = useState<string | null>(null);

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

  // Fetch internships for preview
  useEffect(() => {
    const fetchInternships = async () => {
      if (activeSidebarTab !== "feed") return;

      try {
        setInternshipsLoading(true);
        const data = await getAllInternships(true); // Only get active internships
        setInternships(data.slice(0, 2)); // Only show 2 most recent
      } catch (error) {
        console.error("Error fetching internships:", error);
        setInternshipsError("Failed to load internships.");
      } finally {
        setInternshipsLoading(false);
      }
    };

    fetchInternships();
  }, [activeSidebarTab]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Sidebar - moved above header */}
      <aside className="w-64 bg-black/80 text-white shadow-md fixed top-0 left-0 h-screen z-20 overflow-y-auto flex flex-col">
        {/* College Logo & Name */}
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-2xl font-bold mb-10">Student Dashboard</h1>
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
                  activeSidebarTab === "career"
                    ? "bg-orange-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
                onClick={() => setActiveSidebarTab("career")}
              >
                <Briefcase className="h-5 w-5" />
                <span>Career</span>
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
      <div className="flex flex-1">
        <main className="flex-1 p-6 overflow-auto ml-64">
          <div className="max-w-4xl mx-auto">
            {/* FEED SECTION */}
            {activeSidebarTab === "feed" && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Student Feed
                    </h2>
                    <Button
                      className="bg-orange-600 hover:bg-orange-700"
                      onClick={() => setIsPostDialogOpen(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Post
                    </Button>
                  </div>

                  <div className="p-6">
                    <p className="text-gray-600 mb-4">
                      Connect with your peers and stay updated with campus
                      activities.
                    </p>
                    <PostFeed />
                  </div>
                </div>

                {/* Internship Quick View */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Latest Internship Opportunities
                    </h2>
                    <Button
                      variant="outline"
                      className="text-orange-600 border-orange-600 hover:bg-orange-50"
                      onClick={() => setActiveSidebarTab("career")}
                    >
                      View All
                    </Button>
                  </div>

                  <div className="p-6">
                    {internshipsLoading ? (
                      <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                      </div>
                    ) : internshipsError ? (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                        {internshipsError}
                      </div>
                    ) : internships.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                        No internship opportunities available at the moment.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {internships.map((internship) => (
                          <div
                            key={internship._id}
                            className="border rounded-lg p-4"
                          >
                            <div className="flex justify-between items-start">
                              <h3 className="text-lg font-semibold text-gray-800">
                                {internship.title}
                              </h3>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  internship.type === "Full-time"
                                    ? "bg-green-100 text-green-800"
                                    : internship.type === "Part-time"
                                    ? "bg-blue-100 text-blue-800"
                                    : internship.type === "Remote"
                                    ? "bg-orange-100 text-orange-800"
                                    : "bg-purple-100 text-purple-800"
                                }`}
                              >
                                {internship.type}
                              </span>
                            </div>

                            <div className="flex items-center text-gray-600 mt-1 mb-2">
                              <Briefcase className="h-4 w-4 mr-2" />
                              <span>{internship.company}</span>
                            </div>

                            <div className="flex items-center text-gray-600 mb-2 text-sm">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span>
                                Apply by:{" "}
                                {format(
                                  new Date(internship.deadline),
                                  "MMMM dd, yyyy"
                                )}
                              </span>
                            </div>

                            <div className="mt-2 flex justify-end">
                              <Button
                                size="sm"
                                className="bg-orange-600 hover:bg-orange-700"
                                onClick={() => setActiveSidebarTab("career")}
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Details
                              </Button>
                            </div>
                          </div>
                        ))}

                        <div className="text-center mt-4">
                          <Button
                            variant="link"
                            className="text-orange-600"
                            onClick={() => setActiveSidebarTab("career")}
                          >
                            See all available internships
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* NETWORK SECTION */}
            {activeSidebarTab === "network" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                  Student Network
                </h2>
                <p className="text-gray-600 mb-6">
                  Connect with your classmates, seniors, and alumni. Build your
                  professional network early.
                </p>
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Search students or alumni..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="bg-gray-50 p-8 rounded-md text-center">
                  <p className="text-gray-500">
                    Student network features coming soon.
                  </p>
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
                  Campus Events
                </h2>
                <p className="text-gray-600 mb-6">
                  Stay updated with upcoming campus events, workshops, and
                  activities.
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
              </div>
            )}

            {/* CAREER SECTION */}
            {activeSidebarTab === "career" && <CareerSection />}

            {/* MENTORSHIP SECTION */}
            {activeSidebarTab === "mentorship" && <MentorshipSection />}
          </div>
        </main>
      </div>

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
                Share your thoughts, questions, or updates with your peers.
              </p>
              <PostForm />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
