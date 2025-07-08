// src/components/GroupInfo.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import Swal from "sweetalert2";
import {
  FaUsers,
  FaCalendarAlt,
  FaMapPin,
  FaSyncAlt,
  FaCamera,
  FaPen,
  FaTrash,
  FaUserShield,
  FaSignOutAlt,
} from "react-icons/fa";
import { groupService } from "../../../service/groupService";
import { pinService } from "../../../service/pinService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function GroupInfo() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // ← ref for hidden file input

  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const baseInviteUrl = `${window.location.origin}/group/${groupId}/join?token=`;

  // Fetch group, members, post counts...
  const fetchGroupData = async () => {
    try {
      setLoading(true);
      const g = await groupService.get(groupId);

      const adminIds = (g.admins || []).map((a) =>
        typeof a === "string" ? a : a.id ?? a._id?.toString() ?? String(a)
      );

      const posts = await pinService.list("group", "", groupId);
      g.postCount = posts.length;
      const postCounts = {};
      posts.forEach((p) => {
        const ownerId = p.owner?._id || p.owner?.id;
        if (ownerId) postCounts[ownerId] = (postCounts[ownerId] || 0) + 1;
      });

      const fullMembers = (g.members || []).map((mDoc) => {
        const id = mDoc.id ?? mDoc._id?.toString() ?? "";
        return {
          id,
          name: mDoc.name,
          email: mDoc.email,
          avatar: mDoc.avatar,
          joinedAt: mDoc.joinedAt || "-",
          postCount: postCounts[id] || 0,
          role: adminIds.includes(id) ? "Admin" : "Member",
        };
      });

      setGroup(g);
      setMembers(fullMembers);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load group info.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupData();
  }, [groupId]);

  // Trigger OS file picker
  const handleAvatarButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Handle selected file
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const resp = await groupService.uploadAvatar(groupId, file);
      const newUrl = resp.url;
      if (!newUrl) throw new Error("No `url` in response");
      setGroup((g) => ({ ...g, avatar: newUrl }));
      toast.success("Avatar updated!");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed.");
    }
  };

  const handleNameEdit = async () => {
    const { value: newName } = await Swal.fire({
      title: "Edit Group Name",
      input: "text",
      inputValue: group.name,
      showCancelButton: true,
      confirmButtonText: "Save",
    });
    if (newName && newName !== group.name) {
      try {
        const updated = await groupService.update(groupId, { name: newName });
        setGroup(updated);
        toast.success("Group name updated!");
      } catch {
        toast.error("Failed to update group name.");
      }
    }
  };

  const handleRegenerateInvite = async () => {
    try {
      const { inviteToken } = await groupService.invite(groupId);
      setGroup((g) => ({ ...g, inviteToken }));
      toast.success("Invite link updated.");
    } catch {
      toast.error("Could not generate invite link.");
    }
  };

  const handleLeaveGroup = async () => {
    const { isConfirmed } = await Swal.fire({
      title: "Leave Group",
      text: "Are you sure you want to leave this group?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, leave",
    });
    if (!isConfirmed) return;
    try {
      await groupService.leaveGroup(groupId);
      Swal.fire("Left Group", "You have left the group.", "success");
      navigate("/GroupList");
    } catch {
      Swal.fire("Error", "Could not leave group.", "error");
    }
  };

  const handlePromote = async (memberId) => {
    const { isConfirmed } = await Swal.fire({
      title: "Promote member",
      text: "Promote this member to Admin?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, promote",
    });
    if (!isConfirmed) return;
    try {
      await groupService.promote(groupId, memberId);
      await fetchGroupData();
      Swal.fire("Promoted!", "Member is now an admin.", "success");
    } catch {
      Swal.fire("Error", "Could not promote member.", "error");
    }
  };

  const handleKick = async (memberId) => {
    const { isConfirmed } = await Swal.fire({
      title: "Remove member",
      text: "Remove this member?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove",
    });
    if (!isConfirmed) return;
    try {
      await groupService.kickMember(groupId, memberId);
      await fetchGroupData();
      Swal.fire("Removed!", "Member has been removed.", "success");
    } catch {
      Swal.fire("Error", "Could not remove member.", "error");
    }
  };

  if (loading || !group) {
    return <div className="p-6 text-center">Loading group info…</div>;
  }

  const term = searchTerm.toLowerCase();
  const filtered = members
    .filter(
      (m) =>
        m.name.toLowerCase().includes(term) ||
        m.email.toLowerCase().includes(term)
    )
    .sort((a, b) => (a.role === "Admin" && b.role !== "Admin" ? -1 : 0));

  return (
    <div className="flex flex-col min-h-screen bg-[#FEFCFB]">
      <ToastContainer />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarChange}
      />

      <main className="flex-1 p-4 sm:p-6 space-y-6">
        {/* Group Details */}
        <section className="bg-white p-4 sm:p-6 rounded-xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Avatar and Name */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full md:w-auto">
            <div className="relative w-20 h-20 sm:w-16 sm:h-16">
              <img
                src={group.avatar}
                alt="group avatar"
                className="rounded-full w-full h-full object-cover border border-gray-300"
              />
              <button
                title="Edit photo"
                onClick={handleAvatarButtonClick}
                className="absolute top-0 right-0 bg-white p-1 rounded-full shadow text-amber-600 hover:bg-amber-100 transition"
              >
                <FaCamera className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                  {group.name}
                </h2>
                <button
                  title="Edit group name"
                  onClick={handleNameEdit}
                  className="text-amber-600 hover:text-amber-800 transition"
                >
                  <FaPen className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-600 max-w-full">
                {group.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <FaUsers /> {members.length} Members
                </div>
                <div className="flex items-center gap-1">
                  <FaCalendarAlt /> Created:{" "}
                  {new Date(group.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <FaMapPin /> {group.postCount} Memories
                </div>
              </div>
              <button
                onClick={handleLeaveGroup}
                className="mt-4 inline-flex items-center gap-2 text-red-600 text-sm hover:text-red-800"
              >
                <FaSignOutAlt /> Leave Group
              </button>
            </div>
          </div>

          {/* Invite Link */}
          <div className="w-full md:w-1/3">
            <h3 className="text-sm font-semibold text-gray-700 mb-1">
              Invite Link
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={baseInviteUrl + group.inviteToken}
                className="flex-1 px-3 py-2 rounded-md border border-gray-300 bg-white text-sm"
              />
              <button
                onClick={handleRegenerateInvite}
                className="flex items-center gap-1 px-2 text-amber-600 hover:text-amber-800 transition"
              >
                <FaSyncAlt />
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-400">
              Share this to invite new members.
            </p>
          </div>
        </section>

        {/* Members Table */}
        <section className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Group Members
          </h3>
          <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4 w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-sm"
          />
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 border-b border-gray-200">
                  <th className="py-2">Member</th>
                  <th className="py-2">Role</th>
                  <th className="py-2">Memories</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr
                    key={m.id}
                    className="border-b border-gray-100 hover:bg-amber-50 transition"
                  >
                    <td className="py-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={m.avatar}
                          alt={m.name}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-800">{m.name}</p>
                          <p className="text-xs text-gray-500">{m.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          m.role === "Admin"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-gray-50 text-gray-600"
                        }`}
                      >
                        {m.role}
                      </span>
                    </td>
                    <td className="py-2 text-gray-700">{m.postCount}</td>
                    <td className="py-2 space-x-2">
                      {m.role !== "Admin" && (
                        <>
                          <button
                            onClick={() => handlePromote(m.id)}
                            className="text-green-600 hover:text-green-800 transition"
                            title="Promote to Admin"
                          >
                            <FaUserShield />
                          </button>
                          <button
                            onClick={() => handleKick(m.id)}
                            className="text-red-600 hover:text-red-800 transition"
                            title="Kick Member"
                          >
                            <FaTrash />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
