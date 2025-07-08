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

    // 1) load group info
    groupService.get(groupId).then(setGroup).catch(console.error);

    // 2) load pins + reactions + comments
    pinService
      .list("group", "", groupId)
      .then(async (rawPins) => {
        const detailed = await Promise.all(
          rawPins.map(async (pin) => {
            // pin counts + my reaction
            const [{ likes, dislikes }, myR] = await Promise.all([
              likeService.list("pin", pin._id),
              likeService.getMyReaction("pin", pin._id).catch(() => null),
            ]);
            const myReaction = myR?.type || null;

            // comments + each counts + myReaction
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

  // refresh totals after a pin toggle
  const refreshPin = (pinId) =>
    likeService
      .list("pin", pinId)
      .then(({ likes, dislikes }) => {
        setPins((prev) =>
          prev.map((p) => (p._id === pinId ? { ...p, likes, dislikes } : p))
        );
      })
      .catch(console.error);

  // toggle pin like/dislike
  const handlePinReact = (pinId, prev, type) => {
    const newType = prev === type ? null : type;
    likeService
      .create({ targetType: "pin", targetId: pinId, type: newType || type })
      .then(() => {
        setPins((prev) =>
          prev.map((p) => (p._id === pinId ? { ...p, myReaction: newType } : p))
        );
        refreshPin(pinId);
      })
      .catch(console.error);
  };

  // toggle comment like/dislike
  const handleCommentReact = (pinId, cid, prev, type) => {
    const newType = prev === type ? null : type;
    likeService
      .create({
        targetType: "comment",
        targetId: cid,
        type: newType || type,
      })
      .then(() =>
        likeService.list("comment", cid).then(({ likes, dislikes }) => {
          setPins((prev) =>
            prev.map((p) => {
              if (p._id !== pinId) return p;
              return {
                ...p,
                comments: p.comments.map((c) =>
                  c.id === cid || c._id === cid
                    ? { ...c, likes, dislikes, myReaction: newType }
                    : c
                ),
              };
            })
          );
        })
      )
      .catch(console.error);
  };

  // submit new comment
  const handleAddComment = (pinId, e) => {
    e.preventDefault();
    const text = e.target.elements.comment.value.trim();
    if (!text) return;

    commentService
      .create({ pinId, text })
      .then((nc) => {
        const comment = {
          ...nc,
          likes: 0,
          dislikes: 0,
          myReaction: null,
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

  // submit report
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
            src={group?.avatar || defaultGroupAvatar}
            alt={group?.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-gray-800">
              {group?.name}
            </h1>
            <p className="text-sm text-gray-500">
              {group?.members?.length || 0} members
            </p>
            {group?.description && (
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
            {/* Pin Header */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <img
                  src={pin.owner?.avatar || defaultAvatar}
                  alt={pin.owner?.name || "Member"}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold text-gray-800">
                    {pin.owner?.name}
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
            {(pin.media?.video || pin.media?.images?.[0]) && (
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

            {/* Title & Description */}
            <div>
              <h2 className="text-lg font-medium text-gray-800">{pin.title}</h2>
              {pin.description && (
                <p className="text-gray-700">{pin.description}</p>
              )}
            </div>

            {/* Pin Reactions */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => handlePinReact(pin._id, pin.myReaction, "like")}
                className={
                  "flex items-center gap-1 " +
                  (pin.myReaction === "like"
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-blue-600")
                }
              >
                <FaThumbsUp /> {pin.likes}
              </button>
              <button
                onClick={() =>
                  handlePinReact(pin._id, pin.myReaction, "dislike")
                }
                className={
                  "flex items-center gap-1 " +
                  (pin.myReaction === "dislike"
                    ? "text-red-600"
                    : "text-gray-500 hover:text-red-600")
                }
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
                      src={c.author?.avatar || defaultAvatar}
                      alt={c.author?.name || "Member"}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>{c.author?.name}</span>
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
                          className={
                            "flex items-center gap-1 " +
                            (c.myReaction === "like"
                              ? "text-blue-600"
                              : "text-gray-500 hover:text-blue-600")
                          }
                        >
                          <FaThumbsUp /> {c.likes}
                        </button>
                        <button
                          onClick={() =>
                            handleCommentReact(
                              pin._id,
                              c.id,
                              c.myReaction,
                              "dislike"
                            )
                          }
                          className={
                            "flex items-center gap-1 " +
                            (c.myReaction === "dislike"
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

              {/* Add Comment */}
              <form
                onSubmit={(e) => handleAddComment(pin._id, e)}
                className="mt-4 flex gap-3 border-t pt-4"
              >
                <img
                  src={currentUser?.avatar || defaultAvatar}
                  alt={currentUser?.name || "You"}
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
