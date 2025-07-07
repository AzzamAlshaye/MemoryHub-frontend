// // src/components/GroupInfo.jsx

// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router";
// import Swal from "sweetalert2";
// import {
//   FaUsers,
//   FaCalendarAlt,
//   FaMapPin,
//   FaSyncAlt,
//   FaUserEdit,
//   FaTrash,
//   FaUserShield,
// } from "react-icons/fa";
// import { groupService } from "../../../service/groupService";

// export default function GroupInfo() {
//   const { groupId } = useParams();
//   const [group, setGroup] = useState(null);
//   const [members, setMembers] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);

//   const baseInviteUrl =
//     window.location.origin + `/group/${groupId}/join?token=`;

//   // Load group details
//   useEffect(() => {
//     groupService
//       .get(groupId)
//       .then((g) => {
//         setGroup(g);
//         setMembers(g.members || []);
//       })
//       .catch((err) => {
//         console.error(err);
//         Swal.fire("Error", "Could not load group info.", "error");
//       })
//       .finally(() => setLoading(false));
//   }, [groupId]);

//   // Generate a fresh invite token
//   const handleRegenerateInvite = async () => {
//     try {
//       const { inviteToken } = await groupService.invite(groupId);
//       setGroup((g) => ({ ...g, inviteToken }));
//       Swal.fire(
//         "New link generated!",
//         "Invite link has been updated.",
//         "success"
//       );
//     } catch (err) {
//       console.error(err);
//       Swal.fire(
//         "Error",
//         err.message || "Could not generate invite link.",
//         "error"
//       );
//     }
//   };

//   if (loading || members === null) {
//     return <div className="p-6 text-center">Loading group info…</div>;
//   }

//   const term = searchTerm.toLowerCase();
//   const filteredMembers = members.filter((m) => {
//     const name = (m.name || "").toLowerCase();
//     const email = (m.email || "").toLowerCase();
//     return name.includes(term) || email.includes(term);
//   });

//   return (
//     <div className="flex min-h-screen bg-[#FDF7F0]">
//       <main className="flex-1 p-6 space-y-6">
//         {/* Group Details */}
//         <section className="bg-white p-6 rounded-xl shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
//           <div className="flex items-center gap-4">
//             <div className="relative w-16 h-16">
//               <img
//                 src={group.avatar}
//                 alt="group avatar"
//                 className="rounded-full w-full h-full object-cover border border-gray-300"
//               />
//               <button
//                 title="Edit photo"
//                 onClick={async () => {
//                   const { value: file } = await Swal.fire({
//                     title: "Upload New Group Photo",
//                     input: "file",
//                     inputAttributes: { accept: "image/*" },
//                     confirmButtonText: "Upload",
//                     showCancelButton: true,
//                     background: "#fff",
//                     customClass: { popup: "shadow-lg rounded-lg" },
//                   });
//                   if (file) {
//                     try {
//                       const { avatarUrl } = await groupService.uploadAvatar(
//                         groupId,
//                         file
//                       );
//                       setGroup((g) => ({ ...g, avatar: avatarUrl }));
//                       Swal.fire("Success", "Avatar updated!", "success");
//                     } catch (e) {
//                       console.error(e);
//                       Swal.fire("Error", "Upload failed.", "error");
//                     }
//                   }
//                 }}
//                 className="absolute top-0 right-0 bg-white p-1 rounded-full shadow text-amber-600 hover:bg-amber-100 transition"
//               >
//                 <FaUserEdit className="w-4 h-4" />
//               </button>
//             </div>
//             <div>
//               <h2 className="text-lg font-bold text-gray-800">{group.name}</h2>
//               <p className="text-sm text-gray-600 max-w-md">
//                 {group.description}
//               </p>
//               <div className="flex flex-wrap gap-4 text-sm mt-3 text-gray-600">
//                 <div className="flex items-center gap-1">
//                   <FaUsers /> {members.length} Members
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <FaCalendarAlt /> Created:{" "}
//                   {new Date(group.createdAt).toLocaleDateString()}
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <FaMapPin /> {group.postCount} Memories
//                 </div>
//               </div>
//             </div>
//           </div>
//           {/* Invite Link */}
//           <div className="w-full lg:w-1/3 space-y-2">
//             <h3 className="text-sm font-semibold text-gray-700">Invite Link</h3>
//             <div className="flex items-center gap-2">
//               <input
//                 type="text"
//                 readOnly
//                 value={baseInviteUrl + group.inviteToken}
//                 className="flex-1 px-3 py-2 rounded-md border border-gray-300 bg-white text-sm"
//               />
//               <button
//                 onClick={handleRegenerateInvite}
//                 className="flex items-center gap-1 text-amber-600 hover:text-amber-800 transition"
//                 title="Regenerate Link"
//               >
//                 <FaSyncAlt />
//               </button>
//             </div>
//             <p className="text-xs text-gray-400">
//               Share this to invite new members.
//             </p>
//           </div>
//         </section>

