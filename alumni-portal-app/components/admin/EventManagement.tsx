"use client";

import { useState, useEffect } from "react";
import { Calendar, Edit, Trash, Plus, AlertCircle, Check, X } from "lucide-react";
import { getAllEvents, deleteEvent, toggleEventStatus } from "@/lib/db/actions/event.actions";
import EventForm from "./EventForm";
import { format } from "date-fns";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function EventManagement() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Function to fetch events from the database
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await getAllEvents();
      setEvents(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle event deletion
  const handleDelete = async (id: string) => {
    try {
      await deleteEvent(id);
      // Refresh events list
      await fetchEvents();
      setShowDeleteConfirm(false);
      setDeleteId(null);
    } catch (err) {
      console.error("Error deleting event:", err);
      setError("Failed to delete event. Please try again.");
    }
  };

  // Function to toggle event status
  const handleToggleStatus = async (id: string) => {
    try {
      await toggleEventStatus(id);
      // Refresh events list
      await fetchEvents();
    } catch (err) {
      console.error("Error toggling event status:", err);
      setError("Failed to update event status. Please try again.");
    }
  };

  // Function to handle event creation/update completion
  const handleEventSaved = () => {
    fetchEvents();
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedEvent(null);
  };

  // Handle loading state
  if (loading && events.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        <span className="ml-3">Loading events...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Event button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-orange-500" />
          Events Management
        </h3>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-orange-600 text-white px-3 py-2 rounded-md hover:bg-orange-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Event
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Events list */}
      <div className="bg-white shadow overflow-hidden rounded-md">
        {events.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No events found. Create your first event!
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {events.map((event) => (
              <li key={event._id} className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center">
                      <span 
                        className={`w-3 h-3 rounded-full mr-2 ${
                          event.isActive ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                      ></span>
                      <h4 className="text-lg font-medium text-gray-900">{event.title}</h4>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {format(new Date(event.date), 'MMM d, yyyy')}
                      </span>
                      <span>{event.location}</span>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2">{event.description}</p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleToggleStatus(event._id)}
                      title={event.isActive ? "Deactivate event" : "Activate event"}
                      className={`p-1.5 rounded-full ${
                        event.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                      } hover:bg-opacity-80`}
                    >
                      {event.isActive ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowEditModal(true);
                      }}
                      className="p-1.5 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"
                      title="Edit event"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setDeleteId(event._id);
                        setShowDeleteConfirm(true);
                      }}
                      className="p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                      title="Delete event"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add/Edit Event Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {showEditModal ? "Edit Event" : "Add New Event"}
              </h3>
              <EventForm 
                event={selectedEvent ? {
                  _id: selectedEvent._id,
                  title: selectedEvent.title,
                  description: selectedEvent.description,
                  date: new Date(selectedEvent.date),
                  location: selectedEvent.location,
                  image: selectedEvent.image || ""
                } : undefined} 
                onSubmit={handleEventSaved} 
                onCancel={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  setSelectedEvent(null);
                }} 
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this event? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 