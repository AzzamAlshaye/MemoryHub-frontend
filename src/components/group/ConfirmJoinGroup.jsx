// src/components/ConfirmJoinGroup.jsx
import React, { useState, useEffect } from "react";
import { FaUsers, FaUserPlus } from "react-icons/fa";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { groupService } from "../../service/groupService";

export default function ConfirmJoinGroup() {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get("token");

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    const jwt = localStorage.getItem("token");
    if (!jwt) {
      toast.info("Please sign in to join groups");
      navigate("/SignInPage", { replace: true });
    }
  }, [navigate]);

  // Fetch group info
  useEffect(() => {
    (async () => {
      try {
        const data = await groupService.get(groupId);
        setGroup(data);
      } catch (err) {
        console.error(err);
        toast.error("Could not load group information");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    })();
  }, [groupId, navigate]);

  const handleClose = () => {
    navigate(-1);
  };

  const handleJoin = async () => {
    if (!inviteToken) {
      toast.error("Invalid invitation link");
      return;
    }
    setJoining(true);
    try {
      await groupService.join(groupId, inviteToken);
      toast.success("You’ve successfully joined the group!");
      navigate(`/group/${groupId}`);
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.error || err.message || "Failed to join group"
      );
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <>
        <ToastContainer />
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6">Loading…</div>
        </div>
      </>
    );
  }

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      <div
        className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
        onClick={handleClose}
      >
        <div
          className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center relative"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 text-blue-500 rounded-full p-4">
              <FaUsers size={32} />
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-800">
            Join "{group.name}"
          </h2>
          <div className="flex items-center justify-center text-gray-500 mt-2 text-sm gap-1">
            <FaUsers size={14} />
            <span>{group.memberCount} members</span>
          </div>

          <div className="bg-gray-100 text-gray-700 text-sm rounded-lg p-4 mt-5">
            {group.description}
          </div>

          <button
            onClick={handleJoin}
            disabled={joining}
            className="w-full bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-medium py-2 rounded-lg flex items-center justify-center mt-6 gap-2"
          >
            <FaUserPlus />
            {joining ? "Joining…" : "Join Group"}
          </button>

          <button
            onClick={handleClose}
            className="text-gray-500 text-sm mt-4 hover:underline"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}
