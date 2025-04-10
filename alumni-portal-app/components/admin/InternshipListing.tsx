"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Briefcase, Calendar, MapPin, Clock, Trash2, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllInternships, deleteInternship } from "@/lib/db/actions/internship.actions";
import { toast } from "sonner";

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

export default function InternshipListing({ onInternshipDeleted, updateTrigger }: { 
  onInternshipDeleted?: () => void,
  updateTrigger?: number
}) {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  // Fetch internships
  const fetchInternships = async () => {
    try {
      setLoading(true);
      const data = await getAllInternships();
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
  }, [updateTrigger]); // Re-fetch when updateTrigger changes

  // Handle internship deletion
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this internship?")) {
      return;
    }

    try {
      setDeleteLoading(id);
      await deleteInternship(id);
      
      // Update the internships list
      setInternships(internships.filter(internship => internship._id !== id));
      
      toast.success("Internship deleted successfully");
      
      if (onInternshipDeleted) {
        onInternshipDeleted();
      }
    } catch (error) {
      console.error("Error deleting internship:", error);
      toast.error("Failed to delete internship");
    } finally {
      setDeleteLoading(null);
    }
  };

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
        <p className="text-gray-500">No internships have been posted yet.</p>
        <p className="text-gray-500 mt-2">Add your first internship listing using the form above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {internships.map((internship) => (
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
            
            <p className="text-gray-700 whitespace-pre-line mb-4">{internship.description}</p>
            
            <div className="text-sm text-gray-500">
              Posted on {format(new Date(internship.createdAt), 'MMMM dd, yyyy')}
            </div>
          </div>
          
          <div className="bg-gray-50 px-6 py-3 flex justify-end">
            <Button 
              variant="destructive"
              onClick={() => handleDelete(internship._id)}
              disabled={deleteLoading === internship._id}
              className="flex items-center"
            >
              {deleteLoading === internship._id ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              {deleteLoading === internship._id ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
} 