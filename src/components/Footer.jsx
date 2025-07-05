// src/components/Footer.jsx
import React from "react";
import { FaMapMarkedAlt } from "react-icons/fa";
import {
  FaTwitter,
  FaInstagram,
  FaFacebook,
  FaGithub,
  FaTiktok,
} from "react-icons/fa6";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const socials = [
  { icon: <FaFacebook />, label: "Facebook", href: "#" },
  { icon: <FaTwitter />, label: "Twitter", href: "#" },
  { icon: <FaInstagram />, label: "Instagram", href: "#" },
  { icon: <FaGithub />, label: "GitHub", href: "#" },
  { icon: <FaTiktok />, label: "TikTok", href: "#" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full bg-gray-50 text-gray-700">
      {/* Divider */}
      <div className="border-t border-gray-200"></div>

      {/* Main Grid */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center lg:text-left">
        {/* Branding */}
        <div className="space-y-4">
          <div className="flex items-center justify-center lg:justify-start gap-2">
            <FaMapMarkedAlt className="text-3xl text-sky-600" />
            <span className="text-2xl font-bold">MapHub</span>
          </div>
          <p className="text-sm max-w-xs mx-auto lg:mx-0">
            MapHub helps you capture and revisit your favorite spots around the world.
          </p>
          <p className="text-xs text-gray-500">© {year} MapHub</p>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <h4 className="font-semibold text-lg">Contact Us</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center justify-center lg:justify-start gap-2">
              <FaMapMarkerAlt className="text-sky-600" />
              <span>123 Atlas Ave, Suite 5, Riyadh, SA</span>
            </li>
            <li className="flex items-center justify-center lg:justify-start gap-2">
              <FaPhoneAlt className="text-sky-600" />
              <span>+966 5 1234 5678</span>
            </li>
            <li className="flex items-center justify-center lg:justify-start gap-2">
              <FaEnvelope className="text-sky-600" />
              <span>support@maphub.com</span>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div className="space-y-3">
          <h4 className="font-semibold text-lg">Resources</h4>
          <ul className="space-y-2 text-sm">
            {["Blog", "FAQ", "Tutorials", "API Docs"].map((item) => (
              <li key={item}>
                <a
                  href={`/${item.toLowerCase().replace(/ /g, "-")}`}
                  className="text-gray-600 hover:text-indigo-600 transition hover:underline"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Icons */}
        <div className="space-y-4">
          <h4 className="font-semibold text-lg">Follow Us</h4>
          <div className="flex justify-center lg:justify-start space-x-4">
            {socials.map(({ icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="p-3 bg-white rounded-full shadow hover:bg-indigo-50 hover:shadow-lg transition transform hover:-translate-y-1"
              >
                <span className="text-xl text-gray-700 hover:text-indigo-600 block">
                  {icon}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-100 py-4">
        <p className="max-w-6xl mx-auto text-center text-xs text-gray-500">
          All rights reserved.
        </p>
      </div>
    </footer>
  );
}
