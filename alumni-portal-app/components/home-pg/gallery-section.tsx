"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Play,
  Award,
  ExternalLink,
} from "lucide-react";

const galleryItems = [
  {
    title: "Homecoming Highlights",
    image: "/assets/homecoming-highlights.jpg",
    tag: "EVENT | FEST",
    size: "large",
  },
  {
    title: "Alumni Weekends",
    image: "/assets/alumni-weekends.jpg",
    tag: "FEATURED",
    size: "medium",
  },
  {
    title: "Graduation Ceremony",
    image: "/assets/graduation-ceremony.jpg",
    tag: "FEATURED",
    size: "medium",
  },
];

const featuredAlumni = [
  {
    name: "Dr. Ananya Sharma",
    image: "https://images.pexels.com/photos/2613260/pexels-photo-2613260.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    year: "2010",
    accomplishment: "Leading AI Researcher at Google DeepMind",
    linkedIn: "#",
  },
  {
    name: "Vikram Mehta",
    image: "https://images.pexels.com/photos/997489/pexels-photo-997489.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    year: "2005",
    accomplishment: "Founder & CEO of TechInnovate Solutions",
    linkedIn: "#",
  },
  {
    name: "Priya Patel",
    image: "https://images.pexels.com/photos/2218786/pexels-photo-2218786.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    year: "2012",
    accomplishment: "NASA Aerospace Engineer",
    linkedIn: "#",
  },
];

export default function GallerySection() {
  return (
    <section id="gallery" className="bg-gray-900 py-20 px-4 md:px-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-4xl md:text-5xl font-bold text-white">
              Gallery
            </span>
          </div>
          <p className="text-gray-400 max-w-2xl">
            Check out the latest photos and videos from the alumni events and
            activities.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Gallery Grid */}
          <div className="lg:col-span-2 grid gap-6">
            <div className="grid md:grid-cols-2 gap-6">
              {galleryItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative group ${
                    item.size === "large"
                      ? "md:col-span-2"
                      : item.size === "vertical"
                      ? "row-span-2"
                      : ""
                  }`}
                >
                  <Card className="overflow-hidden bg-gray-800 border-0">
                    <CardContent className="p-0 relative">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        width={600}
                        height={400}
                        className="w-full h-[300px] object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute inset-0 p-6 flex flex-col justify-between">
                        <span className="text-sm text-gray-200 font-semibold">
                          {item.tag}
                        </span>
                        <div>
                          <h3 className="text-xl text-white font-semibold mb-4">
                            {item.title}
                          </h3>
                          <Button
                            variant="outline"
                            className="bg-blue-500/20 border-blue-500/50 text-blue-400 hover:bg-blue-500/30"
                          >
                            VIEW GALLERY
                            <ArrowRight className="ml-2 w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Live Streaming Card */}
            <Card className="bg-gray-800 border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Play className="text-blue-500" />
                  <h3 className="text-lg font-semibold text-white">
                    Live Streaming
                  </h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Watch the live streaming of the event happening now.
                </p>
              </CardContent>
            </Card>

            {/* Featured Alumni Spotlight */}
            <Card className="bg-gray-800 border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <Award className="text-blue-500" />
                  <h3 className="text-lg font-semibold text-white">
                    Alumni Spotlight
                  </h3>
                </div>

                <div className="space-y-4">
                  {featuredAlumni.map((alumni, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 pb-4 border-b border-gray-700 last:border-0 last:pb-0"
                    >
                      <Image
                        src={alumni.image}
                        alt={alumni.name}
                        width={50}
                        height={50}
                        className="rounded-full object-cover h-12 w-12"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-white font-medium">
                            {alumni.name}
                          </h4>
                          <span className="text-xs text-gray-400">
                            Class of {alumni.year}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 mt-1">
                          {alumni.accomplishment}
                        </p>
                        <a
                          href={alumni.linkedIn}
                          className="inline-flex items-center text-xs text-blue-400 mt-2 hover:text-blue-300"
                        >
                          LinkedIn Profile{" "}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 w-full bg-blue-500/20 border-blue-500/50 text-blue-400 hover:bg-blue-500/30"
                >
                  View All Alumni
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
