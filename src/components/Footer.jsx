import React from 'react';
import { FaMapMarkedAlt } from 'react-icons/fa';
import {
  FaTwitter,
  FaInstagram,
  FaFacebook,
  FaGithub,
  FaTiktok,
} from 'react-icons/fa6';

function Footer() {
  return (
    <footer className="bg-white text-gray-700 border-t mt-12 text-sm">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">

        <div className="flex items-center gap-2">
          <FaMapMarkedAlt className="text-blue-600 text-xl" />
          <span className="font-semibold">Map Memory</span>
        </div>

        {/* Center: Links */}
        <div className="flex gap-4 text-gray-600 flex-wrap justify-center">
          <a href="/about" className="hover:text-blue-600">About</a>
          <a href="/privacy" className="hover:text-blue-600">Privacy</a>
          <a href="/terms" className="hover:text-blue-600">Terms</a>
          <a href="/help" className="hover:text-blue-600">Help</a>
        </div>

        {/* Right: Social Icons */}
        <div className="flex gap-3 text-gray-600 text-lg">
          <a href="#" aria-label="Facebook"><FaFacebook /></a>
          <a href="#" aria-label="Twitter"><FaTwitter /></a>
          <a href="#" aria-label="Instagram"><FaInstagram /></a>
          <a href="#" aria-label="GitHub"><FaGithub /></a>
          <a href="#" aria-label="TikTok"><FaTiktok /></a>
        </div>
      </div>

      <div className="text-center text-gray-400 text-xs py-4 ">
        © {new Date().getFullYear()} Map Memory. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
