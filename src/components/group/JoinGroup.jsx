// src/components/JoinGroup.jsx

import React, { useState } from "react";
import Swal from "sweetalert2";
import { groupService } from "../../service/groupService";

export default function JoinGroup({ onClose, onJoined }) {
  const [link, setLink] = useState("");

  // Extract both groupId and inviteToken from the full URL
  const parseInvite = (url) => {
    try {
      const u = new URL(url);
      const segments = u.pathname.split("/");
      const id = segments[2]; // "/group/:id"
      const token = u.searchParams.get("token");
      return { id, token };
    } catch {
      return { id: null, token: null };
    }
  };

  const handleJoin = async () => {
    const { id, token } = parseInvite(link);
    if (!id || !token) {
      return Swal.fire(
        "Invalid link",
        "Please paste a full invitation link (including ?token=…)​",
        "error"
      );
    }

    try {
      await groupService.join(id, token);
      Swal.fire("Joined!", "You’ve successfully joined the group.", "success");
      onJoined(id);
    } catch (err) {
      console.error(err);
      Swal.fire(
        "Error",
        err.response?.data?.error || err.message || "Failed to join group.",
        "error"
      );
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl">
      <h1 className="text-2xl font-bold text-center mb-6">Join a Group</h1>

      <input
        type="text"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="Paste full invitation link here"
        className="w-full px-4 py-3 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
      />

      <div className="flex gap-4">
        <button
          onClick={handleJoin}
          className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg font-semibold"
        >
          Join
        </button>
        <button
          onClick={onClose}
          className="flex-1 bg-amber-100 hover:bg-amber-200 text-amber-700 py-2 rounded-lg font-semibold"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
