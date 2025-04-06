"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { EmblaCarouselType } from "embla-carousel";
import { getAllStories } from "@/lib/db/actions/story.actions";

interface Story {
  _id: string;
  title: string;
  content: string;
  author: string;
  authorEmail?: string;
  graduationYear?: string;
  branch?: string;
  image?: string;
  isPublished: boolean;
  createdAt: string;
}

export default function AlumniCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const fetchedStories = await getAllStories(true); // Only get published stories
        setStories(fetchedStories);
      } catch (err) {
        console.error("Error fetching stories:", err);
        setError("Failed to load stories");
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  if (loading) {
    return (
      <section className="relative bg-gray-900 py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-[450px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error || stories.length === 0) {
    return (
      <section className="relative bg-gray-900 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Alumni Stories</h2>
            <p className="text-gray-300 text-lg">
              {error || "No stories available at the moment."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-gray-900 py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Carousel */}
          <div className="relative">
            <Carousel
              opts={{
                loop: true,
                align: "center",
              }}
              className="w-full"
              setApi={(api: EmblaCarouselType | undefined) => {
                if (api) {
                  api.on("select", () => {
                    setCurrentSlide(api.selectedScrollSnap());
                  });
                }
              }}
            >
              <CarouselContent>
                {stories.map((story) => (
                  <CarouselItem key={story._id}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.5 }}
                      className="relative h-[450px] w-[300px] max-w-sm mx-auto overflow-hidden rounded-lg"
                    >
                      <Image
                        src={story.image || "/assets/landingPage.jpg"}
                        alt={story.title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                      />
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-24 bg-orange-500 hover:bg-red-600 border-none" />
              <CarouselNext className="absolute right-24 bg-orange-500 hover:bg-red-600 border-none" />
            </Carousel>
          </div>

          {/* Story Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-white space-y-6"
            >
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold">
                  Alumni Stories
                </h2>
                <div className="w-16 h-1 bg-orange-500" />
                <h3 className="text-2xl md:text-3xl font-semibold text-orange-500 flex items-center group">
                  {stories[currentSlide].title}
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {stories[currentSlide].content}
                </p>
                <div className="pt-4">
                  <h4 className="text-xl font-semibold">
                    {stories[currentSlide].author}
                  </h4>
                  <p className="text-gray-400">
                    {stories[currentSlide].graduationYear && `${stories[currentSlide].graduationYear}`}
                    {stories[currentSlide].branch && ` - ${stories[currentSlide].branch}`}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
