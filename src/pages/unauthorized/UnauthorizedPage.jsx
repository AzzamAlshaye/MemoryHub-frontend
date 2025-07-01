import React from "react";
import { Link } from "react-router";

/**
 * Displays when a user tries to access a forbidden route
 */
export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Unauthorized</h1>
      <p className="text-lg text-gray-600 mb-6">
        You do not have permission to view this page.
      </p>
      <Link
        to="/"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Go back to Home
      </Link>
    </div>
  );
}
