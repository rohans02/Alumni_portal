// components/Footer.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Globe, Mail, Youtube, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="bg-black text-white py-8 relative overflow-hidden">
      {/* Blue Ribbon on the right */}
      <div className="absolute right-16 top-24 bottom-0 w-24 border-blue-500 border-[50px] border-t-transparent"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Grid Layout for Logo and Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo Section */}
          <div className="flex flex-col items-start">
            <Image
              src="/assets/logo.png"
              alt="MMCOE Logo"
              width={250}
              height={60}
              className="mb-4"
            />
            <h3 className="text-lg font-bold">MMCOE Alumni Network</h3>
            <p className="text-sm text-gray-400 mt-2">
              Stay connected with your alma mater and fellow graduates.
            </p>
          </div>

          {/* Alumni Links Column */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Alumni Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="list-disc ml-4">Alumni Association</li>
              <li className="list-disc ml-4">Events & Reunions</li>
              <li className="list-disc ml-4">Networking Opportunities</li>
              <li className="list-disc ml-4">Career Support</li>
              <li className="list-disc ml-4">Success Stories</li>
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="list-disc ml-4">Placements</li>
              <li className="list-disc ml-4">Scholarships</li>
              <li className="list-disc ml-4">Workshops & Conferences</li>
              <li className="list-disc ml-4">Give Back to MMCOE</li>
            </ul>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-8 text-sm text-gray-300">
          <p>
            Sr.No. 18, Plot No. 5/3, CTS No.205, Behind Vandevi Temple,
            Karvenagar, Pune - 411052
          </p>
        </div>

        {/* Social Media Icons */}
        <div className="mt-8 flex space-x-4">
          <Link
            href="tel:02025479811"
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-500 transition-colors"
            aria-label="Phone"
          >
            <Phone className="h-4 w-4 text-white" />
          </Link>
          <Link
            href="https://mmcoe.edu.in/"
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-500 transition-colors"
            aria-label="Website"
          >
            <Globe className="h-4 w-4 text-white" />
          </Link>
          <Link
            href="mailto:mmcoe@mmcoe.edu.in"
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-500 transition-colors"
            aria-label="Email"
          >
            <Mail className="h-4 w-4 text-white" />
          </Link>
          <Link
            href="https://www.youtube.com/channel/UC4ZIkZoKmyoKDNypTSM-Eqw"
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-500 transition-colors"
            aria-label="YouTube"
          >
            <Youtube className="h-4 w-4 text-white" />
          </Link>
          <Link
            href="https://www.linkedin.com/school/%E6%B3%95%E5%9B%BD/posts/?feedView=all"
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-500 transition-colors"
            aria-label="Instagram"
          >
            <Linkedin className="h-4 w-4 text-white" />
          </Link>
        </div>

        {/* Copyright */}
        <div className="mt-4 text-center text-xs text-gray-500">
          <p>© 2025 MMCOE Alumni Network. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
