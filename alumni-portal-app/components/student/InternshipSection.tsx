"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Briefcase, Calendar, MapPin, DollarSign, Clock, ExternalLink, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllInternships } from "@/lib/db/actions/internship.actions";

interface Internship {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  duration: string;
  stipend: string;
  description: string;
  deadline: string;
  createdAt: string;
}

export default function InternshipSection() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Fetch active internships (only those with deadlines in the future)
  const fetchInternships = async () => {
    try {
      setLoading(true);
      const data = await getAllInternships(true); // true = only active internships
      setInternships(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching internships:", err);
      setError("Failed to load internships. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  // Filter internships by type if a filter is selected
  const filteredInternships = selectedType 
    ? internships.filter(internship => internship.type === selectedType)
    : internships;

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

  if (internships.length === 0) {
    return (
      <div className="bg-gray-50 p-8 rounded-md text-center">
        <p className="text-gray-500">No internship opportunities are available at the moment.</p>
        <p className="text-gray-500 mt-2">Please check back later for new opportunities.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 mb-6">
        <Button 
          variant={selectedType === null ? "default" : "outline"}
          onClick={() => setSelectedType(null)}
          className="text-sm"
        >
          All
        </Button>
        <Button 
          variant={selectedType === "Full-time" ? "default" : "outline"}
          onClick={() => setSelectedType("Full-time")}
          className="text-sm"
        >
          Full-time
        </Button>
        <Button 
          variant={selectedType === "Part-time" ? "default" : "outline"}
          onClick={() => setSelectedType("Part-time")}
          className="text-sm"
        >
          Part-time
        </Button>
        <Button 
          variant={selectedType === "Remote" ? "default" : "outline"}
          onClick={() => setSelectedType("Remote")}
          className="text-sm"
        >
          Remote
        </Button>
        <Button 
          variant={selectedType === "Hybrid" ? "default" : "outline"}
          onClick={() => setSelectedType("Hybrid")}
          className="text-sm"
        >
          Hybrid
        </Button>
      </div>

      {filteredInternships.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-md text-center">
          <p className="text-gray-500">No internships found with the selected filter.</p>
          <p className="text-gray-500 mt-2">Try selecting a different category or viewing all internships.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredInternships.map((internship) => (
            <div key={internship._id} className="border rounded-lg overflow-hidden bg-white shadow-sm">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{internship.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    internship.type === 'Full-time' ? 'bg-green-100 text-green-800' :
                    internship.type === 'Part-time' ? 'bg-blue-100 text-blue-800' :
                    internship.type === 'Remote' ? 'bg-orange-100 text-orange-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {internship.type}
                  </span>
                </div>
                
                <div className="flex items-center text-gray-600 mb-2">
                  <Briefcase className="h-4 w-4 mr-2" />
                  <span className="font-medium">{internship.company}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{internship.location}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{internship.duration}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <IndianRupee className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{internship.stipend}</span>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600 mb-4">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span><strong>Apply by:</strong> {format(new Date(internship.deadline), 'MMMM dd, yyyy')}</span>
                </div>
                
                <p className="text-gray-700 whitespace-pre-line mb-6">{internship.description}</p>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Posted on {format(new Date(internship.createdAt), 'MMMM dd, yyyy')}
                  </div>
                  
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Apply Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 