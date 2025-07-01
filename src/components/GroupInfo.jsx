import React, { useState } from "react";
import {
    FaUsers, FaCalendarAlt, FaMapPin, FaCopy, FaUserEdit, FaTrash, FaSyncAlt,
} from "react-icons/fa";

export default function GroupInfo() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    const members = [
        {
            name: "Alex Morgan",
            email: "alex@example.com",
            role: "Admin",
            joined: "Jan 15, 2023",
            memories: 38,
            avatar: "https://i.pravatar.cc/40?img=1",
        },
        {
            name: "Sarah Johnson",
            email: "sarah@example.com",
            role: "Moderator",
            joined: "Feb 3, 2023",
            memories: 24,
            avatar: "https://i.pravatar.cc/40?img=2",
        },
        {
            name: "Michael Chen",
            email: "michael@example.com",
            role: "Member",
            joined: "Mar 12, 2023",
            memories: 17,
            avatar: "https://i.pravatar.cc/40?img=3",
        },
    ];

      const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Main Content */}
            <main className="flex-1 p-6">
                {/* Group Details */}
                <section className="mb-6">
                    <h1 className="text-2xl font-bold mb-2">Group Details</h1>
                    <p className="text-sm text-gray-500 mb-4">Manage your group settings and members</p>

                    <div className="bg-white p-5 rounded-xl shadow-sm flex items-center gap-4">
                        <img src="https://i.pravatar.cc/60" className="rounded-full w-16 h-16" />
                        <div className="flex-1">
                            <h2 className="text-lg font-bold">Travel Enthusiasts</h2>
                            <p className="text-sm text-gray-600">
                                A community of passionate travelers sharing their journey memories from around the world.
                            </p>
                            <div className="flex gap-4 text-sm mt-2 text-gray-600">
                                <div className="flex items-center gap-1"><FaUsers /> 42 Members</div>
                                <div className="flex items-center gap-1"><FaCalendarAlt /> Created: Jan 15, 2023</div>
                                <div className="flex items-center gap-1"><FaMapPin /> 152 Memories</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Invite Link */}
                <section className="mb-6">
                    <div className="bg-white p-5 rounded-xl shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold">Invite Link</h3>

                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                readOnly
                                value="https://mapmemory.com/invite/travel-enthusiasts-9d2f8e"
                                className="flex-1 px-3 py-2 rounded-md border border-gray-300 text-sm"
                            />
                            <button className="flex items-center gap-1 text-blue-600 text-sm hover:underline">
                                <FaSyncAlt className="text-sm" />
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Only share with people you trust.</p>
                    </div>
                </section>

                {/* Members Table */}
                <section>
                    <div className="bg-white p-5 rounded-xl shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Group Members</h3>
                        </div>

                        

                        {/* Search Input */}
                        <input
                            type="text"
                            placeholder="Search members..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="mb-4 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                        {/* Table */}
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
                                {filteredMembers.map((m, index) => (
                                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-2">
                                            <div className="flex items-center gap-3">
                                                <img src={m.avatar} alt={m.name} className="w-10 h-10 rounded-full" />
                                                <div>
                                                    <p className="font-medium">{m.name}</p>
                                                    <p className="text-xs text-gray-500">{m.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${m.role === "Admin" ? "bg-blue-100 text-blue-700" :
                                                    m.role === "Moderator" ? "bg-green-100 text-green-700" :
                                                        "bg-gray-100 text-gray-600"
                                                }`}>{m.role}</span>
                                        </td>
                                        <td>{m.joined}</td>
                                        <td>{m.memories}</td>
                                        <td className="space-x-2">
                                            {m.role !== "Admin" && (
                                                <>
                                                    <button className="text-blue-600 hover:text-blue-800">
                                                        <FaUserEdit />
                                                    </button>
                                                    <button className="text-red-600 hover:text-red-800">
                                                        <FaTrash />
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="mt-4 flex justify-end gap-2">
                            {[1, 2, 3].map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-8 h-8 rounded-md text-sm ${currentPage === page ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
