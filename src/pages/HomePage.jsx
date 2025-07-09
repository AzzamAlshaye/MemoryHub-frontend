import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTitle } from "../hooks/useTitle";
import { FaMapMarkerAlt, FaUsers, FaGlobe, FaQuoteLeft } from "react-icons/fa";
import { useNavigate } from "react-router";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
<<<<<<< HEAD
  const navigate = useNavigate();

=======
  useTitle("Home | MemoryHub");
  const navigate = useNavigate();
>>>>>>> 93e70cd5f8b21071b6878c211b247201b14e35df
  useEffect(() => {
    setIsLoggedIn(Boolean(localStorage.getItem("token")));
  }, []);

  const handleButtonClick = () => {
    if (isLoggedIn) {
<<<<<<< HEAD
      navigate("mapPage");  // navigate to map page if logged in
    } else {
      navigate("/SignInPage");  // navigate to signin page if not logged in
    }
  };

=======
      navigate("/mapPage");
    } else {
      navigate("/SignInPage");
    }
  };
>>>>>>> 93e70cd5f8b21071b6878c211b247201b14e35df
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
      img: "/default-avatar.jpg",
      name: "Sarah Ahmad",
      role: "Travel Blogger",
      text: "Map Memory turned my trips into an interactive storybook!",
    },
    {
      img: "/user2.png",
      name: "Michael Torres",
      role: "Photographer",
      text: "Pinning spots helps me rediscover perfect shooting locations.",
    },
  ];

  return (
    <main className="bg-[#FEFCFB] text-gray-800">
      {/* Hero */}
      <section
        className="
          container mx-auto px-6
          py-12 sm:py-16 lg:py-20
          grid md:grid-cols-2 gap-12 items-center
          h-auto lg:h-[100vh]
        "
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeIn}
          className="space-y-6 text-center md:text-left"
        >
          <motion.img
            src="/m-logo.webp"
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            transition={{ delay: 0.5 }}
            className="
     block md:hidden h-40
      w-40
      mx-auto
    "
            alt="MemoryHub icon"
          />
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-neutral-800">
            Save Your <span className="text-main-theme">Memories</span>
            <br />
            Where They Happened
          </h1>
          <p className="text-base md:text-lg max-w-lg mx-auto md:mx-0 leading-relaxed">
            Pin photos, videos, voice notes & stories to exact map locations.
            Relive your adventures with pinpoint accuracy.
          </p>
          <motion.button
            initial="hidden"
            whileInView="visible"
            onClick={handleButtonClick}
            variants={fadeIn}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            onClick={handleButtonClick}
            className="
              bg-amber-500 text-white
              px-6 py-3 rounded-full shadow-md hover:shadow-lg
              delay-300 duration-500 block md:inline-block
              w-full md:w-auto
              hover:cursor-pointer hover:bg-amber-600
            "
          >
            {isLoggedIn ? "Create Your Memory" : "Start Your First Memory"}
          </motion.button>
        </motion.div>

        <motion.img
          src="/m-logo.webp"
          initial="hidden"
          whileInView="visible"
          variants={fadeIn}
          transition={{ delay: 0.5 }}
          className="
            hidden sm:block
            w-full max-w-xs sm:max-w-md md:max-w-lg lg:w-[32rem]
            mx-auto
          "
          alt="Map Memory Illustration"
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
            <p className="text-neutral-800 ">
              How <span className="text-main-theme">MemoryHub</span> Works
            </p>
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
                <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center bg-amber-100 rounded-full text-main-theme text-2xl">
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
            className="bg-amber-50 p-8 rounded-2xl shadow-lg border-l-4 border-main-theme italic text-gray-700"
          >
            <FaQuoteLeft className="text-main-theme text-2xl mb-4" />
            <p className="leading-relaxed">
              “Every memory tells a story—and every story can inspire a journey.
              Share your moments, and let your posts guide others exploring the
              world.”
            </p>
            <cite className="block text-right font-semibold mt-4 text-gray-900">
              — The MemoryHub Team
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
