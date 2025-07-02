import React, { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaFlag,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import ReportPopup from "./ReportPopup";

// To hide scrollbars, add the following to your global CSS:
// .hide-scrollbar::-webkit-scrollbar { display: none; }
// .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

export default function ViewPin({
  pin,
  onClose,
  currentUser = { name: "You", avatar: "https://via.placeholder.com/40" },
  icons = {},
}) {
  if (!pin) return null;

  const defaultComments = [
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
  ];

  const mediaList =
    pin.media && pin.media.length > 0 ? Array(3).fill(pin.media).flat() : [];
  const baseComments =
    pin.comments && pin.comments.length > 0 ? pin.comments : defaultComments;
  const commentsList = Array(3).fill(baseComments).flat();

  const {
    FaHeart = () => null,
    FaComment = () => null,
    FaShareAlt = () => null,
    FaBookmark = () => null,
    FaSyncAlt = () => null,
  } = icons;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [showReport, setShowReport] = useState(null);
  const [postLikes, setPostLikes] = useState(pin.likes || 0);
  const [postDislikes, setPostDislikes] = useState(pin.dislikes || 0);
  const [comments, setComments] = useState(commentsList);
  const [newComment, setNewComment] = useState("");

  const formattedDate = (iso) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  const navigate = (step) =>
    setCurrentIdx((i) => (i + step + mediaList.length) % mediaList.length);
  const reactToComment = (cid, delta) =>
    setComments((prev) =>
      prev.map((c) =>
        c.id === cid
          ? {
              ...c,
              likes: c.likes + (delta > 0 ? 1 : 0),
              dislikes: c.dislikes + (delta < 0 ? 1 : 0),
            }
          : c
      )
    );
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const nextId = comments.length
      ? Math.max(...comments.map((c) => c.id)) + 1
      : 1;
    const cObj = {
      id: nextId,
      author: { name: currentUser.name, avatar: currentUser.avatar },
      text: newComment.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
    };
    setComments((prev) => [cObj, ...prev]);
    setNewComment("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm p-4">
      <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-full sm:w-[90%] md:w-[80%] lg:w-[70%] max-h-[90vh] overflow-y-auto hide-scrollbar">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
        >
          <FaTimes className="w-6 h-6" />
        </button>

        <header className="p-6 border-b border-gray-200">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 leading-tight break-words">
            {pin.title}
          </h2>
          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <img
                src={pin.author.avatar}
                alt={pin.author.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="text-sm text-gray-500">
                <p className="font-medium text-gray-700">{pin.author.name}</p>
                <time dateTime={pin.createdAt}>
                  {formattedDate(pin.createdAt)}
                </time>
              </div>
            </div>
            <div className="ml-auto flex flex-wrap gap-2">
              <span className="px-3 py-1 text-xs bg-indigo-50 text-indigo-600 rounded-full">
                {pin.privacy}
              </span>
              {pin.tags?.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </header>

        {mediaList.length > 0 && (
          <div className="relative bg-gray-100">
            <div className="w-full aspect-video bg-gray-200">
              <img
                src={mediaList[currentIdx]}
                alt={`Slide ${currentIdx + 1}`}
                className="w-full h-full object-cover object-center"
              />
            </div>
            <button
              onClick={() => navigate(-1)}
              aria-label="Previous"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-50"
            >
              <FaChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={() => navigate(1)}
              aria-label="Next"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-50"
            >
              <FaChevronRight className="w-5 h-5 text-gray-700" />
            </button>
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {mediaList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIdx(idx)}
                  className={`w-2 h-2 rounded-full ${
                    idx === currentIdx ? "bg-white" : "bg-white/60"
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        <section className="p-6 space-y-6">
          <p className="text-gray-700 leading-relaxed">{pin.description}</p>
          <div className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <FaLocationDot className="flex-none text-red-500 text-2xl" />
            <div>
              <p className="font-medium text-gray-800">{pin.location.name}</p>
              <p className="text-sm text-gray-500">{pin.location.address}</p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 text-gray-600">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setPostLikes((l) => l + 1)}
                className="flex items-center gap-1 hover:text-blue-600 transition"
              >
                <FaThumbsUp /> {postLikes}
              </button>
              <button
                onClick={() => setPostDislikes((d) => d + 1)}
                className="flex items-center gap-1 hover=text-red-600 transition"
              >
                <FaThumbsDown /> {postDislikes}
              </button>
            </div>
            <button
              onClick={() => setShowReport({ type: "post" })}
              className="flex items-center gap-1 hover:text-yellow-600 transition"
            >
              <FaFlag /> Report
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Comments ({comments.length})
            </h3>
            <div className="max-h-64 overflow-y-auto pr-2 space-y-4 hide-scrollbar">
              {comments.map((c) => (
                <div key={c.id} className="flex items-start gap-3">
                  <img
                    src={c.author.avatar}
                    alt={c.author.name}
                    className="w-8 h-8 rounded-full object-cover flex-none"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-700 text-sm">
                        {c.author.name}
                      </p>
                      <time
                        className="text-xs text-gray-500"
                        dateTime={c.createdAt}
                      >
                        {formattedDate(c.createdAt)}
                      </time>
                    </div>
                    <p className="mt-1 text-gray-700">{c.text}</p>
                    <div className="mt-2 flex items-center gap-4 text-gray-600">
                      <button
                        onClick={() => reactToComment(c.id, 1)}
                        className="flex items-center gap-1 hover:text-blue-600 transition"
                      >
                        <FaThumbsUp /> {c.likes}
                      </button>
                      <button
                        onClick={() => reactToComment(c.id, -1)}
                        className="flex items-center gap-1 hover:text-red-600 transition"
                      >
                        <FaThumbsDown /> {c.dislikes}
                      </button>
                      <button
                        onClick={() =>
                          setShowReport({ type: "comment", id: c.id })
                        }
                        className="flex items-center gap-1 hover:text-yellow-600 transition"
                      >
                        <FaFlag /> Report
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleAddComment}
              className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 border-t border-neutral-100 pt-4"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover flex-none"
              />
              <textarea
                className="flex-1 w-full resize-none border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring focus:ring-blue-100"
                rows={2}
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex-none"
              >
                Post
              </button>
            </form>
          </div>
        </section>

        {showReport && (
          <ReportPopup
            target={showReport}
            onCancel={() => setShowReport(null)}
            onSubmit={(data) => {
              console.debug("Report:", data);
              setShowReport(null);
            }}
          />
        )}
      </div>
    </div>
  );
}