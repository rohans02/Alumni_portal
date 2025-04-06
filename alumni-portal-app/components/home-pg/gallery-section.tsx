"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Play,
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

export default function GallerySection() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <section className="bg-gray-900 py-20 px-4 md:px-8 relative">
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

            {/* Calendar Widget */}
            <Card className="bg-gray-800 border-0 flex">
              <CardContent className="p-6 flex justify-center h-96">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="text-white"
                  style={{ height: "100%" }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
