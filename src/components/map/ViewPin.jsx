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
import { userService } from "../../service/userService";

export default function ViewPin({ pinId, onClose, onShowLocation }) {
  const [pin, setPin] = useState(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [myReaction, setMyReaction] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentReactions, setCommentReactions] = useState({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showReport, setShowReport] = useState(null);

  const [currentUser, setCurrentUser] = useState({
    id: "",
    name: "You",
    avatar: "/default-avatar.png",
  });
  useEffect(() => {
    userService
      .getCurrentUser()
      .then(setCurrentUser)
      .catch(() => {});
  }, []);

  // Refresh counts
  const refreshPinCounts = () =>
    likeService.list("pin", pinId).then(({ likes: l, dislikes: d }) => {
      setLikes(l);
      setDislikes(d);
    });
  const refreshCommentCounts = (cid) =>
    likeService.list("comment", cid).then(({ likes: l, dislikes: d }) => {
      setComments((cs) =>
        cs.map((c) => (c.id === cid ? { ...c, likes: l, dislikes: d } : c))
      );
    });

  // Load pin + comments
  useEffect(() => {
    if (!pinId) return;
    let canceled = false;

    (async () => {
      // 1) load pin and its reactions
      const data = await pinService.get(pinId);
      if (canceled) return;
      setPin(data);

      const me = await likeService
        .getMyReaction("pin", pinId)
        .catch(() => null);
      if (canceled) return;
      setMyReaction(me);

      const { likes: l, dislikes: d } = await likeService.list("pin", pinId);
      if (canceled) return;
      setLikes(l);
      setDislikes(d);

      // 2) load comments
      const raw = await commentService.listByPin(pinId);
      if (canceled) return;
      const detailed = await Promise.all(
        raw.map(async (c) => {
          const cid = c.id || c._id;
          const [{ likes: cl, dislikes: cd }, cr] = await Promise.all([
            likeService.list("comment", cid),
            likeService.getMyReaction("comment", cid).catch(() => null),
          ]);

          // figure out the author ID regardless of shape
          const authorId =
            typeof c.author === "string"
              ? c.author
              : c.author?.id || c.author?._id;

          // try to fetch public profile
          let profile = null;
          try {
            profile = await userService.getPublic(authorId);
          } catch {
            // if this is your own comment, reuse currentUser
            if (authorId === currentUser.id) {
              profile = currentUser;
            }
          }

          // fallback to any name/avatar the raw payload carried
          const fallback = {
            id: authorId,
            name: c.author?.name || "",
            avatar: c.author?.avatar || "/default-avatar.png",
          };

          return {
            ...c,
            id: cid,
            likes: cl,
            dislikes: cd,
            myReaction: cr?.type || null,
            author: profile || fallback,
          };
        })
      );
      if (canceled) return;
      setComments(detailed);
    })();

    return () => {
      canceled = true;
    };
  }, [pinId, currentUser.id]);

  if (!pin) return null;

  // build media carousel
  const images = Array.isArray(pin.media?.images)
    ? pin.media.images.map((i) => (typeof i === "string" ? i : i.url))
    : [];
  const rawV = pin.media?.video;
  const videoUrl = rawV && (typeof rawV === "string" ? rawV : rawV.url);
  const mediaItems = [
    ...(videoUrl ? [{ type: "video", url: videoUrl }] : []),
    ...images.map((url) => ({ type: "image", url })),
  ];

  const fmt = (iso) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  // pin reaction handlers
  const handlePinReact = (type) => {
    if (myReaction?.type === type) {
      likeService.remove(myReaction.id).then(() => {
        setMyReaction(null);
        refreshPinCounts();
      });
      return;
    }
    const doCreate = () =>
      likeService
        .create({ targetType: "pin", targetId: pinId, type })
        .then((nr) => {
          setMyReaction(nr);
          refreshPinCounts();
        });
    if (myReaction) {
      likeService.remove(myReaction.id).then(doCreate);
    } else {
      doCreate();
    }
  };

  // comment reaction handlers
  const handleCommentReact = (cid, type) => {
    const prev = commentReactions[cid];
    if (prev?.type === type) {
      likeService.remove(prev.id).then(() => {
        setCommentReactions((cr) => ({ ...cr, [cid]: null }));
        refreshCommentCounts(cid);
      });
      return;
    }
    const doCreate = () =>
      likeService
        .create({ targetType: "comment", targetId: cid, type })
        .then((nr) => {
          setCommentReactions((cr) => ({ ...cr, [cid]: nr }));
          refreshCommentCounts(cid);
        });
    if (prev) {
      likeService.remove(prev.id).then(doCreate);
    } else {
      doCreate();
    }
  };

  // add new comment
  const handleAddComment = (e) => {
    e.preventDefault();
    const txt = e.target.comment.value.trim();
    if (!txt) return;
    commentService.create({ pinId, text: txt }).then((nc) => {
      const newComment = {
        ...nc,
        id: nc.id || nc._id,
        likes: 0,
        dislikes: 0,
        myReaction: null,
        author: currentUser,
      };
      setComments((cs) => [newComment, ...cs]);
      e.target.reset();
    });
  };

  const navigateCarousel = (step) =>
    setCurrentIdx((i) => (i + step + mediaItems.length) % mediaItems.length);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 hide-scrollbar">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes size={24} />
        </button>

        {/* Header */}
        <header className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold">{pin.title}</h2>
          <div className="mt-4 flex items-center gap-3">
            <img
              src={pin.owner?.avatar || currentUser.avatar}
              alt={pin.owner?.name || currentUser.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="text-sm text-gray-500">
              <p className="font-medium">
                {pin.owner?.name || currentUser.name}
              </p>
              <time dateTime={pin.createdAt}>{fmt(pin.createdAt)}</time>
            </div>
            <div className="ml-auto flex flex-wrap gap-2">
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
            <button
              onClick={() => navigateCarousel(-1)}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={() => navigateCarousel(1)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full"
            >
              <FaChevronRight />
            </button>
          </div>
        )}

        {/* Body */}
        <section className="p-6 space-y-6">
          <p className="text-gray-700">{pin.description}</p>

          {/* CLICKABLE LOCATION CARD */}
          <div
            onClick={() =>
              onShowLocation({
                lat: pin.location.lat,
                lng: pin.location.lng,
              })
            }
            className="flex items-start gap-4 p-4 bg-white border border-gray-100 rounded-lg cursor-pointer hover:bg-gray-50 transition"
          >
            <FaLocationDot className="text-red-500 text-2xl" />
            <div>
              <p className="font-medium">{pin.location.name}</p>
              <p className="text-sm text-gray-500">{pin.location.address}</p>
              <p className="mt-1 text-xs text-gray-400 italic">
                Click here to jump to this pin on the map
              </p>
            </div>
          </div>

          {/* Pin reactions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={() => handlePinReact("like")}
                className={`flex items-center gap-1 ${
                  myReaction?.type === "like"
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-blue-600"
                }`}
              >
                <FaThumbsUp /> {likes}
              </button>
              <button
                onClick={() => handlePinReact("dislike")}
                className={`flex items-center gap-1 ${
                  myReaction?.type === "dislike"
                    ? "text-red-600"
                    : "text-gray-500 hover:text-red-600"
                }`}
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
              {comments.map((c) => (
                <div key={c.id} className="flex items-start gap-3">
                  <img
                    src={c.author.avatar}
                    alt={c.author.name}
                    className="w-8 h-8 rounded-full object-cover mt-1"
                  />
                  <div className="flex-1 bg-white border border-white-theme px-4 py-2 rounded-xl shadow-sm relative">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{c.author.name}</span>
                      <span>{fmt(c.createdAt)}</span>
                    </div>
                    <p className="mt-1 text-gray-700 text-sm">{c.content}</p>
                    <div className="absolute bottom-2 right-4 flex items-center gap-4 text-sm text-gray-500">
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
                      <button
                        onClick={() =>
                          setShowReport({ type: "comment", id: c.id })
                        }
                        className="hover:text-red-500"
                      >
                        <FaFlag size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Comment */}
            <form
              onSubmit={handleAddComment}
              className="mt-6 flex gap-3 items-start"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover mt-1"
              />
              <div className="flex flex-1 items-center border border-gray-300 rounded-xl px-4 py-2 bg-white shadow-sm">
                <input
                  name="comment"
                  placeholder="Add a comment…"
                  className="flex-1 text-sm focus:outline-none bg-transparent"
                />
                <button type="submit" className="ms-2">
                  <FiSend
                    size={18}
                    className="text-blue-600 hover:text-blue-800"
                  />
                </button>
              </div>
            </form>
          </div>
        </section>

        {showReport && (
          <ReportPopup
            target={showReport}
            onCancel={() => setShowReport(null)}
            onSubmit={(data) => {
              reportService
                .create({
                  targetType: showReport.type,
                  targetId: showReport.id,
                  ...data,
                })
                .then(() => setShowReport(null));
            }}
          />
        )}
      </div>
    </div>
  );
}
