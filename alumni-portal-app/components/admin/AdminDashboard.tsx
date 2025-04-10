"use client";

import { useState, useEffect } from "react";
import {
  Users,
  BarChart,
  FileText,
  Calendar,
  Award,
  Search,
  ChevronDown,
  MessageSquare,
  LogOut,
} from "lucide-react";
import { getAllUsers, getAnalyticsData, UserData } from "@/lib/users";
import UserEditModal from "./UserEditModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import Image from "next/image";
import EventManagement from "./EventManagement";
import StoryManagement from "./StoryManagement";
import InternshipForm from "./InternshipForm";
import InternshipListing from "./InternshipListing";
import MentorApplicationsManager from "./MentorApplicationsManager";
import AdminPostFeed from "./AdminPostFeed";
import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/nextjs";

// Tabs definition
type TabType = "users" | "analytics" | "content" | "internships" | "mentors" | "posts";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const { signOut } = useClerk();

  // State for storing real data
  const [users, setUsers] = useState<UserData[]>([]);
  const [analyticsData, setAnalyticsData] = useState<{
    usersByRole: Record<string, number>;
    usersByBranch: Record<string, number>;
    activeUsers: { lastWeek: number; lastMonth: number };
    totalUsers: number;
  }>({
    usersByRole: {},
    usersByBranch: {},
    activeUsers: { lastWeek: 0, lastMonth: 0 },
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  // New state for triggering updates
  const [updateTrigger, setUpdateTrigger] = useState(0);

  // Fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch users
      const usersData = await getAllUsers();
      setUsers(usersData);

      // Fetch analytics data
      const analytics = await getAnalyticsData();
      setAnalyticsData(analytics);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Toggle role dropdown
  const toggleRoleDropdown = () => {
    setIsRoleDropdownOpen(!isRoleDropdownOpen);
  };

  // Select role and close dropdown
  const handleRoleSelect = (role: string | null) => {
    setSelectedRole(role);
    setIsRoleDropdownOpen(false);
  };

  // Filter users based on search and role filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = selectedRole ? user.role === selectedRole : true;

    return matchesSearch && matchesRole;
  });

  // Handle edit user button click
  const handleEditUser = (user: UserData) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  // Handle delete user button click
  const handleDeleteUser = (user: UserData) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  // Refresh data after an update
  const handleUserUpdated = () => {
    fetchData();
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black/80">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black/80">
        <div className="text-center text-red-600">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Sidebar - fixed, positioned at the top of the DOM */}
      <aside className="w-64 bg-black/80 text-white shadow-md fixed top-0 left-0 h-screen z-20 overflow-y-auto flex flex-col">
        {/* College Logo & Name */}
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-2xl font-bold mb-10">Admin Dashboard</h1>
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

        <nav className="py-4">
          <ul className="space-y-1 px-2">
            <li>
              <button
                onClick={() => setActiveTab("users")}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-md ${
                  activeTab === "users"
                    ? "bg-orange-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <Users className="h-5 w-5" />
                <span>User Management</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("posts")}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-md ${
                  activeTab === "posts"
                    ? "bg-orange-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <MessageSquare className="h-5 w-5" />
                <span>Posts</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-md ${
                  activeTab === "analytics"
                    ? "bg-orange-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <BarChart className="h-5 w-5" />
                <span>Analytics</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("content")}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-md ${
                  activeTab === "content"
                    ? "bg-orange-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <FileText className="h-5 w-5" />
                <span>Content Management</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("internships")}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-md ${
                  activeTab === "internships"
                    ? "bg-orange-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <Calendar className="h-5 w-5" />
                <span>Internships</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("mentors")}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-md ${
                  activeTab === "mentors"
                    ? "bg-orange-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <Award className="h-5 w-5" />
                <span>Mentors</span>
              </button>
            </li>
          </ul>
        </nav>

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

      {/* Main content - adjusted with left margin to accommodate fixed sidebar */}
      <main className="flex-1 p-6 ml-64">
        <div className="max-w-6xl mx-auto">
          {/* User Management Tab */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  User Management
                </h2>
              </div>

              {/* Search and filter */}
              <div className="flex flex-wrap gap-4 items-center">
                <div className="relative flex-grow max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <button
                    className="flex items-center space-x-2 bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    onClick={toggleRoleDropdown}
                  >
                    <span>Role: {selectedRole || "All"}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  {isRoleDropdownOpen && (
                    <div className="absolute top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => handleRoleSelect(null)}
                      >
                        All
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => handleRoleSelect("student")}
                      >
                        Student
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => handleRoleSelect("alumni")}
                      >
                        Alumni
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => handleRoleSelect("admin")}
                      >
                        Admin
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Users table */}
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      {/* Only show Branch column if we're not filtering by admin */}
                      {selectedRole !== "admin" && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Branch
                        </th>
                      )}
                      {/* Only show Year column if we're not filtering by admin */}
                      {selectedRole !== "admin" && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Year
                        </th>
                      )}
                      {/* Only show Actions column if we're not filtering by admin */}
                      {selectedRole !== "admin" && (
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                <Users className="h-5 w-5" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.role === "admin"
                                  ? "bg-orange-100 text-orange-800"
                                  : user.role === "student"
                                  ? "bg-green-100 text-green-800"
                                  : user.role === "alumni"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {user.role || "unassigned"}
                            </span>
                          </td>
                          {/* Only display Branch if the user is not an admin or we're not filtering by admin */}
                          {user.role !== "admin" &&
                            selectedRole !== "admin" && (
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {user.branch || "N/A"}
                              </td>
                            )}
                          {/* Only display Year if the user is not an admin or we're not filtering by admin */}
                          {user.role !== "admin" &&
                            selectedRole !== "admin" && (
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {user.year || "N/A"}
                              </td>
                            )}
                          {/* Only display Actions if the user is not an admin or we're not filtering by admin */}
                          {user.role !== "admin" &&
                            selectedRole !== "admin" && (
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  className="text-orange-600 hover:text-orange-900 mr-3"
                                  onClick={() => handleEditUser(user)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="text-orange-600 hover:text-orange-900"
                                  onClick={() => handleDeleteUser(user)}
                                >
                                  Delete
                                </button>
                              </td>
                            )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={selectedRole === "admin" ? 3 : 6}
                          className="px-6 py-4 text-center text-sm text-gray-500"
                        >
                          {searchTerm || selectedRole
                            ? "No users match your search criteria"
                            : "No users found"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Posts Tab */}
          {activeTab === "posts" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  Community Posts Management
                </h2>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <AdminPostFeed />
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Analytics</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Users by Role */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Users by Role
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(analyticsData.usersByRole).map(
                      ([role, count]: [string, number]) => (
                        <div
                          key={role}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <div
                              className={`h-4 w-4 rounded-full mr-2 ${
                                role === "admin"
                                  ? "bg-orange-500"
                                  : role === "student"
                                  ? "bg-green-500"
                                  : role === "alumni"
                                  ? "bg-orange-500"
                                  : "bg-gray-500"
                              }`}
                            ></div>
                            <span className="text-sm text-gray-600 capitalize">
                              {role}
                            </span>
                          </div>
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                      )
                    )}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">
                        Total Users
                      </span>
                      <span className="text-sm font-bold">
                        {analyticsData.totalUsers}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Active Users */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Active Users
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Last 7 days</span>
                      <span className="text-sm font-medium">
                        {analyticsData.activeUsers.lastWeek}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Last 30 days
                      </span>
                      <span className="text-sm font-medium">
                        {analyticsData.activeUsers.lastMonth}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Users by Branch */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Users by Branch
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(analyticsData.usersByBranch).map(
                      ([branch, count]: [string, number]) => (
                        <div key={branch} className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              {branch}
                            </span>
                            <span className="text-sm font-medium">{count}</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-orange-500 rounded-full"
                              style={{
                                width: `${
                                  (count / analyticsData.totalUsers) * 100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Internships Tab */}
          {activeTab === "internships" && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  Internship Management
                </h2>
              </div>

              <div className="space-y-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    Post New Internship
                  </h3>
                  <InternshipForm
                    onSubmitSuccess={() => {
                      // Force refresh of the internship listing
                      setUpdateTrigger((prev) => prev + 1);
                    }}
                  />
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    Internship Listings
                  </h3>
                  <InternshipListing
                    onInternshipDeleted={() => {
                      // Force refresh of the internship listing
                      setUpdateTrigger((prev) => prev + 1);
                    }}
                    updateTrigger={updateTrigger}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Mentors Tab */}
          {activeTab === "mentors" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Mentor Program Management
              </h2>
              <MentorApplicationsManager />
            </div>
          )}

          {/* Content Management Tab */}
          {activeTab === "content" && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  Content Management
                </h2>
              </div>

              <div className="space-y-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    Events
                  </h3>
                  <EventManagement />
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    Alumni Stories
                  </h3>
                  <StoryManagement />
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    Internship Opportunities
                  </h3>
                  <div className="bg-gray-50 p-6 rounded-md">
                    <p className="text-gray-700 mb-4">
                      Manage internship opportunities for students from the
                      dedicated Internships tab.
                    </p>
                    <Button
                      className="bg-orange-600 hover:bg-orange-700"
                      onClick={() => setActiveTab("internships")}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Go to Internships
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {showEditModal && selectedUser && (
        <UserEditModal
          user={selectedUser}
          onClose={() => setShowEditModal(false)}
          onUserUpdated={handleUserUpdated}
        />
      )}

      {showDeleteModal && selectedUser && (
        <DeleteConfirmationModal
          userId={selectedUser.id}
          userName={selectedUser.name}
          onClose={() => setShowDeleteModal(false)}
          onUserDeleted={handleUserUpdated}
        />
      )}
    </div>
  );
}
