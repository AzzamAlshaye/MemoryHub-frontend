// src/components/ViewPin.jsx
import React, { useState, useEffect } from "react";
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

import { pinService } from "../service/pinService";
import { commentService } from "../service/commentService";
import { likeService } from "../service/likeService";

export default function ViewPin({
  pinId,
  onClose,
  currentUser = { name: "You", avatar: "https://via.placeholder.com/40" },
  icons = {},
}) {
  const [pin, setPin] = useState(null);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showReport, setShowReport] = useState(null);

  // 1) Load pin details, comments, and reactions when pinId changes
  useEffect(() => {
    if (!pinId) return;

    // Pin details
    pinService.get(pinId).then((data) => {
      setPin(data);
      setLikes(data.likes || 0);
      setDislikes(data.dislikes || 0);
    });

    // Comments
    commentService.listByPin(pinId).then(setComments);

    // Likes/dislikes summary
    likeService.list("pin", pinId).then(({ likes: l, dislikes: d }) => {
      setLikes(l);
      setDislikes(d);
    });
  }, [pinId]);

  if (!pin) return null;

  const mediaList = pin.media || [];
  const {
    FaHeart = () => null,
    FaComment = () => null,
    FaShareAlt = () => null,
    FaBookmark = () => null,
    FaSyncAlt = () => null,
  } = icons;

  const formattedDate = (iso) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const navigateMedia = (step) =>
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
    const text = e.target.elements.comment.value.trim();
    if (!text) return;
    // TODO: call commentService.create({ pinId, text }) here
    const newC = {
      id: Date.now(),
      author: { name: currentUser.name, avatar: currentUser.avatar },
      text,
      createdAt: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
    };
    setComments((prev) => [newC, ...prev]);
    e.target.reset();
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

        {/* Header */}
        <header className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 break-words">
            {pin.title}
          </h2>
          <div className="mt-4 flex items-center gap-3">
            <img
              src={pin.owner?.avatar || currentUser.avatar}
              alt={pin.owner?.name || currentUser.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="text-sm text-gray-500">
              <p className="font-medium text-gray-700">
                {pin.owner?.name || currentUser.name}
              </p>
              <time dateTime={pin.createdAt}>
                {formattedDate(pin.createdAt)}
              </time>
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

        {/* Media Carousel */}
        {mediaList.length > 0 && (
          <div className="relative bg-gray-100">
            <div className="w-full aspect-video">
              <img
                src={mediaList[currentIdx]}
                alt={`Slide ${currentIdx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => navigateMedia(-1)}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-50"
            >
              <FaChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={() => navigateMedia(1)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-50"
            >
              <FaChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        )}

        {/* Body */}
        <section className="p-6 space-y-6">
          <p className="text-gray-700">{pin.description}</p>
          <div className="flex items-start gap-4 p-4 bg-white border rounded-lg">
            <FaLocationDot className="text-red-500 text-2xl" />
            <div>
              <p className="font-medium text-gray-800">{pin.location.name}</p>
              <p className="text-sm text-gray-500">{pin.location.address}</p>
            </div>
          </div>

          {/* Reactions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setLikes((l) => l + 1)}
                className="flex items-center gap-1 hover:text-blue-600"
              >
                <FaThumbsUp /> {likes}
              </button>
              <button
                onClick={() => setDislikes((d) => d + 1)}
                className="flex items-center gap-1 hover:text-red-600"
              >
                <FaThumbsDown /> {dislikes}
              </button>
            </div>
            <button
              onClick={() => setShowReport({ type: "post" })}
              className="flex items-center gap-1 hover:text-yellow-600"
            >
              <FaFlag /> Report
            </button>
          </div>

          {/* Comments */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Comments ({comments.length})
            </h3>
            <div className="max-h-64 overflow-y-auto hide-scrollbar space-y-4">
              {comments.map((c) => (
                <div key={c.id} className="flex items-start gap-3">
                  <img
                    src={c.author.avatar}
                    alt={c.author.name}
                    className="w-8 h-8 rounded-full"
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
                    <div className="mt-2 flex items-center gap-4">
                      <button
                        onClick={() => reactToComment(c.id, 1)}
                        className="flex items-center gap-1 hover:text-blue-600"
                      >
                        <FaThumbsUp /> {c.likes}
                      </button>
                      <button
                        onClick={() => reactToComment(c.id, -1)}
                        className="flex items-center gap-1 hover:text-red-600"
                      >
                        <FaThumbsDown /> {c.dislikes}
                      </button>
                      <button
                        onClick={() =>
                          setShowReport({ type: "comment", id: c.id })
                        }
                        className="flex items-center gap-1 hover:text-yellow-600"
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
              className="mt-6 flex gap-3 border-t pt-4"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full"
              />
              <textarea
                name="comment"
                rows={2}
                placeholder="Add a comment..."
                className="flex-1 border rounded-lg p-2"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
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
            onSubmit={() => setShowReport(null)}
          />
        )}
      </div>
    </div>
  );
}