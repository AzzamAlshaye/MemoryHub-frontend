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
<<<<<<< HEAD
import { IoIosSend } from "react-icons/io";
=======
import { FiSend } from "react-icons/fi";
import ReportPopup from "./ReportPopup";
>>>>>>> 93e70cd5f8b21071b6878c211b247201b14e35df

import ReportPopup from "./ReportPopup";
import { pinService } from "../../service/pinService";
import { commentService } from "../../service/commentService";
import { likeService } from "../../service/likeService";
import { reportService } from "../../service/reportService";
import { userService } from "../../service/userService";

<<<<<<< HEAD
export default function ViewPin({
  pinId,
  onClose,
  currentUser: propCurrentUser, 
}) {
=======
export default function ViewPin({ pinId, onClose, onShowLocation }) {
>>>>>>> 93e70cd5f8b21071b6878c211b247201b14e35df
  const [pin, setPin] = useState(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [myReaction, setMyReaction] = useState(null);
<<<<<<< HEAD
=======
  const [comments, setComments] = useState([]);
>>>>>>> 93e70cd5f8b21071b6878c211b247201b14e35df
  const [commentReactions, setCommentReactions] = useState({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showReport, setShowReport] = useState(null);
  const [currentUser, setCurrentUser] = useState(propCurrentUser);

 useEffect(() => {
    // Load current user from localStorage first (if available)
    const storedUserJson = localStorage.getItem("currentUser");
    if (storedUserJson) {
      try {
        const storedUser = JSON.parse(storedUserJson);
        setCurrentUser(storedUser);
      } catch {
        setCurrentUser(propCurrentUser);
      }
    } else {
      setCurrentUser(propCurrentUser);
    }
  }, [propCurrentUser]);

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

<<<<<<< HEAD
    pinService.get(pinId).then((data) => {
      setPin(data);
      setLikes(data.likes || 0);
      setDislikes(data.dislikes || 0);
      setCurrentIdx(0);
    });
    likeService
      .list("pin", pinId)
      .then(({ likes: l, dislikes: d }) => {
        setLikes(l);
        setDislikes(d);
      })
      .catch(console.error);

    likeService
      .getMyReaction("pin", pinId)
      .then((r) => setMyReaction(r?.type || null))
      .catch(() => setMyReaction(null));

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
        loadedComments.forEach((c) => {
          likeService
            .getMyReaction("comment", c.id)
            .then((r) =>
              setCommentReactions((prev) => ({
                ...prev,
                [c.id]: r?.type || null,
              }))
            )
            .catch(() => {});
        });
      })
      .catch(console.error);
=======
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

      let raw = await commentService.listByPin(pinId);
      if (canceled) return;
      const detailed = await Promise.all(
        raw.map(async (c) => {
          const cid = c.id || c._id;
          const [{ likes: cl, dislikes: cd }, cr] = await Promise.all([
            likeService.list("comment", cid),
            likeService.getMyReaction("comment", cid).catch(() => null),
          ]);
          const authorId =
            typeof c.author === "string" ? c.author : c.author?.id;
          const profile = await userService
            .getPublic(authorId)
            .catch(() => null);
          return {
            ...c,
            id: cid,
            likes: cl,
            dislikes: cd,
            myReaction: cr?.type || null,
            author: profile || {
              id: authorId,
              name: "",
              avatar: "/default-avatar.png",
            },
          };
        })
      );
      if (canceled) return;
      setComments(detailed);
    })();
    return () => {
      canceled = true;
    };
>>>>>>> 93e70cd5f8b21071b6878c211b247201b14e35df
  }, [pinId]);

  if (!pin) return null;

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

