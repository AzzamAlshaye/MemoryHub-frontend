import React from 'react';

const Join = () => (
  <div className="min-h-screen flex items-center justify-center bg-blue-50">
    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
      <h1 className="text-2xl font-bold mb-4 text-center text-blue-800">
        Enter Invitation Link
      </h1>
      <input
        type="text"
        placeholder="Paste invitation link here"
        className="w-full bg-blue-100 rounded-lg px-4 py-3 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-inner mb-6 transition"
      />
      <div className="flex justify-center gap-4">
        <button className="w-1/2 px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition">
          Join
        </button>
        <button className="w-1/2 px-4 py-2 rounded-full bg-blue-200 text-blue-700 hover:bg-blue-300 transition">
          Cancel
        </button>
      </div>
    </div>
  </div>
);

export default Join;
