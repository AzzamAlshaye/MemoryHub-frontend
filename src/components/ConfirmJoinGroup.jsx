import React from "react";
import { FaUsers, FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router";

export default function ConfirmJoinGroup() {
  const navigate = useNavigate();

  // Close popup when clicking backdrop or Cancel
  const handleClose = () => {
    navigate(-1); 
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
      onClick={handleClose} // Close if click on backdrop
    >
      {/* Stop propagation if click inside the popup */}
      <div
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 text-blue-500 rounded-full p-4">
            <FaUsers size={32} />
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-800">Join Group</h2>
        <p className="text-md text-gray-700 mt-1 font-medium">Travel Enthusiasts</p>

        <div className="flex items-center justify-center text-gray-500 mt-2 text-sm gap-1">
          <FaUsers size={14} />
          <span>243 members</span>
        </div>

        <div className="bg-gray-100 text-gray-700 text-sm rounded-lg p-4 mt-5">
          Join our community of travelers sharing memories from around the world. Discover hidden gems and connect with fellow adventurers!
        </div>

        <button className="w-full bg-sky-500 hover:bg-sky-600 text-white font-medium py-2 rounded-lg flex items-center justify-center mt-6 gap-2">
          <FaUserPlus />
          Join Group
        </button>

        <button
          onClick={handleClose}
          className="text-gray-500 text-sm mt-4 hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
