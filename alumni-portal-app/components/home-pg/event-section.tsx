"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, useAnimation } from "framer-motion";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";
import { getRecentEvents } from "@/lib/db/actions/event.actions";
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

const EventCard = ({
  event,
  index,
}: {
  event: Event;
  index: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const eventDate = new Date(event.date);
  const formattedDate = format(eventDate, "MMM d");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.3 }}
      className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative overflow-hidden h-[200px]">
        <Image
          src={event.image || "/assets/mumbai-meetings.jpg"}
          alt={`${event.title} event`}
          layout="fill"
          objectFit="cover"
          className="w-full h-full transition-transform duration-800 group-hover:scale-110"
        />
      </div>
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-1 text-orange-600">
            <Calendar className="w-4 h-4" />
            <span className="font-medium">{formattedDate}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-500">
            <MapPin className="w-4 h-4" />
            <span>{event.location}</span>
          </div>
        </div>
        <h3 className="text-xl font-semibold line-clamp-1 group-hover:text-orange-600 transition-colors">
          {event.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2">
          {event.description}
        </p>
        <button className="inline-flex items-center text-orange-600 font-medium hover:text-orange-700 transition-colors">
          View Details
          <ArrowRight className="ml-1 w-4 h-4 transform transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </motion.div>
  );
};

export default function EventsSection() {
  const headerRef = useRef(null);
  const headerControls = useAnimation();
  const isHeaderInView = useInView(headerRef, { once: true });
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isHeaderInView) {
      headerControls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: "easeOut" },
      });
    }
  }, [isHeaderInView, headerControls]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getRecentEvents(4);
        setEvents(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <section className="flex flex-col items-center justify-center bg-gray-50 px-4 md:px-8 py-8">
      <div className="max-w-7xl w-full">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: -50 }}
          animate={headerControls}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-3">Upcoming Events</h2>
          <p className="text-gray-600 max-w-3xl">
            Connect with fellow alumni at our upcoming events and gatherings
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.length > 0 ? (
              events.map((event, index) => (
                <EventCard key={event._id} event={event} index={index} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                No upcoming events at the moment. Check back soon!
              </div>
            )}
          </div>
        )}
        
        <div className="mt-8 text-center">
          <Link href="/events">
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-md font-medium transition-colors inline-flex items-center">
              View All Events
              <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
