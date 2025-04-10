"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  User,
  GraduationCap,
  Briefcase,
  ExternalLink,
  Filter,
  XCircle,
  Mail
} from "lucide-react";
import { getAllMentors } from "@/lib/db/actions/mentor.actions";
import { toast } from "sonner";

interface Mentor {
  _id: string;
  name: string;
  specializations: string[];
  experience: string;
  bio: string;
  graduated: string;
  branch: string;
  company?: string;
  role?: string;
  linkedin?: string;
  email?: string;
  createdAt: string;
  // Additional mentorship attributes
  availability?: string[];
  mentorshipFormats?: string[];
  mentorshipTopics?: string[];
  maxMentees?: number;
  status: string;
}

export default function MentorshipSection() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [filteredMentors, setFilteredMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState<
    string | null
  >(null);

  // Get all unique specializations from mentors
  const allSpecializations = Array.from(
    new Set(mentors.flatMap((mentor) => mentor.specializations))
  ).sort();

  // Fetch mentors
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        const data = await getAllMentors(true); // Only get approved mentors
        setMentors(data);
        setFilteredMentors(data);
      } catch (err) {
        console.error("Error fetching mentors:", err);
        setError("Failed to load mentors. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  // Filter mentors based on search and specialization
  useEffect(() => {
    let result = mentors;

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (mentor) =>
          mentor.name.toLowerCase().includes(term) ||
          mentor.bio.toLowerCase().includes(term) ||
          mentor.specializations.some((spec) =>
            spec.toLowerCase().includes(term)
          ) ||
          (mentor.company && mentor.company.toLowerCase().includes(term)) ||
          (mentor.role && mentor.role.toLowerCase().includes(term))
      );
    }

    // Filter by specialization
    if (selectedSpecialization) {
      result = result.filter((mentor) =>
        mentor.specializations.includes(selectedSpecialization)
      );
    }

    setFilteredMentors(result);
  }, [searchTerm, selectedSpecialization, mentors]);

  // Add new function to handle email click
  const handleEmailMentor = (mentor: Mentor) => {
    if (!mentor.email) {
      toast.error("Mentor email is not available");
      return;
    }
    
    const subject = "Mentorship Request from MMCOE Student";
    const body = "Hello " + mentor.name + ",\n\nI am a student from MMCOE and I would like to connect with you for mentorship.\n\n";
    
    window.open(`mailto:${mentor.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
    toast.success(`Email client opened for ${mentor.name}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Connect with Mentors
      </h2>
      <p className="text-gray-600 mb-6">
        Find and connect with alumni mentors who can provide guidance on career
        paths, industry insights, and professional development.
      </p>

      {/* Search and filter */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search mentors..."
              className="pl-10 pr-4 py-2 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative w-full md:w-auto md:min-w-[180px]">
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
              value={selectedSpecialization || ""}
              onChange={(e) =>
                setSelectedSpecialization(e.target.value || null)
              }
            >
              <option value="">All Specializations</option>
              {allSpecializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>
        </div>

        {/* Selected filters display */}
        {selectedSpecialization && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Filtered by:</span>
            <Badge
              className="bg-orange-100 text-orange-800 hover:bg-orange-200 px-2 py-1 flex items-center gap-1"
              onClick={() => setSelectedSpecialization(null)}
            >
              {selectedSpecialization}
              <XCircle className="h-3 w-3 ml-1 cursor-pointer" />
            </Badge>
          </div>
        )}
      </div>

      {/* Mentors list */}
      {filteredMentors.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-md text-center">
          <p className="text-gray-500">
            No mentors match your search criteria.
          </p>
          <p className="text-gray-500 mt-2">
            Try adjusting your filters or search term.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredMentors.map((mentor) => (
            <div
              key={mentor._id}
              className="border rounded-lg overflow-hidden bg-white shadow-sm"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Avatar and basic info */}
                  <div className="md:w-1/3 space-y-4">
                    <div className="flex flex-col items-center">
                      <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 mb-2">
                        <User className="h-12 w-12" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 text-center">
                        {mentor.name}
                      </h3>
                      {mentor.role && mentor.company && (
                        <p className="text-gray-600 text-center">
                          {mentor.role} at {mentor.company}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-start">
                        <GraduationCap className="h-4 w-4 mr-2 text-gray-500 mt-1" />
                        <div>
                          <p className="text-sm text-gray-600">
                            {mentor.branch}
                          </p>
                          <p className="text-sm text-gray-600">
                            Class of {mentor.graduated}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
                        <p className="text-sm text-gray-600">
                          {mentor.experience}
                        </p>
                      </div>

                      {mentor.email && (
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-gray-500" />
                          <a 
                            href={`mailto:${mentor.email}`}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            {mentor.email}
                          </a>
                        </div>
                      )}

                      {mentor.linkedin && (
                        <div>
                          <a
                            href={mentor.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            LinkedIn Profile
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bio and specializations */}
                  <div className="md:w-2/3 space-y-4">
                    <div>
                      <h4 className="text-md font-medium text-gray-700 mb-2">
                        About
                      </h4>
                      <p className="text-gray-600">{mentor.bio}</p>
                    </div>

                    <div>
                      <h4 className="text-md font-medium text-gray-700 mb-2">
                        Specializations
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {mentor.specializations.map((specialization) => (
                          <Badge
                            key={specialization}
                            variant="outline"
                            className="bg-gray-50"
                            onClick={() =>
                              setSelectedSpecialization(specialization)
                            }
                          >
                            {specialization}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Mentorship details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {/* Availability */}
                      {mentor.availability && mentor.availability.length > 0 && (
                        <div>
                          <h4 className="text-md font-medium text-gray-700 mb-2">
                            Availability
                          </h4>
                          <ul className="list-disc list-inside text-sm text-gray-600">
                            {mentor.availability.map((time) => (
                              <li key={time}>{time}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Mentorship Formats */}
                      {mentor.mentorshipFormats && mentor.mentorshipFormats.length > 0 && (
                        <div>
                          <h4 className="text-md font-medium text-gray-700 mb-2">
                            Mentorship Formats
                          </h4>
                          <ul className="list-disc list-inside text-sm text-gray-600">
                            {mentor.mentorshipFormats.map((format) => (
                              <li key={format}>{format}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    {/* Mentorship Topics */}
                    {mentor.mentorshipTopics && mentor.mentorshipTopics.length > 0 && (
                      <div>
                        <h4 className="text-md font-medium text-gray-700 mb-2">
                          Mentorship Topics
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {mentor.mentorshipTopics.map((topic) => (
                            <Badge
                              key={topic}
                              variant="secondary"
                              className="bg-blue-50 text-blue-700"
                            >
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Max Mentees */}
                    {mentor.maxMentees && (
                      <div className="mt-2">
                        <span className="text-sm text-gray-600">
                          <strong>Currently accepting:</strong> Up to {mentor.maxMentees} mentees
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Replace contact form or button section */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex justify-end">
                    <Button
                      className="bg-orange-600 hover:bg-orange-700"
                      onClick={() => handleEmailMentor(mentor)}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email Mentor
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
