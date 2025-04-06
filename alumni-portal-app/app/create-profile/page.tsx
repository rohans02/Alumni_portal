"use client";

import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { saveProfileData } from "@/lib/profile";
import { Roles } from "@/types/globals";

interface FormData {
  role: Roles | "";
  name: string;
  branch: string;
  yearOfPassout: string;
  mobileNumber: string;
}

export default function CreateProfilePage() {
  const [formData, setFormData] = useState<FormData>({
    role: "",
    name: "",
    branch: "",
    yearOfPassout: "",
    mobileNumber: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.role) {
      setError("Please select a role");
      return;
    }
    
    try {
      setIsLoading(true);
      setError("");
      
      // Save profile data to Clerk
      console.log(`Saving profile data with role: ${formData.role}`);
      
      const result = await saveProfileData({
        ...formData,
        role: formData.role as Roles
      });
      
      console.log("Profile save result:", result);
      
      if (result.success) {
        // Success message
        setIsLoading(false);
        
        // Redirect to dashboard
        window.location.href = "/dashboard";
      } else {
        setError("Failed to create profile. Please try again.");
        setIsLoading(false);
      }
      
    } catch (error) {
      console.error("Error creating profile:", error);
      setError("Failed to create profile. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-4 right-4">
        <UserButton />
      </div>
      
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Complete Your Profile</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        {isLoading && (
          <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-md">
            Creating your profile and setting up your account...
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="role"
                  value="student"
                  onChange={handleChange}
                  checked={formData.role === "student"}
                />
                <span className="ml-2">Student</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="role"
                  value="alumni"
                  onChange={handleChange}
                  checked={formData.role === "alumni"}
                />
                <span className="ml-2">Alumni</span>
              </label>
            </div>
          </div>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-1">
              Branch
            </label>
            <select
              id="branch"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Branch</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics">Electronics</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="yearOfPassout" className="block text-sm font-medium text-gray-700 mb-1">
              Year of Passing Out
            </label>
            <select
              id="yearOfPassout"
              name="yearOfPassout"
              value={formData.yearOfPassout}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Year</option>
              {Array.from({ length: 10 }, (_, i) => {
                const year = new Date().getFullYear() - 5 + i;
                return (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
          
          <div>
            <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number
            </label>
            <input
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              maxLength={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="10-digit mobile number"
            />
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? "Processing..." : "Create Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 