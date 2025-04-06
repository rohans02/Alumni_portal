"use client";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Phone, Mail, Globe, Youtube, Linkedin } from "lucide-react";
import { GraduationCap, Building2, Layout } from "lucide-react";
import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
export default function HomePage() {
  const navItems = [
    { name: "Home", href: "#home" },
    { name: "Event", href: "#event" },
    { name: "Stories", href: "#stories" },
    { name: "Gallery", href: "#gallery" },
    { name: "Contact Us", href: "#contact" },
  ];
  const socialIcons = [
    { icon: Phone, href: "tel:02025479811", label: "Phone" },
    { icon: Globe, href: "https://mmcoe.edu.in/", label: "Website" },
    { icon: Mail, href: "mailto:mmcoe@mmcoe.edu.in", label: "Email" },
    {
      icon: Youtube,
      href: "https://www.youtube.com/channel/UC4ZIkZoKmyoKDNypTSM-Eqw",
      label: "Youtube",
    },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/school/%E6%B3%95%E5%9B%BD/posts/?feedView=all",
      label: "Instagram",
    },
  ];

  const features = [
    {
      title: "SCHOLARSHIP",
      icon: GraduationCap,
      description:
        "Scholarships are awarded based on academic achievement, financial need, leadership, community service, special talents, or other criteria.",
    },
    {
      title: "OUR CAMPUS",
      icon: Building2,
      description:
        "Campus life is a vibrant community of students, faculty, and staff who are dedicated to learning, teaching, and serving others.",
    },
    {
      title: "PROGRAMS",
      icon: Layout,
      description:
        "We organize programs and events that help students develop leadership skills, build relationships, and make a positive impact on the world.",
    },
  ];
  const { isSignedIn } = useUser();
  return (
    <div className="relative h-screen overflow-y-auto mb-8">
      <div className="absolute right-16 top-0 h-72 w-24 border-blue-500 border-[50px] border-b-transparent z-50"></div>

      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/assets/landingPage.jpg"
          alt="University Campus"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/65" />
      </div>

      {/* Header with Bookmark Tag */}
      <header className="relative z-30 bg-black/80 w-full py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo on the Left */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/assets/logo-mmcoe.png"
                alt="State College Logo"
                width={150} // Increased width
                height={0} // Increased height
                className="h-16" // Adjust height while keeping aspect ratio
              />
            </Link>
          </div>

          {/* Navigation and Social Icons on the Right */}
          <div className="flex flex-col md:items-end items-center">
            {/* Social Icons */}
            <div className="flex items-center space-x-3 mb-3">
              {socialIcons.map(({ icon: Icon, href, label }, index) => (
                <Link
                  key={index}
                  href={href}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-500 transition-colors"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4 text-white" />
                </Link>
              ))}
              <span className="w-28"></span>
            </div>

            {/* Navigation */}
            <nav className="w-full md:w-auto">
              <ul className="flex flex-wrap justify-center md:justify-end space-x-6">
                {navItems.map(({ name, href }) => (
                  <li key={name}>
                    <Link
                      href={href}
                      className="text-white hover:text-blue-400 transition-colors text-sm"
                    >
                      {name}
                    </Link>
                  </li>
                ))}
                <span className="w-24"></span>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative flex flex-col items-center justify-center text-white text-center h-[50vh] px-4 mb-8">
        <h1 className="font-serif text-5xl mb-3 tracking-tight">
          Who Will You Discover?
        </h1>
        <p className="text-lg md:text-xl font-light tracking-wider max-w-3xl px-6 rounded-lg py-2">
          Connect with your Alumni community. Explore your official destination
          for finding alumni of MMCOE.
        </p>
        <div className="flex justify-end items-center p-4 gap-4 h-16">
          {!isSignedIn ? (
            <div className="flex gap-4">
              <SignInButton mode="modal">
                <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium shadow-md">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-5 py-2 bg-transparent text-white border border-gray-500 rounded-lg transition-colors duration-200 font-medium shadow-md">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          ) : (
            <Link href="/dashboard">Dashboard</Link>
          )}
        </div>
      </section>

      {/* Feature Cards */}
      <section className="relative flex-1 overflow-y-auto mt-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map(({ title, icon: Icon, description }, index) => (
              <Card
                key={index}
                className="bg-black/80 border-none text-white shadow-lg rounded-2xl"
              >
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white/10 rounded-full">
                      <Icon className="h-8 w-8 text-blue-400" />
                    </div>
                    <CardTitle className="text-xl font-semibold">
                      {title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300">
                    {description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
