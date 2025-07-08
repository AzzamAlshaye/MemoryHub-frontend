// src/pages/user/GroupPage.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { IoIosArrowBack } from "react-icons/io";
import { FaThumbsUp, FaThumbsDown, FaFlag } from "react-icons/fa";
import { FiSend } from "react-icons/fi";

import { useAuth } from "../../../context/AuthContext";
import ReportPopup from "../../../components/map/ReportPopup";
import { groupService } from "../../../service/groupService";
import { pinService } from "../../../service/pinService";
import { commentService } from "../../../service/commentService";
import { likeService } from "../../../service/likeService";
import { reportService } from "../../../service/reportService";

export default function GroupPage() {
  const { user: currentUser } = useAuth() || {};
  const { groupId } = useParams();
  const navigate = useNavigate();

  const defaultAvatar = "/default-avatar.png";
  const defaultGroupAvatar = "/default-group.png";

  const [group, setGroup] = useState(null);
  const [pins, setPins] = useState([]);
  const [showReport, setShowReport] = useState(null);

  useEffect(() => {
    if (!groupId) return;
    groupService.get(groupId).then(setGroup).catch(console.error);

    pinService
      .list("group", "", groupId)
      .then(async (rawPins) => {
        const detailed = await Promise.all(
          rawPins.map(async (pin) => {
            const [{ likes, dislikes }, myR] = await Promise.all([
              likeService.list("pin", pin._id),
              likeService.getMyReaction("pin", pin._id).catch(() => null),
            ]);
            const myReaction = myR?.type || null;

            let comments = await commentService.listByPin(pin._id);
            comments = await Promise.all(
              comments.map(async (c) => {
                const cid = c.id || c._id;
                const [{ likes: cl, dislikes: cd }, cr] = await Promise.all([
                  likeService.list("comment", cid),
                  likeService.getMyReaction("comment", cid).catch(() => null),
                ]);
                return {
                  ...c,
                  likes: cl,
                  dislikes: cd,
                  myReaction: cr?.type || null,
                  author: c.author, // existing author data
                };
              })
            );

            return { ...pin, likes, dislikes, myReaction, comments };
          })
        );
        setPins(detailed);
      })
      .catch(console.error);
  }, [groupId]);

  const handlePinReact = (pinId, prev, type) => {
    const newType = prev === type ? null : type;
    likeService
      .create({ targetType: "pin", targetId: pinId, type: newType })
      .then(() =>
        setPins((prev) =>
          prev.map((pin) => {
            if (pin._id !== pinId) return pin;
            let { likes, dislikes } = pin;
            if (prev === "like") likes--;
            if (prev === "dislike") dislikes--;
            if (newType === "like") likes++;
            if (newType === "dislike") dislikes++;
            return { ...pin, likes, dislikes, myReaction: newType };
          })
        )
      )
      .catch(console.error);
  };

  const handleCommentReact = (pinId, cid, prev, type) => {
    const newType = prev === type ? null : type;
    likeService
      .create({ targetType: "comment", targetId: cid, type: newType })
      .then(() =>
        setPins((prev) =>
          prev.map((pin) => {
            if (pin._id !== pinId) return pin;
            const updated = pin.comments.map((c) => {
              if (c.id !== cid && c._id !== cid) return c;
              let { likes, dislikes } = c;
              if (prev === "like") likes--;
              if (prev === "dislike") dislikes--;
              if (newType === "like") likes++;
              if (newType === "dislike") dislikes++;
              return { ...c, likes, dislikes, myReaction: newType };
            });
            return { ...pin, comments: updated };
          })
        )
      )
      .catch(console.error);
  };

  const handleAddComment = (pinId, e) => {
    e.preventDefault();
    const text = e.target.elements.comment.value.trim();
    if (!text) return;
    commentService
      .create({ pinId, text })
      .then((nc) => {
        // build the new comment including current user's name and avatar
        const comment = {
          ...nc,
          likes: 0,
          dislikes: 0,
          myReaction: null,
          author: {
            name: currentUser.name,
            avatar: currentUser.avatar || defaultAvatar,
          },
        };
        setPins((prev) =>
          prev.map((p) =>
            p._id === pinId ? { ...p, comments: [comment, ...p.comments] } : p
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
    <div className="bg-neutral-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-4 p-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <IoIosArrowBack size={24} className="text-gray-600" />
          </button>
          <div
            onClick={() => navigate(`/group/${groupId}/info`)}
            className="flex items-center gap-4 cursor-pointer"
          >
            <img
              src={group.avatar || defaultGroupAvatar}
              alt={group.name}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-indigo-300"
            />
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">{group.name}</h1>
              <p className="text-sm text-gray-500">{group.members.length} members</p>
            </div>
          </div>
        </div>
      </header>

      {/* Pins List */}
      <main className="max-w-4xl mx-auto space-y-8 p-4">
        {pins.map((pin) => (
          <article
            key={pin._id}
            className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition flex flex-col"
          >
            {/* Pin Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={pin.owner.avatar || defaultAvatar}
                  alt={pin.owner.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-gray-800">{pin.owner.name}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(pin.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <FaFlag
                onClick={() => setShowReport({ type: "pin", id: pin._id })}
                className="text-gray-400 hover:text-red-500 cursor-pointer transition"
              />
            </div>

            {/* Media */}
            {pin.media.video || pin.media.images[0] ? (
              <div className="w-full aspect-video rounded-lg overflow-hidden mb-4">
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
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ) : null}

            {/* Title & Description */}
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{pin.title}</h2>
            {pin.description && <p className="text-gray-700 mb-4">{pin.description}</p>}

            {/* Reactions */}
            <div className="flex items-center gap-4 mb-4">
              {[
                ["like", FaThumbsUp, pin.likes],
                ["dislike", FaThumbsDown, pin.dislikes],
              ].map(([type, Icon, count]) => {
                const active = pin.myReaction === type;
                return (
                  <button
                    key={type}
                    onClick={() => handlePinReact(pin._id, pin.myReaction, type)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition
                      ${
                        active
                          ? type === "like"
                            ? "bg-indigo-50 text-indigo-600"
                            : "bg-red-50 text-red-600"
                          : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                      }`}
                  >
                    <Icon />
                    <span>{count}</span>
                  </button>
                );
              })}
            </div>

            <hr className="border-gray-200 mb-4" />

            {/* Comments */}
            <div className="space-y-4">
              {pin.comments.map((c) => (
                <div key={c.id || c._id} className="flex items-start gap-3">
                  <img
                    src={(c.author && c.author.avatar) || defaultAvatar}
                    alt={(c.author && c.author.name) || ""}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1 bg-gray-50 rounded-xl p-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>{(c.author && c.author.name) || ""}</span>
                      <span>{new Date(c.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-gray-700">{c.content}</p>
                    <div className="mt-2 flex items-center gap-3">
                      {[
                        ["like", FaThumbsUp, c.likes],
                        ["dislike", FaThumbsDown, c.dislikes],
                      ].map(([type, Icon, count]) => {
                        const active = c.myReaction === type;
                        return (
                          <button
                            key={type}
                            onClick={() =>
                              handleCommentReact(
                                pin._id,
                                c.id || c._id,
                                c.myReaction,
                                type
                              )
                            }
                            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition
                              ${
                                active
                                  ? type === "like"
                                    ? "bg-indigo-50 text-indigo-600"
                                    : "bg-red-50 text-red-600"
                                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                              }`}
                          >
                            <Icon />
                            <span>{count}</span>
                          </button>
                        );
                      })}
                      <FaFlag
                        onClick={() =>
                          setShowReport({ type: "comment", id: c.id || c._id })
                        }
                        className="ml-auto text-gray-400 hover:text-yellow-500 cursor-pointer transition"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Comment */}
              <form
                onSubmit={(e) => handleAddComment(pin._id, e)}
                className="flex items-start gap-3 pt-4"
              >
                <img
                  src={currentUser.avatar || defaultAvatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover mt-1"
                />
                <textarea
                  name="comment"
                  rows={2}
                  placeholder="Add a comment..."
                  className="flex-1 bg-white ring-1 ring-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-300 outline-none resize-none"
                />
                <button
                  type="submit"
                  className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-full shadow-lg hover:shadow-2xl transition"
                >
                  <FiSend size={18} />
                </button>
              </form>
            </div>
          </article>
        ))}
      </main>

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
