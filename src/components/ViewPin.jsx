// src/components/ViewPin.jsx
import React, { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { FaThumbsUp, FaThumbsDown, FaFlag } from "react-icons/fa";
import ReportPopup from "./ReportPopup";

export default function ViewPin({ pin, onClose, currentUser, icons }) {
  if (!pin) return null;

  // Destructure optional icon overrides
  const {
    FaHeart = () => null,
    FaComment = () => null,
    FaShareAlt = () => null,
    FaBookmark = () => null,
    FaSyncAlt = () => null,
  } = icons || {};

  const [idx, setIdx] = useState(0);
  const imgs = pin.media || [];

  // Sample comments or fetched via API
  const [comments, setComments] = useState([
    {
      id: 1,
      author: {
        name: "Jane Doe",
        avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      },
      text: "Absolutely stunning!",
      createdAt: "2025-06-30T14:12:00Z",
      likes: 5,
      dislikes: 0,
    },
    {
      id: 2,
      author: {
        name: "John Smith",
        avatar: "https://randomuser.me/api/portraits/men/76.jpg",
      },
      text: "I’ve always wanted to visit here.",
      createdAt: "2025-06-30T15:45:00Z",
      likes: 3,
      dislikes: 1,
    },
  ]);

  const [postLikes, setPostLikes] = useState(pin.likes || 0);
  const [postDislikes, setPostDislikes] = useState(pin.dislikes || 0);
  const [reportTarget, setReportTarget] = useState(null);

  const toggleCommentReaction = (id, delta) => {
    setComments((cs) =>
      cs.map((c) =>
        c.id === id
          ? {
              ...c,
              likes: c.likes + (delta > 0 ? 1 : 0),
              dislikes: c.dislikes + (delta < 0 ? 1 : 0),
            }
          : c
      )
    );
  };

  const openReport = (target) => setReportTarget(target);
  const closeReport = () => setReportTarget(null);
  const handleReportSubmit = ({ target, reason, description }) => {
    // TODO: integrate with reporting API
    console.log("Reported", target, "because:", reason, description);
    closeReport();
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-[2000] overflow-auto bg-gray-900/50 p-4">
        <div className="relative bg-white rounded-2xl shadow-xl max-w-4xl mx-auto my-8">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
          >
            ×
          </button>

          {/* Header */}
          <div className="p-6 border-b">
            <h1 className="text-2xl font-semibold mb-2">{pin.title}</h1>
            <div className="flex items-center space-x-3 text-gray-600">
              <img
                src={pin.author?.avatar}
                alt={pin.author?.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{pin.author?.name}</p>
                <p className="text-xs">
                  {new Date(pin.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                {pin.privacy}
              </span>
              {pin.tags?.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Image Carousel */}
          {imgs.length > 0 && (
            <div className="relative w-full overflow-hidden">
              <img
                src={imgs[idx]}
                alt={`slide-${idx}`}
                className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-t-2xl"
              />
              <button
                onClick={() => setIdx((idx - 1 + imgs.length) % imgs.length)}
                className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/75 p-2 rounded-full"
              >
                ‹
              </button>
              <button
                onClick={() => setIdx((idx + 1) % imgs.length)}
                className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/75 p-2 rounded-full"
              >
                ›
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
                {imgs.map((_, i) => (
                  <span
                    key={i}
                    onClick={() => setIdx(i)}
                    className={`w-2 h-2 rounded-full cursor-pointer ${
                      i === idx ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Description & Location */}
          <div className="p-6 space-y-6">
            <p className="text-gray-700">{pin.description}</p>
            <div className="border border-gray-200 rounded-xl p-4 flex items-center gap-4">
              <FaLocationDot className="text-red-500 text-xl" />
              <div>
                <p className="font-medium">{pin.location.name}</p>
                <p className="text-sm text-gray-500">{pin.location.address}</p>
              </div>
              {pin.location.image && (
                <img
                  src={pin.location.image}
                  alt=""
                  className="ml-auto w-24 h-16 rounded-lg object-cover"
                />
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 border-t flex items-center justify-between text-gray-600">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setPostLikes(postLikes + 1)}
                className="flex items-center gap-1 hover:text-blue-600"
              >
                <FaThumbsUp /> {postLikes}
              </button>
              <button
                onClick={() => setPostDislikes(postDislikes + 1)}
                className="flex items-center gap-1 hover:text-red-600"
              >
                <FaThumbsDown /> {postDislikes}
              </button>
            </div>
            <button
              onClick={() => openReport({ type: "post" })}
              className="flex items-center gap-1 hover:text-yellow-600"
            >
              <FaFlag /> Report
            </button>
          </div>

          {/* Comments Section */}
          <div className="px-6 pb-6 space-y-4">
            <h2 className="font-semibold text-lg">Comments</h2>
            {comments.map((c) => (
              <div key={c.id} className="flex items-start gap-3">
                <img
                  src={c.author.avatar}
                  alt={c.author.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{c.author.name}</span>{" "}
                    <span className="text-gray-500 text-xs">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </p>
                  <p className="text-gray-700">{c.text}</p>
                  <div className="mt-2 flex items-center space-x-4 text-gray-600">
                    <button
                      onClick={() => toggleCommentReaction(c.id, 1)}
                      className="flex items-center gap-1 hover:text-blue-600"
                    >
                      <FaThumbsUp /> {c.likes}
                    </button>
                    <button
                      onClick={() => toggleCommentReaction(c.id, -1)}
                      className="flex items-center gap-1 hover:text-red-600"
                    >
                      <FaThumbsDown /> {c.dislikes}
                    </button>
                    <button
                      onClick={() => openReport({ type: "comment", id: c.id })}
                      className="flex items-center gap-1 hover:text-yellow-600"
                    >
                      <FaFlag /> Report
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Report Popup */}
      {reportTarget && (
        <ReportPopup
          target={reportTarget}
          onCancel={closeReport}
          onSubmit={handleReportSubmit}
        />
      )}
    </>
  );
}
