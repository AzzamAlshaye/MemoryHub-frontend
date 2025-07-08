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

import { pinService } from "../../service/pinService";
import { commentService } from "../../service/commentService";
import { likeService } from "../../service/likeService";
import { reportService } from "../../service/reportService";
import { userService } from "../../service/userService";

export default function ViewPin({ pinId, onClose }) {
  const [pin, setPin] = useState(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [myReaction, setMyReaction] = useState(null); // {id,type} or null
  const [comments, setComments] = useState([]); // each: { …, author:{id,name,avatar}, likes, dislikes }
  const [commentReactions, setCommentReactions] = useState({}); // { [cid]: {id,type}|null }
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showReport, setShowReport] = useState(null);

  // load current user profile for avatar/name in the comment form
  const [currentUser, setCurrentUser] = useState({
    id: "",
    name: "You",
    avatar: "https://via.placeholder.com/40",
  });
  useEffect(() => {
    userService
      .getCurrentUser()
      .then((u) => setCurrentUser(u))
      .catch(() => {
        /* keep placeholder */
      });
  }, []);

  // helper to refresh pin counts
  const refreshPinCounts = () =>
    likeService
      .list("pin", pinId)
      .then(({ likes: l, dislikes: d }) => {
        setLikes(l);
        setDislikes(d);
      })
      .catch(console.error);

  // helper to refresh one comment's counts
  const refreshCommentCounts = (cid) =>
    likeService
      .list("comment", cid)
      .then(({ likes: l, dislikes: d }) => {
        setComments((cs) =>
          cs.map((c) => (c.id === cid ? { ...c, likes: l, dislikes: d } : c))
        );
      })
      .catch(console.error);

  // main data-loading effect
  useEffect(() => {
    if (!pinId) return;
    let cancelled = false;

    (async () => {
      try {
        // 1) Pin details
        const data = await pinService.get(pinId);
        if (cancelled) return;
        setPin(data);

        // 2) My pin reaction
        const me = await likeService
          .getMyReaction("pin", pinId)
          .catch(() => null);
        if (cancelled) return;
        setMyReaction(me);

        // 3) True pin counts
        const { likes: l, dislikes: d } = await likeService.list("pin", pinId);
        if (cancelled) return;
        setLikes(l);
        setDislikes(d);

        // 4) Load comments and fetch commenter public profiles
        const cs = await commentService.listByPin(pinId);
        if (cancelled) return;
        let loaded = cs.map((c) => {
          const authorId =
            typeof c.author === "string" ? c.author : c.author?.id;
          return {
            ...c,
            likes: c.likes ?? 0,
            dislikes: c.dislikes ?? 0,
            author: { id: authorId, name: "", avatar: "" },
          };
        });

        // fetch all unique authors
        const authorIds = Array.from(new Set(loaded.map((c) => c.author.id)));
        const users = await Promise.all(
          authorIds.map((uid) => userService.getPublic(uid).catch(() => null))
        );
        const userMap = users.reduce((acc, u) => {
          if (u) acc[u.id] = u;
          return acc;
        }, {});

        // merge author info
        loaded = loaded.map((c) => ({
          ...c,
          author: userMap[c.author.id] || c.author,
        }));
        if (cancelled) return;
        setComments(loaded);

        // 5) For each comment, load my reaction + true counts
        for (const c of loaded) {
          const r = await likeService
            .getMyReaction("comment", c.id)
            .catch(() => null);
          if (cancelled) return;
          setCommentReactions((prev) => ({ ...prev, [c.id]: r }));

          const { likes: cl, dislikes: cd } = await likeService.list(
            "comment",
            c.id
          );
          if (cancelled) return;
          setComments((cs2) =>
            cs2.map((x) =>
              x.id === c.id ? { ...x, likes: cl, dislikes: cd } : x
            )
          );
        }
      } catch (err) {
        console.error("ViewPin load error:", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pinId]);

  if (!pin) return null;

  // build media carousel array
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

  // pin like/dislike handler
  const handlePinReact = (type) => {
    if (myReaction?.type === type) {
      likeService.remove(myReaction.id).catch(console.error);
      setMyReaction(null);
      refreshPinCounts();
      return;
    }
    const create = () =>
      likeService
        .create({ targetType: "pin", targetId: pinId, type })
        .then((nr) => {
          setMyReaction(nr);
          refreshPinCounts();
        })
        .catch(console.error);
    if (myReaction) {
      likeService.remove(myReaction.id).then(create).catch(console.error);
      return;
    }
    create();
  };

  // comment like/dislike handler
  const handleCommentReact = (cid, type) => {
    const prev = commentReactions[cid];
    if (prev?.type === type) {
      likeService.remove(prev.id).catch(console.error);
      setCommentReactions((cr) => ({ ...cr, [cid]: null }));
      refreshCommentCounts(cid);
      return;
    }
    const create = () =>
      likeService
        .create({ targetType: "comment", targetId: cid, type })
        .then((nr) => {
          setCommentReactions((cr) => ({ ...cr, [cid]: nr }));
          refreshCommentCounts(cid);
        })
        .catch(console.error);
    if (prev) {
      likeService.remove(prev.id).then(create).catch(console.error);
      return;
    }
    create();
  };

  // add new comment
  const handleAddComment = (e) => {
    e.preventDefault();
    const text = e.target.elements.comment.value.trim();
    if (!text) return;
    commentService
      .create({ pinId, text })
      .then((nc) => {
        setComments((cs) => [
          {
            ...nc,
            likes: 0,
            dislikes: 0,
            author: {
              id: currentUser.id,
              name: currentUser.name,
              avatar: currentUser.avatar,
            },
          },
          ...cs,
        ]);
        e.target.reset();
      })
      .catch(console.error);
  };

  // report handler
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

  // carousel navigation
  const navigateCarousel = (step) =>
    setCurrentIdx((i) => (i + step + mediaItems.length) % mediaItems.length);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes size={24} />
        </button>

        {/* HEADER */}
        <header className="p-6 border-b">
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
              <time dateTime={pin.createdAt}>{fmtDate(pin.createdAt)}</time>
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

        {/* MEDIA CAROUSEL */}
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

        {/* BODY */}
        <section className="p-6 space-y-6">
          <p className="text-gray-700">{pin.description}</p>

          <div className="flex items-start gap-4 p-4 bg-white border rounded-lg">
            <FaLocationDot className="text-red-500 text-2xl" />
            <div>
              <p className="font-medium">{pin.location.name}</p>
              <p className="text-sm text-gray-500">{pin.location.address}</p>
            </div>
          </div>

          {/* PIN REACTIONS */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={() => handlePinReact("like")}
                className={
                  "flex items-center gap-1 " +
                  (myReaction?.type === "like"
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
                  (myReaction?.type === "dislike"
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

          {/* COMMENTS */}
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
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{c.author.name}</p>
                      <time
                        className="text-xs text-gray-500"
                        dateTime={c.createdAt}
                      >
                        {fmtDate(c.createdAt)}
                      </time>
                    </div>
                    <p className="mt-1 text-gray-700">{c.content}</p>
                    <div className="mt-2 flex items-center gap-4">
                      <button
                        onClick={() => handleCommentReact(c.id, "like")}
                        className={
                          "flex items-center gap-1 " +
                          (commentReactions[c.id]?.type === "like"
                            ? "text-blue-600"
                            : "text-gray-500 hover:text-blue-600")
                        }
                      >
                        <FaThumbsUp /> {c.likes}
                      </button>
                      <button
                        onClick={() => handleCommentReact(c.id, "dislike")}
                        className={
                          "flex items-center gap-1 " +
                          (commentReactions[c.id]?.type === "dislike"
                            ? "text-red-600"
                            : "text-gray-500 hover:text-red-600")
                        }
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

            {/* ADD COMMENT */}
            <form
              onSubmit={handleAddComment}
              className="mt-6 flex gap-3 border-t pt-4"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover"
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

        {/* REPORT POPUP */}
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
