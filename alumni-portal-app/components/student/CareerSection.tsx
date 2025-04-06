"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink, Download } from "lucide-react";
import InternshipSection from "./InternshipSection";

// Mock data for resources
const MOCK_RESOURCES = [
  {
    id: "1",
    title: "Resume Template for Tech Students",
    type: "template",
    format: "DOCX",
    description: "Professional resume template tailored for engineering students."
  },
  {
    id: "2",
    title: "Technical Interview Preparation Guide",
    type: "guide",
    format: "PDF",
    description: "Comprehensive guide covering all aspects of technical interviews."
  },
  {
    id: "3",
    title: "LinkedIn Profile Optimization Tips",
    type: "guide",
    format: "PDF",
    description: "Learn how to optimize your LinkedIn profile to attract recruiters."
  },
  {
    id: "4",
    title: "Mock Technical Interview Questions",
    type: "practice",
    format: "PDF",
    description: "Collection of common technical interview questions with solutions."
  }
];

export default function CareerSection() {
  const [activeTab, setActiveTab] = useState<"internships" | "resources">("internships");

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Career Development</h2>
      <p className="text-gray-600 mb-6">
        Explore internship opportunities and access career development resources to jumpstart your professional journey.
      </p>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "internships"
              ? "border-b-2 border-orange-500 text-orange-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("internships")}
        >
          Internship Opportunities
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "resources"
              ? "border-b-2 border-orange-500 text-orange-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("resources")}
        >
          Career Resources
        </button>
      </div>

      {/* Internships Tab */}
      {activeTab === "internships" && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Available Internships</h3>
          <InternshipSection />
        </div>
      )}

      {/* Resources Tab */}
      {activeTab === "resources" && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_RESOURCES.length === 0 ? (
              <div className="col-span-2 bg-gray-50 p-8 rounded-md text-center">
                <p className="text-gray-500">No resources available at the moment.</p>
                <p className="text-gray-500 mt-2">Check back later for career resources!</p>
              </div>
            ) : (
              MOCK_RESOURCES.map((resource) => (
                <div key={resource.id} className="border rounded-lg overflow-hidden shadow-sm flex">
                  <div className="w-16 flex-shrink-0 bg-gray-100 flex items-center justify-center">
                    <FileText className="h-8 w-8 text-gray-500" />
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex justify-between items-start">
                      <h3 className="text-base font-semibold text-gray-800">{resource.title}</h3>
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {resource.format}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 mb-3 flex-1">{resource.description}</p>
                    <div className="flex justify-end mt-auto">
                      <Button variant="outline" size="sm" className="text-gray-700 flex items-center">
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Resources</h3>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="text-base font-medium text-gray-800 mb-3">Useful Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-orange-600 hover:text-orange-700 flex items-center">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    <span>College Placement Cell Portal</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-orange-600 hover:text-orange-700 flex items-center">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    <span>Industry Connect Program</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-orange-600 hover:text-orange-700 flex items-center">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    <span>Skill Development Workshops</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 