//         {/* Members Table */}
//         <section className="bg-white p-6 rounded-xl shadow-md">
//           <h3 className="text-lg font-semibold mb-4 text-gray-800">
//             Group Members
//           </h3>
//           <input
//             type="text"
//             placeholder="Search members..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="mb-4 w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
//           />
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="text-left text-gray-600 border-b border-gray-200">
//                 <th className="py-2">Member</th>
//                 <th>Role</th>
//                 <th>Joined</th>
//                 <th>Memories</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredMembers.map((m) => (
//                 <tr
//                   key={m.id}
//                   className="border-b border-gray-100 hover:bg-amber-50 transition"
//                 >
//                   <td className="py-2">
//                     <div className="flex items-center gap-3">
//                       <img
//                         src={m.avatar}
//                         alt={m.name}
//                         className="w-10 h-10 rounded-full"
//                       />
//                       <div>
//                         <p className="font-medium text-gray-800">{m.name}</p>
//                         <p className="text-xs text-gray-500">{m.email}</p>
//                       </div>
//                     </div>
//                   </td>
//                   <td>
//                     <span
//                       className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                         m.role === "Admin"
//                           ? "bg-amber-100 text-amber-700"
//                           : "bg-gray-50 text-gray-600"
//                       }`}
//                     >
//                       {m.role}
//                     </span>
//                   </td>
//                   <td className="text-gray-700">{m.joinedAt}</td>
//                   <td className="text-gray-700">{m.postCount}</td>
//                   <td className="space-x-2">
//                     {m.role !== "Admin" && (
//                       <>
//                         <button
//                           onClick={() => handlePromote(m.id)}
//                           className="text-green-600 hover:text-green-800 transition"
//                           title="Promote to Admin"
//                         >
//                           <FaUserShield />
//                         </button>
//                         <button
//                           onClick={() => handleKick(m.id)}
//                           className="text-red-600 hover:text-red-800 transition"
//                           title="Kick Member"
//                         >
//                           <FaTrash />
//                         </button>
//                       </>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </section>
//       </main>
//     </div>
//   );
// }




// src/components/GroupInfo.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import Swal from "sweetalert2";
import {
  FaUsers,
  FaCalendarAlt,
  FaMapPin,
  FaSyncAlt,
  FaUserEdit,
  FaTrash,
  FaUserShield,
} from "react-icons/fa";
import { groupService } from "../../../service/groupService";