<<<<<<< HEAD
  const refreshPin = () => {
    likeService
      .list("pin", pinId)
      .then(({ likes: l, dislikes: d }) => {
        setLikes(l);
        setDislikes(d);
      })
      .catch(console.error);
  };

  const handlePinReact = (type) => {
    const isSameReaction = myReaction === type;
    const newType = isSameReaction ? null : type;

    likeService
      .create({ targetType: "pin", targetId: pinId, type: newType })
      .then(() => {
        setMyReaction(newType);

        setLikes((prev) => {
          if (type === "like") {
            if (isSameReaction) return prev - 1;
            else if (myReaction === "dislike") return prev + 1;
            else return prev + 1;
          }
          return prev;
        });

        setDislikes((prev) => {
          if (type === "dislike") {
            if (isSameReaction) return prev - 1;
            else if (myReaction === "like") return prev + 1;
            else return prev + 1;
          }
          return prev;
        });
      })
      .catch(console.error);
=======
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
>>>>>>> 93e70cd5f8b21071b6878c211b247201b14e35df
  };

  const handleCommentReact = (cid, type) => {
    const prev = commentReactions[cid];
<<<<<<< HEAD
    const newType = prev === type ? null : type;

    likeService
      .create({
        targetType: "comment",
        targetId: cid,
        type: newType || type,
      })
      .then(() =>
        likeService.list("comment", cid).then(({ likes, dislikes }) => {
          setComments((prev) =>
            prev.map((c) => (c.id === cid ? { ...c, likes, dislikes } : c))
          );
          setCommentReactions((prev) => ({
            ...prev,
            [cid]: newType,
          }));
        })
      )
      .catch(console.error);
  };

const handleAddComment = (e) => {
    e.preventDefault();
    const text = e.target.elements.comment.value.trim();
    if (!text) return;

    commentService
      .create({ pinId, text })
      .then((newComment) => {
        // Use currentUser state here to set author info
        const authorName = currentUser?.name || "You";
        const authorAvatar = currentUser?.avatar || "https://via.placeholder.com/40";

        const commentToAdd = {
          ...newComment,
          author: {
            name: authorName,
            avatar: authorAvatar,
          },
          likes: 0,
          dislikes: 0,
        };

        setComments((prev) => [commentToAdd, ...prev]);
        e.target.reset();
      })
      .catch(console.error);
  };

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

  const navigate = (step) =>
=======
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

  const handleAddComment = (e) => {
    e.preventDefault();
    const txt = e.target.comment.value.trim();
    if (!txt) return;
    commentService.create({ pinId, text: txt }).then((nc) => {
      setComments((cs) => [
        { ...nc, likes: 0, dislikes: 0, author: currentUser },
        ...cs,
      ]);
      e.target.reset();
    });
  };

  const navigateCarousel = (step) =>
>>>>>>> 93e70cd5f8b21071b6878c211b247201b14e35df
    setCurrentIdx((i) => (i + step + mediaItems.length) % mediaItems.length);
const displayName = pin.owner?.name || currentUser?.name || "Guest";
  const displayAvatar =
    pin.owner?.avatar || currentUser?.avatar || "https://via.placeholder.com/40";

  return (
<<<<<<< HEAD
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-30 backdrop-blur-sm p-4">
=======
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 hide-scrollbar">
>>>>>>> 93e70cd5f8b21071b6878c211b247201b14e35df
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <FaTimes size={24} />
        </button>

        {/* Header */}
<<<<<<< HEAD
        <header className="p-6 border-b">
          <h2 className="text-2xl font-sans">{pin.title}</h2>
=======
        <header className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold">{pin.title}</h2>
>>>>>>> 93e70cd5f8b21071b6878c211b247201b14e35df
          <div className="mt-4 flex items-center gap-3">
            <img
              src={displayAvatar}
              alt={displayName}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="text-sm text-gray-500">
<<<<<<< HEAD
              <p className="font-sans">{displayName}</p>
              <time dateTime={pin.createdAt}>{fmtDate(pin.createdAt)}</time>
=======
              <p className="font-medium">
                {pin.owner?.name || currentUser.name}
              </p>
              <time dateTime={pin.createdAt}>{fmt(pin.createdAt)}</time>
>>>>>>> 93e70cd5f8b21071b6878c211b247201b14e35df
            </div>
            <div className="ml-auto flex flex-wrap gap-2">
              <span className="px-3 py-1 text-xs bg-amber-200 text-amber-600 rounded-full">
                {pin.privacy}
              </span>
            </div>
          </div>
        </header>

        {/* Media */}
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
              aria-label="Previous media"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={() => navigateCarousel(1)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full"
              aria-label="Next media"
            >
              <FaChevronRight />
            </button>
          </div>
        )}

        {/* Body */}
        <section className="p-6 space-y-6">
          <p className="text-gray-700">{pin.description}</p>

