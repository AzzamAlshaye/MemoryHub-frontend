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
import { FiSend } from "react-icons/fi";
import ReportPopup from "./ReportPopup";

import { pinService } from "../../service/pinService";
import { commentService } from "../../service/commentService";
import { likeService } from "../../service/likeService";
import { reportService } from "../../service/reportService";

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
  const [myReaction, setMyReaction] = useState(null); // "like" or "dislike" or null
  const [commentReactions, setCommentReactions] = useState({}); // { [commentId]: "like"|"dislike"|null }
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showReport, setShowReport] = useState(null);

  useEffect(() => {
    if (!pinId) return;

    // 1) Load pin details
    pinService.get(pinId).then((data) => {
      setPin(data);
      setLikes(data.likes || 0);
      setDislikes(data.dislikes || 0);
      setCurrentIdx(0);
    });

    // 2) Load aggregate counts
    likeService
      .list("pin", pinId)
      .then(({ likes: l, dislikes: d }) => {
        setLikes(l);
        setDislikes(d);
      })
      .catch(console.error);

    // 3) Load my reaction on pin
    likeService
      .getMyReaction("pin", pinId)
      .then((r) => setMyReaction(r?.type || null))
      .catch(() => setMyReaction(null));

    // 4) Load comments and then load my reactions on each comment
    commentService
      .listByPin(pinId)
      .then((cs) =>
        cs.map((c) => ({
          ...c,
          likes: c.likes || 0,
          dislikes: c.dislikes || 0,
        }))
      )
      .then((loadedComments) => {
        setComments(loadedComments);
        // for each comment, fetch my reaction
        loadedComments.forEach((c) => {
          likeService
            .getMyReaction("comment", c.id)
            .then((r) =>
              setCommentReactions((cr) => ({
                ...cr,
                [c.id]: r?.type || null,
              }))
            )
            .catch(() => {});
        });
      })
      .catch(console.error);
  }, [pinId]);

  if (!pin) return null;

  // Build media carousel items
  const images = Array.isArray(pin.media?.images)
    ? pin.media.images.map((i) => (typeof i === "string" ? i : i.url))
    : [];
  const rawV = pin.media?.video;
  const vUrl = rawV && (typeof rawV === "string" ? rawV : rawV.url);
  const mediaItems = [
    ...(vUrl ? [{ type: "video", url: vUrl }] : []),
    ...images.map((url) => ({ type: "image", url })),
  ];

  const fmtDate = (iso) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  // Helper to refresh aggregate counts
  const refreshPin = () =>
    likeService
      .list("pin", pinId)
      .then(({ likes: l, dislikes: d }) => {
        setLikes(l);
        setDislikes(d);
      })
      .catch(console.error);

  // Handle pin like/dislike toggle
  const handlePinReact = (type) => {
    const newType = myReaction === type ? null : type;
    likeService
      .create({ targetType: "pin", targetId: pinId, type: newType || type })
      .then(() => {
        setMyReaction(newType);
        refreshPin();
      })
      .catch(console.error);
  };

  // Handle comment like/dislike toggle
  const handleCommentReact = (cid, type) => {
    const prev = commentReactions[cid];
    const newType = prev === type ? null : type;
    likeService
      .create({
        targetType: "comment",
        targetId: cid,
        type: newType || type,
      })
      .then(() =>
        likeService.list("comment", cid).then(({ likes, dislikes }) => {
          setComments((cs) =>
            cs.map((c) => (c.id === cid ? { ...c, likes, dislikes } : c))
          );
          setCommentReactions((cr) => ({
            ...cr,
            [cid]: newType,
          }));
        })
      )
      .catch(console.error);
  };

  // Add a new comment
  const handleAddComment = (e) => {
    e.preventDefault();
    const text = e.target.elements.comment.value.trim();
    if (!text) return;
    commentService
      .create({ pinId, text })
      .then((nc) => {
        setComments((cs) => [{ ...nc, likes: 0, dislikes: 0 }, ...cs]);
        e.target.reset();
      })
      .catch(console.error);
  };

  // Submit report
  const handleReport = ({ reason, description }) => {
    if (!showReport || !reason.trim()) return;
    const { type: tType, id: tId } = showReport;
    reportService
      .create({
        targetType: tType,
        targetId: tId,
        reason: reason.trim(),
        ...(description?.trim() && { description: description.trim() }),
      })
      .then(() => setShowReport(null))
      .catch(console.error);
  };

  // Carousel navigation
  const navigate = (step) =>
    setCurrentIdx((i) => (i + step + mediaItems.length) % mediaItems.length);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-30 p-4">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes size={24} />
        </button>

        {/* Header */}
        <header className="p-6">
          <div className="flex items-center gap-4">
            <img
              src={pin.owner?.avatar || currentUser.avatar}
              alt={pin.owner?.name || currentUser.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-800">
                {pin.title}
              </h2>
              <p className="text-xs text-gray-500">
                {pin.owner?.name || currentUser.name} · {fmtDate(pin.createdAt)}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-full">
                {pin.privacy}
              </span>
              {pin.tags?.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* Carousel */}
        {mediaItems.length > 0 && (
          <div className="relative bg-gray-100">
            <div className="w-full aspect-video">
              {mediaItems[currentIdx].type === "image" ? (
                <img
                  src={mediaItems[currentIdx].url}
                  alt={`Slide ${currentIdx + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  controls
                  src={mediaItems[currentIdx].url}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            {pin.location?.name && (
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                📍 {pin.location.name}
              </div>
            )}
            <button
              onClick={() => navigate(-1)}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white text-xl hover:scale-110 transition"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={() => navigate(1)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-xl hover:scale-110 transition"
            >
              <FaChevronRight />
            </button>
          </div>
        )}

        {/* Body */}
        <section className="p-6 space-y-6">
          <p className="text-gray-700">{pin.description}</p>

          {/* Pin reactions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={() => handlePinReact("like")}
                className={
                  "flex items-center gap-1 " +
                  (myReaction === "like"
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-blue-600")
                }
              >
                <FaThumbsUp /> {likes}
              </button>
              <button
                onClick={() => handlePinReact("dislike")}
                className={
                  "flex items-center gap-1 " +
                  (myReaction === "dislike"
                    ? "text-red-600"
                    : "text-gray-500 hover:text-red-600")
                }
              >
                <FaThumbsDown /> {dislikes}
              </button>
            </div>
            <button
              onClick={() => setShowReport({ type: "pin", id: pinId })}
              className="flex items-center gap-1 hover:text-yellow-600"
            >
              <FaFlag /> Report
            </button>
          </div>

          {/* Comments */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Comments ({comments.length})
            </h3>
            <div className="max-h-64 overflow-y-auto space-y-4">
              {comments.map((c, idx) => (
                <div key={c.id} className="space-y-1">
                  <div className="flex items-start gap-3">
                    <img
                      src={c.author.avatar}
                      alt={c.author.name}
                      className="w-8 h-8 rounded-full mt-1"
                    />
                    <div className="flex-1 bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>{c.author.name}</span>
                        <span>{fmtDate(c.createdAt)}</span>
                      </div>
                      <p className="mt-1 text-gray-700 text-sm">{c.content}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-gray-500 text-sm pl-11">
                    <button
                      onClick={() => handleCommentReact(c.id, "like")}
                      className="flex items-center gap-1 hover:text-blue-600"
                    >
                      <FaThumbsUp size={16} /> {c.likes}
                    </button>
                    <button
                      onClick={() => handleCommentReact(c.id, "dislike")}
                      className="flex items-center gap-1 hover:text-red-600"
                    >
                      <FaThumbsDown size={16} /> {c.dislikes}
                    </button>
                    <FaFlag
                      onClick={() => setShowReport({ type: "comment", id: c.id })}
                      className="cursor-pointer hover:text-red-500"
                      size={14}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Add comment */}
            <form
              onSubmit={handleAddComment}
              className="flex items-start gap-3 mt-4"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full mt-1"
              />
              <div className="flex flex-1 items-center border border-gray-300 rounded-xl px-4 py-2 bg-white shadow-sm">
                <input
                  name="comment"
                  placeholder="Add a comment…"
                  className="flex-1 text-sm focus:outline-none bg-transparent"
                />
                <button
                  type="submit"
                  className="ms-2 text-blue-600 hover:text-blue-800"
                >
                  <FiSend size={18} />
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Report Popup */}
        {showReport && (
          <ReportPopup
            target={showReport}
            onCancel={() => setShowReport(null)}
            onSubmit={handleReport}
          />
        )}
      </div>
    </div>
  );
}
