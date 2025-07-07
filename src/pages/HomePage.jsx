// src/components/HomePage.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaUsers, FaGlobe, FaQuoteLeft } from "react-icons/fa";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(Boolean(localStorage.getItem("token")));
  }, []);

  const features = [
    {
      icon: <FaMapMarkerAlt />,
      title: "Pin Your Memories",
      desc: "Attach photos, videos & notes to exact map locations.",
    },
    {
      icon: <FaUsers />,
      title: "Share Securely",
      desc: "Control privacy: private, friends-only or public.",
    },
    {
      icon: <FaGlobe />,
      title: "Explore Journeys",
      desc: "Discover adventures shared by users worldwide.",
    },
  ];

  const testimonials = [
    {
      img: "https://randomuser.me/api/portraits/women/44.jpg",
      name: "Sarah Johnson",
      role: "Travel Blogger",
      text: "Map Memory turned my trips into an interactive storybook!",
    },
    {
      img: "https://randomuser.me/api/portraits/men/32.jpg",
      name: "Michael Torres",
      role: "Photographer",
      text: "Pinning spots helps me rediscover perfect shooting locations.",
    },
  ];

  return (
    <main className="bg-[#FEFCFB] text-gray-800">
      {/* Hero */}
      <section className="container mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeIn}
          className="space-y-6"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
            Save Your <span className="text-amber-500">Memories</span>
            <br />
            Where They Happened
          </h1>
          <p className="text-lg max-w-lg leading-relaxed">
            Pin photos, videos, voice notes & stories to exact map locations.
            Relive your adventures with pinpoint accuracy.
          </p>
          <motion.button
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            className="bg-amber-500 text-white px-8 py-3 rounded-full shadow-md hover:shadow-lg transition"
          >
            {isLoggedIn ? "Create Your Memory" : "Start Your First Memory"}
          </motion.button>
        </motion.div>
        <motion.img
          src="/Logo-all.png"
          initial="hidden"
          whileInView="visible"
          variants={fadeIn}
          transition={{ delay: 0.5 }}
          className="w-[32rem] mx-auto"
        />
      </section>

      {/* How It Works */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            className="text-3xl md:text-4xl font-semibold mb-12"
          >
            How <span className="text-amber-500">Map Memory</span> Works
          </motion.h2>
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                variants={fadeIn}
                transition={{ delay: i * 0.2 }}
                className="bg-gray-50 p-8 rounded-2xl shadow hover:shadow-lg transition transform hover:-translate-y-1"
              >
                <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center bg-amber-100 rounded-full text-amber-500 text-2xl">
                  {f.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <motion.blockquote
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            className="bg-amber-50 p-8 rounded-2xl shadow-lg border-l-4 border-amber-500 italic text-gray-700"
          >
            <FaQuoteLeft className="text-amber-500 text-2xl mb-4" />
            <p className="leading-relaxed">
              “Every memory tells a story—and every story can inspire a journey.
              Share your moments, and let your posts guide others exploring the
              world.”
            </p>
            <cite className="block text-right font-semibold mt-4 text-gray-900">
              — The Map Memory Team
            </cite>
          </motion.blockquote>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            className="text-3xl md:text-4xl font-semibold text-center mb-12"
          >
            What Our Users Say
          </motion.h2>
          <div className="grid gap-8 sm:grid-cols-2">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                variants={fadeIn}
                transition={{ delay: i * 0.2 }}
                className="bg-gray-50 p-8 rounded-2xl shadow hover:shadow-lg transition transform hover:-translate-y-1"
              >
                <img
                  src={t.img}
                  alt={t.name}
                  className="w-16 h-16 rounded-full mx-auto mb-4 border-2 border-amber-100"
                />
                <h4 className="text-lg font-semibold mb-1 text-center">
                  {t.name}
                </h4>
                <p className="text-sm text-gray-500 mb-4 text-center">
                  {t.role}
                </p>
                <p className="text-gray-600 text-base text-center leading-relaxed">
                  {t.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
