// src/pages/user/GroupPage.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { IoIosArrowBack } from "react-icons/io";
import { FaThumbsUp, FaThumbsDown, FaFlag } from "react-icons/fa";

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

  // load current user profile
  const [currentUser, setCurrentUser] = useState({
    id: "",
    name: "You",
    avatar: defaultAvatar,
  });
  useEffect(() => {
    userService
      .getCurrentUser()
      .then(setCurrentUser)
      .catch(() => {});
  }, []);

  // helpers
  const refreshPin = (pid) =>
    likeService
      .list("pin", pid)
      .then(({ likes, dislikes }) =>
        setPins((prev) =>
          prev.map((p) => (p._id === pid ? { ...p, likes, dislikes } : p))
        )
      )
      .catch(console.error);

  const refreshComment = (pid, cid) =>
    likeService
      .list("comment", cid)
      .then(({ likes, dislikes }) =>
        setPins((prev) =>
          prev.map((p) =>
            p._id !== pid
              ? p
              : {
                  ...p,
                  comments: p.comments.map((c) =>
                    c.id === cid ? { ...c, likes, dislikes } : c
                  ),
                }
          )
        )
      )
      .catch(console.error);

  // load group + pins + comments + public author info
  useEffect(() => {
    if (!groupId) return;

    groupService.get(groupId).then(setGroup).catch(console.error);

    pinService
      .list("group", "", groupId)
      .then(async (rawPins) => {
        const detailed = await Promise.all(
          rawPins.map(async (pin) => {
            // pin reaction + counts
            const me = await likeService
              .getMyReaction("pin", pin._id)
              .catch(() => null);
            const myReaction = me?.type || null;
            const { likes, dislikes } = await likeService.list("pin", pin._id);

            // load raw comments
            let comments = await commentService.listByPin(pin._id);

            // extract author IDs
            const authorIds = Array.from(
              new Set(
                comments.map((c) =>
                  typeof c.author === "string" ? c.author : c.author?.id
                )
              )
            );
            // fetch each profile publicly
            const users = await Promise.all(
              authorIds.map((id) => userService.getPublic(id).catch(() => null))
            );
            const userMap = users.reduce((map, u) => {
              if (u) map[u.id] = u;
              return map;
            }, {});

            // load each comment’s reaction+counts and merge public author
            comments = await Promise.all(
              comments.map(async (c) => {
                const cid = c.id || c._id;
                const cr = await likeService
                  .getMyReaction("comment", cid)
                  .catch(() => null);
                const { likes: cl, dislikes: cd } = await likeService.list(
                  "comment",
                  cid
                );
                const authorId =
                  typeof c.author === "string" ? c.author : c.author?.id;
                const author = userMap[authorId] || {
                  id: authorId,
                  name: "",
                  avatar: defaultAvatar,
                };
                return {
                  ...c,
                  id: cid,
                  likes: cl,
                  dislikes: cd,
                  myReaction: cr?.type || null,
                  author,
                };
              })
            );

            return {
              ...pin,
              likes,
              dislikes,
              myReaction,
              comments,
            };
          })
        );
        setPins(detailed);
      })
      .catch(console.error);
  }, [groupId]);

  // handlers (unchanged logic for toggles and posting)
  const handlePinReact = (pid, prev, type) => {
    const nt = prev === type ? null : type;
    likeService
      .create({ targetType: "pin", targetId: pid, type: nt || type })
      .then(() => {
        setPins((prev) =>
          prev.map((p) => (p._id === pid ? { ...p, myReaction: nt } : p))
        );
        refreshPin(pid);
      })
      .catch(console.error);
  };

  const handleCommentReact = (pid, cid, prev, type) => {
    const nt = prev === type ? null : type;
    likeService
      .create({
        targetType: "comment",
        targetId: cid,
        type: nt || type,
      })
      .then(() => {
        setPins((prev) =>
          prev.map((p) =>
            p._id !== pid
              ? p
              : {
                  ...p,
                  comments: p.comments.map((c) =>
                    c.id === cid ? { ...c, myReaction: nt } : c
                  ),
                }
          )
        );
        refreshComment(pid, cid);
      })
      .catch(console.error);
  };

  const handleAddComment = (pid, e) => {
    e.preventDefault();
    const text = e.target.elements.comment.value.trim();
    if (!text) return;

    commentService
      .create({ pinId: pid, text })
      .then((nc) => {
        const newComment = {
          ...nc,
          id: nc.id || nc._id,
          likes: 0,
          dislikes: 0,
          myReaction: null,
          author: {
            id: currentUser.id,
            name: currentUser.name,
            avatar: currentUser.avatar,
          },
        };
        setPins((prev) =>
          prev.map((p) =>
            p._id === pid ? { ...p, comments: [newComment, ...p.comments] } : p
          )
        );
        e.target.reset();
      })
      .catch(console.error);
  };

  const handleReport = ({ reason, description }) => {
    if (!showReport || !reason.trim()) return;
    reportService
      .create({
        targetType: showReport.type,
        targetId: showReport.id,
        reason: reason.trim(),
        ...(description?.trim() && { description: description.trim() }),
      })
      .then(() => setShowReport(null))
      .catch(console.error);
  };

  if (!group) return null;

  return (
    <div className="bg-[#FEFCFB] min-h-screen py-6 px-4 md:px-8 lg:px-16 space-y-8">
      {/* Header */}
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

      {/* Pins */}
      <div className="max-w-4xl mx-auto space-y-6">
        {pins.map((pin) => (
          <div
            key={pin._id}
            className="bg-white rounded-xl shadow p-6 space-y-4"
          >
            {/* Pin header */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <img
                  src={pin.owner.avatar || defaultAvatar}
                  alt={pin.owner.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold text-gray-800">
                    {pin.owner.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(pin.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <FaFlag
                onClick={() => setShowReport({ type: "pin", id: pin._id })}
                className="text-gray-400 hover:text-red-500 cursor-pointer"
              />
            </div>

            {/* Media */}
            {(pin.media.video || pin.media.images?.[0]) && (
              <div className="w-full aspect-video rounded-lg overflow-hidden">
                {pin.media.video ? (
                  <video
                    controls
                    src={
                      typeof pin.media.video === "string"
                        ? pin.media.video
                        : pin.media.video.url
                    }
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={pin.media.images[0]}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            )}

            {/* Title/Description */}
            <div>
              <h2 className="text-lg font-medium text-gray-800">{pin.title}</h2>
              {pin.description && (
                <p className="text-gray-700">{pin.description}</p>
              )}
            </div>

            {/* Reactions */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => handlePinReact(pin._id, pin.myReaction, "like")}
                className={`flex items-center gap-1 ${
                  pin.myReaction === "like"
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-blue-600"
                }`}
              >
                <FaThumbsUp /> {pin.likes}
              </button>
              <button
                onClick={() =>
                  handlePinReact(pin._id, pin.myReaction, "dislike")
                }
                className={`flex items-center gap-1 ${
                  pin.myReaction === "dislike"
                    ? "text-red-600"
                    : "text-gray-500 hover:text-red-600"
                }`}
              >
                <FaThumbsDown /> {pin.dislikes}
              </button>
            </div>

            <hr className="border-gray-200" />

            {/* Comments */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-600">
                Comments ({pin.comments.length})
              </h4>
              <div className="max-h-48 overflow-y-auto space-y-4">
                {pin.comments.map((c) => (
                  <div key={c.id} className="flex items-start gap-3">
                    <img
                      src={c.author.avatar || defaultAvatar}
                      alt={c.author.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>{c.author.name}</span>
                        <span>{new Date(c.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="mt-1 text-gray-700">{c.content}</p>
                      <div className="mt-2 flex items-center gap-4">
                        <button
                          onClick={() =>
                            handleCommentReact(
                              pin._id,
                              c.id,
                              c.myReaction,
                              "like"
                            )
                          }
                          className={`flex items-center gap-1 ${
                            c.myReaction === "like"
                              ? "text-blue-600"
                              : "text-gray-500 hover:text-blue-600"
                          }`}
                        >
                          <FaThumbsUp /> {c.likes}
                        </button>
                        <button
                          onClick={() =>
                            handleCommentReact(
                              pin._1d,
                              c.id,
                              c.myReaction,
                              "dislike"
                            )
                          }
                          className={`flex items-center gap-1 ${
                            c.myReaction === "dislike"
                              ? "text-red-600"
                              : "text-gray-500 hover:text-red-600"
                          }`}
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

              {/* Add new comment */}
              <form
                onSubmit={(e) => handleAddComment(pin._id, e)}
                className="mt-4 flex gap-3 border-t pt-4"
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
          </div>
        ))}
      </div>

      {/* Report Popup */}
      {showReport && (
        <ReportPopup
          target={showReport}
          onCancel={() => setShowReport(null)}
          onSubmit={handleReport}
        />
      )}
    </div>
  );
}