export default function GroupInfo() {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const baseInviteUrl = `${window.location.origin}/group/${groupId}/join?token=`;

  useEffect(() => {
    async function loadGroupData() {
      try {
        const g = await groupService.get(groupId);
        setGroup(g);
        setMembers(g.members || []);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Could not load group info.", "error");
      } finally {
        setLoading(false);
      }
    }

    loadGroupData();
  }, [groupId]);

  const handleRegenerateInvite = async () => {
    try {
      const { inviteToken } = await groupService.invite(groupId);
      setGroup((g) => ({ ...g, inviteToken }));
      Swal.fire("Success", "New invite link generated!", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message || "Failed to generate invite link.", "error");
    }
  };

  const handlePromote = async (memberId) => {
    Swal.fire("Promoted!", `User ID ${memberId} is now an admin.`, "success");
    // Implement actual promote logic
  };

  const handleKick = async (memberId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This member will be removed from the group.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, kick",
      cancelButtonText: "Cancel",
    });

    if (confirm.isConfirmed) {
      try {
        await groupService.kickMember(groupId, memberId);
        setMembers((prev) => prev.filter((m) => m.id !== memberId));
        Swal.fire("Removed", "The member was removed.", "success");
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to remove member.", "error");
      }
    }
  };

  const filteredMembers = members.filter((m) => {
    const name = (m.name || "").toLowerCase();
    const email = (m.email || "").toLowerCase();
    const term = searchTerm.toLowerCase();
    return name.includes(term) || email.includes(term);
  });

  if (loading || !group) {
    return <div className="p-6 text-center">Loading group info…</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#FDF7F0]">
      <main className="flex-1 p-6 space-y-6">
        {/* Group Details */}
        <section className="bg-white p-6 rounded-xl shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16">
              <img
                src={group.avatar}
                alt="group avatar"
                className="rounded-full w-full h-full object-cover border border-gray-300"
              />
              <button
                title="Edit photo"
                onClick={async () => {
                  const { value: file } = await Swal.fire({
                    title: "Upload New Group Photo",
                    input: "file",
                    inputAttributes: { accept: "image/*" },
                    confirmButtonText: "Upload",
                    showCancelButton: true,
                  });

                  if (file) {
                    try {
                      const { avatarUrl } = await groupService.uploadAvatar(groupId, file);
                      setGroup((g) => ({ ...g, avatar: avatarUrl }));
                      Swal.fire("Success", "Avatar updated!", "success");
                    } catch (e) {
                      console.error(e);
                      Swal.fire("Error", "Upload failed.", "error");
                    }
                  }
                }}
                className="absolute top-0 right-0 bg-white p-1 rounded-full shadow text-amber-600 hover:bg-amber-100"
              >
                <FaUserEdit className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">{group.name}</h2>
              <p className="text-sm text-gray-600 max-w-md">{group.description}</p>
              <div className="flex flex-wrap gap-4 text-sm mt-3 text-gray-600">
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
            </div>
          </div>

          {/* Invite Link */}
          <div className="w-full lg:w-1/3 space-y-2">
            <h3 className="text-sm font-semibold text-gray-700">Invite Link</h3>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={baseInviteUrl + group.inviteToken}
                className="flex-1 px-3 py-2 rounded-md border border-gray-300 bg-white text-sm"
              />
              <button
                onClick={handleRegenerateInvite}
                className="text-amber-600 hover:text-amber-800"
                title="Regenerate Link"
              >
                <FaSyncAlt />
              </button>
            </div>
            <p className="text-xs text-gray-400">Share this to invite new members.</p>
          </div>
        </section>

        {/* Members Table */}
        <section className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Group Members</h3>
          <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4 w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
          />
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 border-b border-gray-200">
                <th className="py-2">Member</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Memories</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers
                .filter((m) => m.id) // only render members with valid ID
                .map((m) => (
                  <tr key={m.id} className="border-b border-gray-100 hover:bg-amber-50">
                    <td className="py-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={m.avatar || "/default-avatar.png"}
                          alt={m.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-gray-800">{m.name}</p>
                          <p className="text-xs text-gray-500">{m.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
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
                    <td className="text-gray-700">{m.joinedAt}</td>
                    <td className="text-gray-700">{m.postCount}</td>
                    <td className="space-x-2">
                      {m.role !== "Admin" && (
                        <>
                          <button
                            onClick={() => handlePromote(m.id)}
                            className="text-green-600 hover:text-green-800"
                            title="Promote to Admin"
                          >
                            <FaUserShield />
                          </button>
                          <button
                            onClick={() => handleKick(m.id)}
                            className="text-red-600 hover:text-red-800"
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
        </section>
      </main>
    </div>
  );
}
