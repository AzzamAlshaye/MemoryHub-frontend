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
import { FiSend } from "react-icons/fi";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
        >
          <FaTimes className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-xl font-medium text-gray-800">{pin.title}</h2>
          <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <img src={pin.author.avatar} className="w-8 h-8 rounded-full" />
              <div>
                <p className="text-gray-700 font-medium">{pin.author.name}</p>
                <p>{formattedDate(pin.createdAt)}</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="bg-gray-100 text-gray-700 px-2 py-1 text-xs rounded-full">
                {pin.privacy}
              </span>
              {pin.tags?.map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-100 text-blue-600 px-2 py-1 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Image Slider */}
        <div className="relative w-full h-[370px] bg-gray-200 overflow-hidden">
          <img
            src={mediaList[currentIdx]}
            className="w-full h-full object-cover"
            alt="media"
          />
          <button
            onClick={() => navigate(-1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white text-xl hover:scale-110"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={() => navigate(1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white text-xl hover:scale-110"
          >
            <FaChevronRight />
          </button>

          {/* Slider Dots */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {mediaList.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIdx(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                  idx === currentIdx ? "bg-white" : "bg-white/50"
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            📍 {pin.location.name}
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          <p className="text-gray-700 text-sm mb-4">{pin.description}</p>

          <div className="flex justify-between text-gray-600 text-sm items-center  py-3">
            <div className="flex gap-5 items-center">
              <button
                onClick={() => setPostLikes((l) => l + 1)}
                className="flex items-center gap-1 hover:text-blue-600"
              >
                <FaThumbsUp size={16} /> {postLikes}
              </button>
              <button
                onClick={() => setPostDislikes((d) => d + 1)}
                className="flex items-center gap-1 hover:text-red-600"
              >
                <FaThumbsDown size={16} /> {postDislikes}
              </button>
            </div>
            <button
              onClick={() => setShowReport({ type: "post" })}
              className="flex items-center gap-1 text-gray-500 hover:text-red-500"
            >
              <FaFlag size={14} /> Report
            </button>
          </div>

          {/* Single Gray Divider before Comments */}
          <hr className="my-6 border-gray-300" />

          {/* Comments */}
          <div className="">
            <h3 className="text-sm font-medium text-gray-600">
              Comments ({comments.length})
            </h3>
            <div className="mt-3 space-y-5 max-h-64 overflow-y-auto pr-2 hide-scrollbar">
              {comments.map((c) => (
                <div key={c.id}>
                  <div className="flex gap-3 items-start">
                    <img
                      src={c.author.avatar}
                      className="w-8 h-8 rounded-full mt-1"
                    />
                    <div className="border border-gray-200 px-4 py-2 rounded-xl w-full bg-white shadow-sm">
                      <div className="flex justify-between text-xs text-gray-600 font-medium">
                        <span>{c.author.name}</span>
                        <span>{formattedDate(c.createdAt)}</span>
                      </div>
                      <p className="text-gray-700 text-sm mt-1">{c.text}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 text-gray-500 text-sm mt-1 ps-12">
                    <button
                      onClick={() => reactToComment(c.id, 1)}
                      className="flex items-center gap-1 hover:text-blue-600"
                    >
                      <FaThumbsUp size={16} /> {c.likes}
                    </button>
                    <button
                      onClick={() => reactToComment(c.id, -1)}
                      className="flex items-center gap-1 hover:text-red-600"
                    >
                      <FaThumbsDown size={16} /> {c.dislikes}
                    </button>
                    <button
                      onClick={() =>
                        setShowReport({ type: "comment", id: c.id })
                      }
                      className="flex items-center gap-1 text-gray-500 hover:text-red-500"
                    >
                      <FaFlag size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Comment */}
            <form
              onSubmit={handleAddComment}
              className="flex gap-3 mt-4 items-start"
            >
              <img
                src={currentUser.avatar}
                className="w-8 h-8 rounded-full mt-1"
              />
              <div className="flex items-center justify-between border border-gray-300 rounded-xl px-4 py-2 w-full bg-white shadow-sm">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 text-sm focus:outline-none bg-transparent"
                />
                <button
                  type="submit"
                  className="text-blue-600 hover:text-blue-800 ms-2"
                >
                  <FiSend size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Report Modal */}
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