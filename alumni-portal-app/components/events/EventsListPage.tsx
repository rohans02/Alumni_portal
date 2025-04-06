"use client";

import { useState } from "react";
import Image from "next/image";
import { Calendar, MapPin, Search, ChevronLeft } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image?: string;
  isActive: boolean;
}

export default function EventsListPage({ events: initialEvents }: { events: Event[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(initialEvents);

  // Filter events based on search term
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredEvents(initialEvents);
      return;
    }
    
    const filtered = initialEvents.filter(event => 
      event.title.toLowerCase().includes(term.toLowerCase()) ||
      event.description.toLowerCase().includes(term.toLowerCase()) ||
      event.location.toLowerCase().includes(term.toLowerCase())
    );
    
    setFilteredEvents(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <Link 
            href="/" 
            className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-6"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Alumni Events</h1>
          <p className="text-gray-600 max-w-3xl">
            Connect with fellow alumni at our upcoming events and gatherings. Check out what&apos;s happening and join us!
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search events..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
        
        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => {
              const eventDate = new Date(event.date);
              return (
                <div 
                  key={event._id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative h-48">
                    <Image
                      src={event.image || "/assets/mumbai-meetings.jpg"}
                      alt={event.title}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center text-orange-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span className="font-medium">{format(eventDate, 'MMMM d, yyyy')}</span>
                      </div>
                    </div>
                    <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                    <div className="flex items-center text-gray-500 mb-4">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{event.location}</span>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
                    <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md font-medium transition-colors w-full text-center">
                      Register for Event
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm 
                ? `No events matching "${searchTerm}". Try a different search term.` 
                : "There aren&apos;t any upcoming events right now. Check back soon!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}