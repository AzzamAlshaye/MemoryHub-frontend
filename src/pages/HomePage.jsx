import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaUsers, FaGlobe } from "react-icons/fa";

const scrollFadeIn = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <main className="space-y-24 overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-tr from-amber-50 to-amber-200 overflow-hidden">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={scrollFadeIn}
          className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center"
        >
          <div className="space-y-6 text-center md:text-left">
            <motion.h1
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={scrollFadeIn}
              className="text-4xl sm:text-5xl font-extrabold text-gray-800 leading-tight"
            >
              Save Your Memories Where They Happened
            </motion.h1>
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={scrollFadeIn}
              className="text-gray-700 text-lg max-w-lg mx-auto md:mx-0"
            >
              Pin photos, videos, voice notes, and personal stories to exact map locations. Relive your adventures like never before.
            </motion.p>
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 100, damping: 20 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#fb8951] text-white px-8 py-3 rounded-full shadow-lg hover:opacity-90 scale-110 cursor-pointer hover:delay-300 duration-400"
            >
              {isLoggedIn ? "Create Your Memory" : "Start Your First Memory"}
            </motion.button>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              delay: 0.5,
              type: "spring",
              stiffness: 80,
              damping: 15,
            }}
            className="w-full flex items-center justify-center"
          >
            <img
              src="/new-logo.png"
              alt="Map Memory Logo"
              className="w-80 h-auto hover:scale-105 transition-transform duration-300"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="px-6 pt-5">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={scrollFadeIn}
            className="text-3xl text-gray-800 font-semibold"
          >
            How Map Memory Works
          </motion.h2>
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 text-gray-800">
            {[
              {
                icon: <FaMapMarkerAlt />,
                title: "Pin Your Memories",
                desc: "Attach photos, videos, voice notes, and written memories to exact map locations.",
              },
              {
                icon: <FaUsers />,
                title: "Share with Others",
                desc: "Keep memories private or share them with friends, family, or the world.",
              },
              {
                icon: <FaGlobe />,
                title: "Explore Journeys",
                desc: "Revisit past adventures or discover new places through shared posts.",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={scrollFadeIn}
                transition={{ delay: idx * 0.2 }}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg hover:delay-400 duration-800 cursor-pointer hover:scale-110 transition"
              >
                <div className="text-[#fb8951] text-4xl mb-4">{item.icon}</div>
                <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="bg-white py-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={scrollFadeIn}
          className="max-w-3xl mx-auto text-center bg-gradient-to-r from-gray-100 to-gray-50 p-8 rounded-2xl shadow-md"
        >
          <p className="italic text-gray-700 text-lg mb-4">
            “Every memory tells a story—and every story can inspire a journey. Share your moments, and let your posts become a guide for others exploring the world.”
          </p>
          <span className="font-semibold text-gray-500">— The Map Memory Team</span>
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={scrollFadeIn}
            className="text-3xl text-gray-800 font-semibold mb-10"
          >
            What Our Users Say
          </motion.h2>
          <div className="space-y-8 text-gray-800 sm:space-y-0 sm:grid sm:grid-cols-2 gap-8 hover:cursor-pointer">
            {[
              {
                img: "https://randomuser.me/api/portraits/women/44.jpg",
                name: "Sarah Johnson",
                role: "Travel Blogger",
                text: "Map Memory has transformed how I document my travels. It's like having a personal travel diary mapped out!",
              },
              {
                img: "https://randomuser.me/api/portraits/men/32.jpg",
                name: "Michael Torres",
                role: "Photographer",
                text: "As a photographer, pinning photos to exact locations helps me find perfect spots for future shoots.",
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={scrollFadeIn}
                transition={{ delay: i * 0.2 }}
                className="bg-white rounded-xl hover:scale-105 delay-500 duration-500 p-6 flex flex-col items-center text-center shadow-md hover:shadow-lg transition"
              >
                <img src={t.img} alt={t.name} className="w-16 h-16 rounded-full mb-4" />
                <div className="font-bold">{t.name}</div>
                <div className="text-sm text-gray-500 mb-2">{t.role}</div>
                <p className="text-gray-600 text-sm">{t.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}