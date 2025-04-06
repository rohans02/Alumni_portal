"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  User, 
  GraduationCap, 
  Briefcase, 
  Calendar, 
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Trash2,
  Clock,
  Users,
  MessageSquare,
  Tag
} from "lucide-react";
import { getAllMentors, updateMentorStatus, deleteMentor } from "@/lib/db/actions/mentor.actions";
import ConfirmationDialog from "@/components/ui/confirmation-dialog";

interface MentorApplication {
  _id: string;
  name: string;
  email: string;
  specializations: string[];
  experience: string;
  bio: string;
  graduated: string;
  branch: string;
  company?: string;
  role?: string;
  linkedin?: string;
  availability?: string[];
  mentorshipFormats?: string[];
  mentorshipTopics?: string[];
  maxMentees?: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export default function MentorApplicationsManager() {
  const [applications, setApplications] = useState<MentorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedApplication, setExpandedApplication] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [mentorToDelete, setMentorToDelete] = useState<MentorApplication | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const data = await getAllMentors(false);
        setApplications(data);
      } catch (err) {
        console.error("Error fetching mentor applications:", err);
        setError("Failed to load mentor applications. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const filteredApplications = applications.filter(app => {
    const matchesStatus = filter === 'all' || app.status === filter;
    const matchesSearch = !searchTerm || (
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.specializations.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (app.company && app.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (app.role && app.role.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (app.mentorshipTopics && app.mentorshipTopics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase())))
    );
    return matchesStatus && matchesSearch;
  });

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    setProcessingId(id);
    try {
      const result = await updateMentorStatus(id, status);
      if (result.success) {
        setApplications(current => 
          current.map(app => 
            app._id === id ? { ...app, status } : app
          )
        );
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error updating mentor status:", error);
      toast.error("Failed to update mentor status. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteConfirm = (mentor: MentorApplication) => {
    setMentorToDelete(mentor);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteMentor = async () => {
    if (!mentorToDelete) return;
    setProcessingId(mentorToDelete._id);
    try {
      const result = await deleteMentor(mentorToDelete._id, mentorToDelete.email, true);
      if (result.success) {
        setApplications(current => 
          current.filter(app => app._id !== mentorToDelete._id)
        );
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error deleting mentor:", error);
      toast.error("Failed to delete mentor application. Please try again.");
    } finally {
      setProcessingId(null);
      setShowDeleteConfirmation(false);
    }
  };

  const toggleDetails = (id: string) => {
    setExpandedApplication(current => current === id ? null : id);
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

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Mentor Applications</h2>
        
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={filter === 'all' ? "default" : "outline"}
              onClick={() => setFilter('all')}
              className={filter === 'all' ? "bg-orange-600 hover:bg-orange-700" : ""}
            >
              All
            </Button>
            <Button 
              variant={filter === 'pending' ? "default" : "outline"}
              onClick={() => setFilter('pending')}
              className={filter === 'pending' ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Pending
            </Button>
            <Button 
              variant={filter === 'approved' ? "default" : "outline"}
              onClick={() => setFilter('approved')}
              className={filter === 'approved' ? "bg-green-600 hover:bg-green-700" : ""}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Approved
            </Button>
            <Button 
              variant={filter === 'rejected' ? "default" : "outline"}
              onClick={() => setFilter('rejected')}
              className={filter === 'rejected' ? "bg-red-600 hover:bg-red-700" : ""}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Rejected
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search applications..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <div className="text-gray-500 text-sm mb-1">Total Applications</div>
            <div className="text-2xl font-bold">{applications.length}</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
            <div className="text-blue-600 text-sm mb-1">Pending</div>
            <div className="text-2xl font-bold">{applications.filter(app => app.status === 'pending').length}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-md border border-green-200">
            <div className="text-green-600 text-sm mb-1">Approved</div>
            <div className="text-2xl font-bold">{applications.filter(app => app.status === 'approved').length}</div>
          </div>
          <div className="bg-red-50 p-4 rounded-md border border-red-200">
            <div className="text-red-600 text-sm mb-1">Rejected</div>
            <div className="text-2xl font-bold">{applications.filter(app => app.status === 'rejected').length}</div>
          </div>
        </div>
        
        {filteredApplications.length === 0 ? (
          <div className="bg-gray-50 p-8 rounded-md text-center">
            <p className="text-gray-500">No applications match your criteria.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <div 
                key={application._id} 
                className="border rounded-lg overflow-hidden bg-white shadow-sm"
              >
                <div 
                  className="p-4 border-b cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleDetails(application._id)}
                >
                  <div className="flex flex-col md:flex-row justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                        <User className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{application.name}</h3>
                        <p className="text-sm text-gray-600">{application.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-2 md:mt-0">
                      <Badge
                        className={`
                          ${application.status === 'pending' && 'bg-blue-100 text-blue-800'} 
                          ${application.status === 'approved' && 'bg-green-100 text-green-800'} 
                          ${application.status === 'rejected' && 'bg-red-100 text-red-800'}
                        `}
                      >
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </Badge>
                      <span className="text-gray-400 text-sm">
                        {new Date(application.createdAt).toLocaleDateString()}
                      </span>
                      {expandedApplication === application._id ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
                
                {expandedApplication === application._id && (
                  <div className="p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Education</h4>
                          <div className="flex items-center">
                            <GraduationCap className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="text-gray-700">{application.branch}, Class of {application.graduated}</span>
                          </div>
                        </div>
                        
                        {(application.company || application.role) && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Current Position</h4>
                            <div className="flex items-center">
                              <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
                              <span className="text-gray-700">
                                {application.role && application.role} 
                                {application.company && application.role && " at "}
                                {application.company && application.company}
                              </span>
                            </div>
                          </div>
                        )}
                        
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Experience</h4>
                          <p className="text-gray-700">{application.experience}</p>
                        </div>
                        
                        {application.linkedin && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-500 mb-1">LinkedIn</h4>
                            <a 
                              href={application.linkedin} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 flex items-center hover:underline"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              View Profile
                            </a>
                          </div>
                        )}

                        {application.availability && application.availability.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Availability</h4>
                            <div className="flex items-start">
                              <Clock className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                              <div>
                                <ul className="text-gray-700 list-disc list-inside">
                                  {application.availability.map(time => (
                                    <li key={time}>{time}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}

                        {application.mentorshipFormats && application.mentorshipFormats.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Preferred Formats</h4>
                            <div className="flex items-start">
                              <MessageSquare className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                              <div>
                                <ul className="text-gray-700 list-disc list-inside">
                                  {application.mentorshipFormats.map(format => (
                                    <li key={format}>{format}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Bio</h4>
                          <p className="text-gray-700">{application.bio}</p>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Specializations</h4>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {application.specializations.map(spec => (
                              <Badge key={spec} variant="outline" className="bg-gray-50">
                                {spec}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {application.mentorshipTopics && application.mentorshipTopics.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Mentorship Topics</h4>
                            <div className="flex items-start">
                              <Tag className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                              <div className="flex flex-wrap gap-2 mt-1">
                                {application.mentorshipTopics.map(topic => (
                                  <Badge key={topic} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                    {topic}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {application.maxMentees && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Maximum Mentees</h4>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-2 text-gray-500" />
                              <span className="text-gray-700">
                                {application.maxMentees} {application.maxMentees === 1 ? "mentee" : "mentees"}
                              </span>
                            </div>
                          </div>
                        )}
                        
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Application Date</h4>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="text-gray-700">
                              {new Date(application.createdAt).toLocaleDateString()} at {new Date(application.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between">
                      <Button 
                        variant="outline" 
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleDeleteConfirm(application)}
                        disabled={processingId === application._id}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Application
                      </Button>
                      
                      <div className="space-x-2">
                        {application.status === 'pending' ? (
                          <>
                            <Button 
                              variant="outline" 
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => handleStatusUpdate(application._id, 'rejected')}
                              disabled={processingId === application._id}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                            <Button 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleStatusUpdate(application._id, 'approved')}
                              disabled={processingId === application._id}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                          </>
                        ) : application.status === 'approved' ? (
                          <Button 
                            variant="outline" 
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleStatusUpdate(application._id, 'rejected')}
                            disabled={processingId === application._id}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Revoke Approval
                          </Button>
                        ) : (
                          <Button 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleStatusUpdate(application._id, 'approved')}
                            disabled={processingId === application._id}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve Now
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {mentorToDelete && (
        <ConfirmationDialog
          isOpen={showDeleteConfirmation}
          onClose={() => setShowDeleteConfirmation(false)}
          onConfirm={handleDeleteMentor}
          title="Delete Mentor Application"
          message={
            <div>
              <p className="mb-4">
                Are you sure you want to delete the mentor application for <span className="font-semibold">{mentorToDelete.name}</span>?
              </p>
              <p className="text-red-600">
                This action cannot be undone. The mentor will need to reapply if they wish to be considered again.
              </p>
            </div>
          }
          confirmText="Delete"
          confirmButtonClass="bg-red-600 hover:bg-red-700"
          type="danger"
        />
      )}
    </>
  );
}