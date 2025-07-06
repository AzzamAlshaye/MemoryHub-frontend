// src/pages/user/GroupPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaThumbsUp, FaThumbsDown, FaFlag } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import ReportPopup from "../../components/ReportPopup";
import { groupService } from "../../service/groupService";

export default function GroupPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [reportTarget, setReportTarget] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    groupService
      .get(groupId)
      .then((g) => {
        setGroup(g);
        setPosts(g.posts || []);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [groupId]);

  const handleAddComment = (postId) => {
    if (!newComment.trim()) return;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: [
                ...p.comments,
                {
                  name: "You",
                  time: new Date().toLocaleString(),
                  text: newComment,
                  likes: 0,
                  dislikes: 0,
                },
              ],
            }
          : p
      )
    );
    setNewComment("");
  };

  const handleLikePost = (id) =>
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
    );

  const handleDislikePost = (id) =>
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, dislikes: p.dislikes + 1 } : p))
    );

  const handleReactToComment = (postId, idx, delta) =>
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const comments = [...p.comments];
        const comment = { ...comments[idx] };
        if (delta > 0) comment.likes++;
        else comment.dislikes = (comment.dislikes || 0) + 1;
        comments[idx] = comment;
        return { ...p, comments };
      })
    );

  const handleOpenReport = (type, id) => setReportTarget({ type, id });

  if (loading) return <div className="p-6 text-center">Loading…</div>;
  if (!group) return <div className="p-6 text-center">Group not found</div>;

  return (
    <div className="min-h-screen bg-[#FDF7F0] p-4 space-y-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-black"
        >
          <IoIosArrowBack size={24} />
        </button>

        {/* Clickable group info area */}
        <div
          onClick={() => navigate(`/group/${groupId}/info`)}
          className="flex items-center gap-4 cursor-pointer"
        >
          <img
            src={group.avatar}
            alt="Group avatar"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              {group.name}
            </h1>
            <p className="text-sm text-gray-500">
              {group.memberCount || 0} members
            </p>
            <p className="mt-1 text-gray-700">{group.description}</p>
          </div>
        </div>
      </div>

      {/* Posts */}
      {posts.map((post, postIdx) => (
        <div
          key={post.id}
          className="max-w-3xl mx-auto bg-white rounded-xl shadow p-5 space-y-4"
        >
          {/* Post Header */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <img
                src={post.avatar}
                alt="avatar"
                className="w-9 h-9 rounded-full"
              />
              <div>
                <div className="text-sm font-semibold text-gray-800">
                  {post.user}
                </div>
                <div className="text-xs text-gray-500">{post.date}</div>
              </div>
            </div>
            <FaFlag
              onClick={() => handleOpenReport("post", post.id)}
              className="text-gray-400 hover:text-red-500 cursor-pointer"
            />
          </div>

          {/* Image Carousel */}
          <div className="relative w-full h-64 rounded-md overflow-hidden">
            <img
              src={post.image}
              alt="memory"
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 flex items-center justify-between px-3 text-white text-xl">
              <IoIosArrowBack className="cursor-pointer hover:scale-110" />
              <IoIosArrowForward className="cursor-pointer hover:scale-110" />
            </div>
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
              📍 {post.location}
            </div>
          </div>

          <p className="text-gray-800 text-sm">{post.caption}</p>

          {/* Reactions */}
          <div className="flex justify-between items-center text-gray-600 text-sm">
            <div className="flex gap-6">
              <button
                onClick={() => handleLikePost(post.id)}
                className="flex items-center gap-1 hover:text-blue-600"
              >
                <FaThumbsUp size={18} /> {post.likes}
              </button>
              <button
                onClick={() => handleDislikePost(post.id)}
                className="flex items-center gap-1 hover:text-red-600"
              >
                <FaThumbsDown size={18} /> {post.dislikes}
              </button>
            </div>
          </div>

          <hr className="border-gray-300" />

          {/* Comments */}
          <div>
            <h4 className="text-sm font-medium text-gray-600">
              Comments ({post.comments.length})
            </h4>
            <div className="mt-3 space-y-5">
              {post.comments.map((comment, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-start gap-3">
                    <img
                      src={`https://i.pravatar.cc/30?u=${idx}-${postIdx}`}
                      alt="avatar"
                      className="w-8 h-8 rounded-full mt-1"
                    />
                    <div className="flex-1 bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>{comment.name}</span>
                        <span>{comment.time}</span>
                      </div>
                      <p className="mt-1 text-gray-700 text-sm">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-gray-500 text-sm pl-11">
                    <button
                      onClick={() => handleReactToComment(post.id, idx, 1)}
                      className="flex items-center gap-1 hover:text-blue-600"
                    >
                      <FaThumbsUp size={16} /> {comment.likes}
                    </button>
                    <button
                      onClick={() => handleReactToComment(post.id, idx, -1)}
                      className="flex items-center gap-1 hover:text-red-600"
                    >
                      <FaThumbsDown size={16} /> {comment.dislikes || 0}
                    </button>
                    <FaFlag
                      onClick={() =>
                        handleOpenReport("comment", `${post.id}-${idx}`)
                      }
                      className="cursor-pointer hover:text-red-500"
                      size={14}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Add Comment */}
            <div className="flex items-start gap-3 mt-4">
              <img
                src="https://i.pravatar.cc/30?img=1"
                alt="your avatar"
                className="w-8 h-8 rounded-full mt-1"
              />
              <div className="flex flex-1 items-center border border-gray-300 rounded-xl px-4 py-2 bg-white shadow-sm">
                <input
                  className="flex-1 text-sm focus:outline-none bg-transparent"
                  placeholder="Add a comment…"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button
                  onClick={() => handleAddComment(post.id)}
                  className="ms-2 text-blue-600 hover:text-blue-800"
                >
                  <FiSend size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Report Popup */}
      {reportTarget && (
        <ReportPopup
          target={reportTarget}
          onCancel={() => setReportTarget(null)}
          onSubmit={(data) => {
            console.log("Report submitted:", data);
            setReportTarget(null);
          }}
        />
      )}
    </div>
  );
}