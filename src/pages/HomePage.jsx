import React from 'react';
import { FaMapMarkerAlt, FaUsers, FaGlobe } from 'react-icons/fa';

function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-blue-50 py-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-snug">
              Save your memories where they happened
            </h1>
            <p className="text-gray-700 text-sm sm:text-base mb-6 max-w-md mx-auto md:mx-0">
              Pin your favorite moments to real locations—videos, photos, voice notes, or personal notes—on an interactive map.
            </p>
            <button className="bg-blue-500 text-white px-6 py-2 rounded-full shadow hover:bg-blue-600 transition">
              Start your first memory
            </button>
          </div>
        </div>
      </section>

     
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl font-semibold mb-10">How Map Memory Works</h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {/* Item 1 */}
            <div className="bg-gray-100 rounded-lg p-6 text-center sm:text-left">
              <FaMapMarkerAlt className="text-blue-500 text-2xl mb-4 mx-auto sm:mx-0" />
              <h3 className="font-semibold mb-2">Pin Your Memories</h3>
              <p className="text-gray-600 text-sm">
                Attach your photos, videos, voice notes, and written memories to exact locations on the map.
              </p>
            </div>
            {/* Item 2 */}
            <div className="bg-gray-100 rounded-lg p-6 text-center sm:text-left">
              <FaUsers className="text-blue-500 text-2xl mb-4 mx-auto sm:mx-0" />
              <h3 className="font-semibold mb-2">Share with Others</h3>
              <p className="text-gray-600 text-sm">
                Choose to keep memories private or share them with friends, family, or the world.
              </p>
            </div>
            {/* Item 3 */}
            <div className="bg-gray-100 rounded-lg p-6 text-center sm:text-left">
              <FaGlobe className="text-blue-500 text-2xl mb-4 mx-auto sm:mx-0" />
              <h3 className="font-semibold mb-2">Explore Journeys</h3>
              <p className="text-gray-600 text-sm">
                Revisit your past adventures or discover new places through others' shared experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="bg-blue-50 py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <p className="text-gray-600 text-sm sm:text-base mb-4">
              Every memory tells a story—and every story can inspire a journey. Share your moments, and let your posts become a guide for others exploring the world.
            </p>
            <p className="text-gray-500 text-sm">The Map Memory Team</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl font-semibold mb-10">What Our Users Say</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Testimonial 1 */}
            <div className="bg-gray-100 rounded-lg p-6 text-left flex gap-4 items-start">
              <img
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt="Sarah Johnson"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div className="font-bold">Sarah Johnson</div>
                <div className="text-sm text-gray-500 mb-2">Travel Blogger</div>
                <p className="text-sm text-gray-600">
                  Map Memory has transformed how I document my travels. Now I can revisit my adventures not just through photos,
                  but by exactly where they happened. It's like having a personal travel diary mapped out!
                </p>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gray-100 rounded-lg p-6 text-left flex gap-4 items-start">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Michael Torres"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div className="font-bold">Michael Torres</div>
                <div className="text-sm text-gray-500 mb-2">Photographer</div>
                <p className="text-sm text-gray-600">
                  As a photographer, I love being able to pin my photos to exact locations. It helps me remember the perfect spots
                  for future shoots, and I've even connected with other photographers through shared locations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;