<<<<<<< HEAD
=======
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
>>>>>>> 93e70cd5f8b21071b6878c211b247201b14e35df
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={() => handlePinReact("like")}
<<<<<<< HEAD
                className={
                  "flex items-center gap-1 " +
                  (myReaction === "like"
                    ? "text-blue-500"
                    : "text-gray-500 hover:text-blue-500")
                }
                aria-label="Like pin"
=======
                className={`flex items-center gap-1 ${
                  myReaction?.type === "like"
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-blue-600"
                }`}
>>>>>>> 93e70cd5f8b21071b6878c211b247201b14e35df
              >
                <FaThumbsUp /> {likes}
              </button>
              <button
                onClick={() => handlePinReact("dislike")}
<<<<<<< HEAD
                className={
                  "flex items-center gap-1 " +
                  (myReaction === "dislike"
                    ? "text-red-500"
                    : "text-gray-500 hover:text-red-500")
                }
                aria-label="Dislike pin"
=======
                className={`flex items-center gap-1 ${
                  myReaction?.type === "dislike"
                    ? "text-red-600"
                    : "text-gray-500 hover:text-red-600"
                }`}
>>>>>>> 93e70cd5f8b21071b6878c211b247201b14e35df
              >
                <FaThumbsDown /> {dislikes}
              </button>
            </div>
            <button
              onClick={() => setShowReport({ type: "pin", id: pinId })}
              className="flex text-gray-500 items-center gap-1 hover:text-yellow-500"
              aria-label="Report pin"
            >
              <FaFlag /> Report
            </button>
          </div>

          {/* Comments */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Comments ({comments.length})
            </h3>
            <div className="max-h-64 overflow-y-auto space-y-4" aria-live="polite">
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
<<<<<<< HEAD
                    <p className="mt-1 text-gray-700">{c.content}</p>
                    <div className="mt-2 flex justify-between items-center text-sm">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleCommentReact(c.id, "like")}
                          className={
                            "flex items-center gap-1 " +
                            (commentReactions[c.id] === "like"
                              ? "text-blue-600"
                              : "text-gray-500 hover:text-blue-600")
                          }
                          aria-label={`Like comment by ${c.author.name}`}
                        >
                          <FaThumbsUp /> {c.likes}
                        </button>
                        <button
                          onClick={() => handleCommentReact(c.id, "dislike")}
                          className={
                            "flex items-center gap-1 " +
                            (commentReactions[c.id] === "dislike"
                              ? "text-red-600"
                              : "text-gray-500 hover:text-red-600")
                          }
                          aria-label={`Dislike comment by ${c.author.name}`}
                        >
                          <FaThumbsDown /> {c.dislikes}
                        </button>
                      </div>
=======
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
>>>>>>> 93e70cd5f8b21071b6878c211b247201b14e35df
                      <button
                        onClick={() =>
                          setShowReport({ type: "comment", id: c.id })
                        }
<<<<<<< HEAD
                        className="flex items-center gap-1 text-gray-400 hover:text-yellow-600"
                        aria-label={`Report comment by ${c.author.name}`}
                      >
                        <FaFlag />
=======
                        className="hover:text-red-500"
                      >
                        <FaFlag size={14} />
>>>>>>> 93e70cd5f8b21071b6878c211b247201b14e35df
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Comment */}
            <form
              onSubmit={handleAddComment}
<<<<<<< HEAD
              className="mt-6 flex items-center gap-3 border-t pt-4"
            >
              <img
                src={currentUser?.avatar || "https://via.placeholder.com/40"}
                alt={currentUser?.name || "Guest"}
                className="w-9 h-9 rounded-full shadow-md"
              />
              <textarea
                name="comment"
                rows={1}
                placeholder="Write a comment..."
                className="flex-1 rounded-lg border border-gray-300 p-3 text-sm resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="Add a comment"
              />
              <button
                type="submit"
                className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
                title="Send"
                aria-label="Send comment"
              >
                <IoIosSend size={20} />
              </button>
=======
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
>>>>>>> 93e70cd5f8b21071b6878c211b247201b14e35df
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
