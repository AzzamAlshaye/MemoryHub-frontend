// src/pages/user/GroupPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { IoIosArrowBack } from "react-icons/io";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaFlag,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { FiSend } from "react-icons/fi";

import { useAuth } from "../../../context/AuthContext";
import ReportPopup from "../../../components/map/ReportPopup";
import { groupService } from "../../../service/groupService";
import { pinService } from "../../../service/pinService";
import { commentService } from "../../../service/commentService";
import { likeService } from "../../../service/likeService";
import { reportService } from "../../../service/reportService";
import { userService } from "../../../service/userService";

export default function GroupPage() {
  const { user: authUser } = useAuth() || {};
  const navigate = useNavigate();
  const { groupId } = useParams();

  const defaultAvatar = "/default-avatar.png";
  const defaultGroupAvatar = "/default-group.png";

  const [group, setGroup] = useState(null);
  const [pins, setPins] = useState([]);
  const [showReport, setShowReport] = useState(null);
  const [currentUser, setCurrentUser] = useState({
    id: "",
    name: "You",
    avatar: defaultAvatar,
  });
  const [currentIndexes, setCurrentIndexes] = useState({});

  // 1) Load current user
  useEffect(() => {
    userService
      .getCurrentUser()
      .then(setCurrentUser)
      .catch(() => {});
  }, []);

  // 2) Load group + pins + comments (with special-case for your own comments)
  useEffect(() => {
    if (!groupId) return;

    groupService.get(groupId).then(setGroup).catch(console.error);

    pinService
      .list("group", "", groupId)
      .then(async (rawPins) => {
        const detailed = await Promise.all(
          rawPins.map(async (pin) => {
            // a) pin reaction counts
            const [counts, me] = await Promise.all([
              likeService.list("pin", pin._id),
              likeService.getMyReaction("pin", pin._id).catch(() => null),
            ]);

            // b) load raw comments
            const comments = await commentService.listByPin(pin._id);

            // c) collect every author ID (string or object._id)
            const authorIds = Array.from(
              new Set(
                comments.map((c) =>
                  typeof c.author === "string"
                    ? c.author
                    : c.author?.id || c.author?._id
                )
              )
            );

            // d) batch-fetch public profiles
            const users = await Promise.all(
              authorIds.map((id) => userService.getPublic(id).catch(() => null))
            );
            const userMap = users.reduce((m, u) => {
              if (u) m[u.id] = u;
              return m;
            }, {});

            // e) build detailed comments
            const detailedComments = await Promise.all(
              comments.map(async (c) => {
                const cid = c.id || c._id;
                const [{ likes: cl, dislikes: cd }, cr] = await Promise.all([
                  likeService.list("comment", cid),
                  likeService.getMyReaction("comment", cid).catch(() => null),
                ]);

                // robust author ID
                const authorId =
                  typeof c.author === "string"
                    ? c.author
                    : c.author?.id || c.author?._id;

                // special-case: if this is your own comment, use in-memory currentUser
                let profile;
                if (authorId === currentUser.id) {
                  profile = currentUser;
                } else {
                  profile = userMap[authorId] || {
                    id: authorId,
                    name: c.author?.name || "",
                    avatar: c.author?.avatar || defaultAvatar,
                  };
                }

                return {
                  ...c,
                  id: cid,
                  likes: cl,
                  dislikes: cd,
                  myReaction: cr?.type || cr,
                  author: profile,
                };
              })
            );

            return {
              ...pin,
              likes: counts.likes,
              dislikes: counts.dislikes,
              myReaction: me,
              comments: detailedComments,
            };
          })
        );

        setPins(detailed);
      })
      .catch(console.error);
  }, [groupId, currentUser.id]);

  // 3) Helpers to refresh counts
  const refreshPin = (pid) =>
    likeService.list("pin", pid).then(({ likes, dislikes }) => {
      setPins((prev) =>
        prev.map((p) => (p._id === pid ? { ...p, likes, dislikes } : p))
      );
    });

  const refreshCommentCounts = (pid, cid) =>
    likeService.list("comment", cid).then(({ likes, dislikes }) => {
      setPins((prev) =>
        prev.map((p) => {
          if (p._id !== pid) return p;
          return {
            ...p,
            comments: p.comments.map((c) =>
              c.id === cid ? { ...c, likes, dislikes } : c
            ),
          };
        })
      );
    });

  // 4) Carousel slide handler
  const handleSlide = (pid, step, len) => {
    const idx = currentIndexes[pid] || 0;
    setCurrentIndexes((ci) => ({
      ...ci,
      [pid]: (idx + step + len) % len,
    }));
  };

  // 5) Pin reaction handler
  const handlePinReact = (pid, type) => {
    const pin = pins.find((p) => p._id === pid);
    const prev = pin.myReaction;
    if (prev?.type === type) {
      likeService.remove(prev.id).then(() => {
        setPins((pps) =>
          pps.map((p) => (p._id === pid ? { ...p, myReaction: null } : p))
        );
        refreshPin(pid);
      });
    } else {
      const create = () =>
        likeService
          .create({ targetType: "pin", targetId: pid, type })
          .then((nr) => {
            setPins((pps) =>
              pps.map((p) => (p._id === pid ? { ...p, myReaction: nr } : p))
            );
            refreshPin(pid);
          });
      prev ? likeService.remove(prev.id).then(create) : create();
    }
  };

  // 6) Comment reaction handler
  const handleCommentReact = (pid, cid, type) => {
    const pin = pins.find((p) => p._id === pid);
    const comment = pin.comments.find((c) => c.id === cid);
    const prev = comment.myReaction;
    if (prev?.type === type) {
      likeService.remove(prev.id).then(() => {
        setPins((pps) =>
          pps.map((p) =>
            p._id === pid
              ? {
                  ...p,
                  comments: p.comments.map((c) =>
                    c.id === cid ? { ...c, myReaction: null } : c
                  ),
                }
              : p
          )
        );
        refreshCommentCounts(pid, cid);
      });
    } else {
      const create = () =>
        likeService
          .create({ targetType: "comment", targetId: cid, type })
          .then((nr) => {
            setPins((pps) =>
              pps.map((p) =>
                p._id === pid
                  ? {
                      ...p,
                      comments: p.comments.map((c) =>
                        c.id === cid ? { ...c, myReaction: nr } : c
                      ),
                    }
                  : p
              )
            );
            refreshCommentCounts(pid, cid);
          });
      prev ? likeService.remove(prev.id).then(create) : create();
    }
  };

  // 7) Add comment (now assigns an explicit id + your currentUser)
  const handleAddComment = (pid, e) => {
    e.preventDefault();
    const text = e.target.comment.value.trim();
    if (!text) return;
    commentService
      .create({ pinId: pid, text })
      .then((nc) => {
        const cid = nc.id || nc._id;
        const c = {
          ...nc,
          id: cid,
          likes: 0,
          dislikes: 0,
          myReaction: null,
          author: currentUser,
        };
        setPins((pps) =>
          pps.map((p) =>
            p._id === pid ? { ...p, comments: [c, ...p.comments] } : p
          )
        );
        e.target.reset();
      })
      .catch(console.error);
  };

  if (!group) return null;

  return (
    <div className="bg-white-theme min-h-screen py-6 px-4 md:px-8 lg:px-16 space-y-8">
      {/* Group Header */}
      <div className="max-w-4xl mx-auto flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-black"
        >
          <IoIosArrowBack size={24} />
        </button>
        <div
          onClick={() => navigate(`/group/${groupId}/info`)}
          className="flex items-center gap-4 cursor-pointer flex-1"
        >
          <img
            src={group.avatar || defaultGroupAvatar}
            alt={group.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-gray-800">
              {group.name}
            </h1>
            <p className="text-sm text-gray-500">
              {group.members?.length || 0} members
            </p>
            {group.description && (
              <p className="mt-1 text-gray-700">{group.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Pins List */}
      <div className="max-w-4xl mx-auto space-y-6">
        {pins.map((pin) => {
          const media = [
            ...(pin.media?.video
              ? [{ type: "video", url: pin.media.video }]
              : []),
            ...(Array.isArray(pin.media?.images)
              ? pin.media.images.map((url) => ({ type: "image", url }))
              : []),
          ];
          const idx = currentIndexes[pin._id] || 0;

          return (
            <div
              key={pin._id}
              className="bg-white rounded-xl shadow overflow-hidden"
            >
              {/* Pin Header */}
              <div className="p-4 flex items-center gap-4">
                <img
                  src={pin.owner.avatar || defaultAvatar}
                  alt={pin.owner.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {pin.title}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {pin.owner.name} ·{" "}
                    {new Date(pin.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <FaFlag
                  onClick={() => setShowReport({ type: "pin", id: pin._id })}
                  className="text-gray-400 hover:text-red-500 cursor-pointer"
                />
              </div>

              {/* Media Carousel */}
              {media.length > 0 && (
                <div className="relative bg-neutral-100">
                  <div className="w-full aspect-video">
                    {media[idx].type === "image" ? (
                      <img
                        src={media[idx].url}
                        alt={`Slide ${idx + 1}`}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <video
                        controls
                        src={media[idx].url}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {media.length > 1 && (
                    <>
                      <button
                        onClick={() => handleSlide(pin._id, -1, media.length)}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white bg-neutral-600 p-1 rounded-2xl text-xl hover:scale-110 transition"
                      >
                        <FaChevronLeft />
                      </button>
                      <button
                        onClick={() => handleSlide(pin._id, 1, media.length)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-neutral-600 p-1 rounded-2xl text-xl hover:scale-110 transition"
                      >
                        <FaChevronRight />
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Content & Actions */}
              <div className="p-4 space-y-4">
                {pin.description && (
                  <p className="text-gray-700">{pin.description}</p>
                )}
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => handlePinReact(pin._id, "like")}
                    className={`flex items-center gap-1 ${
                      pin.myReaction?.type === "like"
                        ? "text-blue-600"
                        : "text-gray-500 hover:text-blue-600"
                    }`}
                  >
                    <FaThumbsUp /> {pin.likes}
                  </button>
                  <button
                    onClick={() => handlePinReact(pin._id, "dislike")}
                    className={`flex items-center gap-1 ${
                      pin.myReaction?.type === "dislike"
                        ? "text-red-600"
                        : "text-gray-500 hover:text-red-600"
                    }`}
                  >
                    <FaThumbsDown /> {pin.dislikes}
                  </button>
                </div>
                <span className="text-sm text-gray-400">{pin.privacy}</span>

                {/* Comments */}
                <h4 className="text-sm font-medium text-gray-600">
                  Comments ({pin.comments.length})
                </h4>
                <div className="max-h-64 overflow-y-auto space-y-4">
                  {pin.comments.map((c) => (
                    <div key={c.id} className="flex items-start gap-3">
                      <img
                        src={c.author.avatar || defaultAvatar}
                        alt={c.author.name}
                        className="w-8 h-8 rounded-full mt-1 object-cover"
                      />
                      <div className="flex-1 bg-white border border-white-theme px-4 py-2 rounded-xl shadow-sm">
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>{c.author.name}</span>
                          <span>
                            {new Date(c.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mt-1 text-gray-700 text-sm">
                          {c.content}
                        </p>
                        <div className="mt-2 flex items-center gap-4 text-gray-500 text-sm">
                          <button
                            onClick={() =>
                              handleCommentReact(pin._id, c.id, "like")
                            }
                            className="flex items-center gap-1 hover:text-blue-600"
                          >
                            <FaThumbsUp size={16} /> {c.likes}
                          </button>
                          <button
                            onClick={() =>
                              handleCommentReact(pin._id, c.id, "dislike")
                            }
                            className="flex items-center gap-1 hover:text-red-600"
                          >
                            <FaThumbsDown size={16} /> {c.dislikes}
                          </button>
                          <FaFlag
                            onClick={() =>
                              setShowReport({ type: "comment", id: c.id })
                            }
                            className="cursor-pointer hover:text-red-500"
                            size={14}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Comment */}
                <form
                  onSubmit={(e) => handleAddComment(pin._id, e)}
                  className="flex items-start gap-3 mt-4"
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
            </div>
          );
        })}
      </div>

      {showReport && (
        <ReportPopup
          target={showReport}
          onCancel={() => setShowReport(null)}
          onSubmit={({ reason, description }) =>
            reportService
              .create({
                targetType: showReport.type,
                targetId: showReport.id,
                reason: reason.trim(),
                ...(description.trim() && { description: description.trim() }),
              })
              .then(() => setShowReport(null))
          }
        />
      )}
    </div>
  );
}
