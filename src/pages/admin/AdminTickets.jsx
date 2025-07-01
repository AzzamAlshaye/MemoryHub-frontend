import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    FaCheck,
    FaTimes,
    FaExclamationTriangle,
    FaInfoCircle,
    FaFlag,
    FaClock,
    FaCheckCircle,
    FaBan,
    FaChevronDown,
    FaThumbtack,
    FaCommentDots
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ReportsPage() {
    const [reports, setReports] = useState([]);
    const [users, setUsers] = useState({});
    const [pinsMap, setPinsMap] = useState({});
    const [commentsMap, setCommentsMap] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState("post");
    const [resolutionNotes, setResolutionNotes] = useState({});


    const reportsPerPage = 3;

    const [statusFilter, setStatusFilter] = useState("All Reports");
    const [categoryFilter, setCategoryFilter] = useState("All Categories");
    const [sortFilter, setSortFilter] = useState("Newest First");

    const postCount = reports.filter(r => r.targetType === "pin").length;
    const commentCount = reports.filter(r => r.targetType === "comment").length;
    const pendingCount = reports.filter(r => r.status === "pending").length;
    const resolvedCount = reports.filter(r => r.status === "resolved").length;
    const dismissedCount = reports.filter(r => r.status === "dismissed").length;

    useEffect(() => {
        async function fetchData() {
            const [reportsRes, usersRes, pinsRes, commentsRes] = await Promise.all([
                axios.get("https://68219a21259dad2655afc28a.mockapi.io/reports"),
                axios.get("https://685cc514769de2bf085dc721.mockapi.io/users"),
                axios.get("https://685cc514769de2bf085dc721.mockapi.io/pins"),
                axios.get("https://683cc42f199a0039e9e35f20.mockapi.io/comments")
            ]);

            const usersMap = {};
            usersRes.data.forEach((u) => (usersMap[u.id] = u));

            const pins = {};
            pinsRes.data.forEach((p) => (pins[p.id] = p));

            const comments = {};
            commentsRes.data.forEach((c) => (comments[c.id] = c));

            setReports(reportsRes.data);
            setUsers(usersMap);
            setPinsMap(pins);
            setCommentsMap(comments);
        }
        fetchData();
    }, []);

    const filteredReports = reports.filter(r => {
        const isRightTab = activeTab === "post" ? r.targetType === "pin" : r.targetType === "comment";
        const statusMatch = statusFilter === "All Reports" || r.status === statusFilter.toLowerCase();
        const categoryMatch = categoryFilter === "All Categories" || r.reason === categoryFilter;
        return isRightTab && statusMatch && categoryMatch;
    });

    const sortedReports = [...filteredReports].sort((a, b) => {
        if (sortFilter === "Newest First") return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortFilter === "Oldest First") return new Date(a.createdAt) - new Date(b.createdAt);
        return 0;
    });

    const indexOfLast = currentPage * reportsPerPage;
    const indexOfFirst = indexOfLast - reportsPerPage;
    const currentReports = sortedReports.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(sortedReports.length / reportsPerPage);

    const getStatusColor = (status) => {
        if (status === "resolved") return "bg-green-200 text-green-800";
        if (status === "dismissed") return "bg-gray-200 text-gray-800";
        return "bg-yellow-200 text-yellow-800";
    };

    const handleDismiss = async (reportId) => {
        const reason = resolutionNotes[reportId] || "";
        try {
            await axios.put(`https://68219a21259dad2655afc28a.mockapi.io/reports/${reportId}`, {
                status: "dismissed",
                resolutionReason: reason,
            });
            setReports((prev) =>
                prev.map((r) =>
                    r.id === reportId ? { ...r, status: "dismissed", resolutionReason: reason } : r
                )
            );
            toast.success("Report dismissed successfully");
        } catch (err) {
            toast.error("Failed to dismiss report");
        }
    };

    const handleResolve = async (reportId) => {
        const reason = resolutionNotes[reportId] || "";
        try {
            await axios.put(`https://68219a21259dad2655afc28a.mockapi.io/reports/${reportId}`, {
                status: "resolved",
                resolutionReason: reason,
            });
            setReports((prev) =>
                prev.map((r) =>
                    r.id === reportId ? { ...r, status: "resolved", resolutionReason: reason } : r
                )
            );
            toast.success("Report resolved and content deleted");
        } catch (err) {
            toast.error("Failed to resolve report");
        }
    };



    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Reports Management</h1>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Reports Management</h1>
<ToastContainer />

            <div className="grid grid-cols-4 gap-4 mb-6">
                <StatCard label="Total Reports" value={reports.length} icon={<FaFlag />} color="bg-blue-100 text-blue-500" />
                <StatCard label="Pending" value={pendingCount} icon={<FaClock />} color="bg-yellow-100 text-yellow-500" />
                <StatCard label="Resolved" value={resolvedCount} icon={<FaCheckCircle />} color="bg-green-100 text-green-500" />
                <StatCard label="Dismissed" value={dismissedCount} icon={<FaBan />} color="bg-gray-100 text-gray-500" />
            </div>

            <div className="bg-white border border-gray-300 rounded-xl p-4 shadow">
                <div className="flex gap-4 items-center border-b border-gray-300 mb-4">
                    <button onClick={() => setActiveTab("post")} className={`flex items-center gap-2 text-sm px-2 py-1 font-medium ${activeTab === "post" ? "text-sky-600 border-b-2 border-sky-400" : "text-gray-500"}`}>
                        <FaThumbtack className={activeTab === "post" ? "text-sky-400" : "text-gray-400"} />
                        Post Reports
                        <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold ${activeTab === "post" ? "bg-sky-200 text-sky-900" : "bg-gray-200 text-gray-700"}`}>{postCount}</span>
                    </button>
                    <button onClick={() => setActiveTab("comment")} className={`flex items-center gap-2 text-sm px-2 py-1 font-medium ${activeTab === "comment" ? "text-sky-600 border-b-2 border-sky-400" : "text-gray-500"}`}>
                        <FaCommentDots className={activeTab === "comment" ? "text-sky-400" : "text-gray-400"} />
                        Comment Reports
                        <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold ${activeTab === "comment" ? "bg-sky-200 text-sky-900" : "bg-gray-200 text-gray-700"}`}>{commentCount}</span>
                    </button>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-3">
                        <Dropdown value={statusFilter} onChange={setStatusFilter} options={["All Reports", "Pending", "Resolved", "Dismissed"]} />
                        <Dropdown value={categoryFilter} onChange={setCategoryFilter} options={["All Categories", "Inappropriate Content", "Harassment", "Spam", "False Information"]} />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Sort by:</span>
                        <Dropdown value={sortFilter} onChange={setSortFilter} options={["Newest First", "Oldest First"]} />
                    </div>
                </div>

                <div className="space-y-6">
                    {currentReports.map((r) => {
                        const reporter = users[r.reporter];
                        const target = r.targetType === "pin" ? pinsMap[r.targetId] : commentsMap[r.targetId];
                        const reportedUser = users[target?.authorId || target?.owner];
                        const location = r.targetType === "pin" ? target?.location : null;

                        return (
                            <div key={r.id} className="border border-gray-300 bg-white rounded-md shadow overflow-hidden">
                                <div className="flex justify-between items-center px-4 py-2 bg-red-100">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-white p-2 rounded-full text-red-600 text-base">
                                            <FaFlag />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-black">{r.reason}</p>
                                            <p className="text-xs text-gray-600">Reported {formatTimeAgo(r.createdAt)}</p>
                                        </div>
                                    </div>
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded capitalize ${getStatusColor(r.status)}`}>{r.status}</span>
                                </div>

                                <div className="grid grid-cols-3 gap-4 p-4 border-b border-gray-300">
                                    <UserCard label="Reporter" user={reporter} />
                                    <UserCard label="Reported User" user={reportedUser} />
                                    {r.targetType === "pin" && location && location.lat && location.lng ? (
                                        <div>
                                            <p className="text-xs font-medium text-gray-400 uppercase mb-1">Location</p>
                                            <p className="text-xs text-gray-500">Lat: {location.lat}, Long: {location.lng}</p>
                                        </div>
                                    ) : null}
                                </div>

                                <div className="px-4 pt-4 pb-2">
                                    <p className="text-xs font-medium text-gray-400 uppercase mb-1">Report Reason</p>
                                    <div className="bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-black rounded">
                                        {r.reason}
                                    </div>

                                    {r.resolutionReason && (
                                        <div>
                                            <p className="text-xs font-medium text-gray-400 uppercase mb-1 mt-3">Resolution Reason</p>
                                            <div className="bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-black rounded mb-1">
                                                {r.resolutionReason}
                                            </div>
                                        </div>
                                    )}

                                    {(r.status === "pending" || r.status === "open") && (
                                        <div className="mt-3">
                                            <p className="text-xs font-medium text-gray-400 uppercase mb-1 mt-3">Resolution Reason</p>
                                            <textarea
                                                className="w-full border  border-gray-200 mt-1 rounded px-3 py-2 text-sm"
                                                placeholder="Write resolution reason..."
                                                value={resolutionNotes[r.id] || ""}
                                                onChange={(e) =>
                                                    setResolutionNotes((prev) => ({
                                                        ...prev,
                                                        [r.id]: e.target.value,
                                                    }))
                                                }
                                            />
                                        </div>
                                    )}


                                </div>





                                {(r.status === "pending" || r.status === "open") && (
                                    <div className="flex justify-end gap-3 items-center px-4 py-3 bg-white border-t border-gray-200">
                                        <ActionButton icon={<FaInfoCircle />} label="View Details" />
                                        <ActionButton icon={<FaExclamationTriangle />} label="Warn User" />
                                        <ActionButton icon={<FaTimes />} label="Delete Content" onClick={() => handleResolve(r.id)} />
                                        <ActionButton icon={<FaCheck />} label="Dismiss" onClick={() => handleDismiss(r.id)} />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="flex justify-between items-center mt-6">
                    <span className="text-sm text-gray-500">Showing {indexOfFirst + 1}-{Math.min(indexOfLast, sortedReports.length)} of {sortedReports.length} reports</span>
                    <div className="flex gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                            <button
                                key={n}
                                className={`px-3 py-1 rounded-md border text-sm ${currentPage === n ? "bg-blue-400 text-white" : "bg-white text-black"}`}
                                onClick={() => setCurrentPage(n)}
                            >
                                {n}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon, color }) {
    return (
        <div className="bg-white p-4 rounded shadow flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500 mb-1">{label}</p>
                <p className="text-2xl font-bold text-black">{value}</p>
            </div>
            <div className={`w-10 h-10 flex items-center justify-center rounded-full ${color}`}>{icon}</div>
        </div>
    );
}

function UserCard({ label, user }) {
    return (
        <div className="border-r border-gray-300 pr-4">
            <p className="text-xs font-medium text-gray-400 uppercase mb-1">{label}</p>
            {user ? (
                <div className="flex items-center gap-2">
                    <img src={user.avatar} alt="avatar" className="w-6 h-6 rounded-full" />
                    <div>
                        <p className="text-sm font-semibold text-black">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                </div>
            ) : (
                <p className="text-xs text-gray-500">Unknown</p>
            )}
        </div>
    );
}

function ActionButton({ icon, label, onClick }) {
    const baseStyles =
        "flex items-center gap-2 text-sm px-3 py-1 border border-gray-300 rounded font-medium transition-colors duration-150";
    let colorClass = "";
    if (label === "View Details") colorClass = "text-gray-700 hover:text-white hover:bg-gray-400";
    else if (label === "Warn User") colorClass = "text-yellow-600 hover:text-white hover:bg-yellow-500";
    else if (label === "Delete Content") colorClass = "text-red-600 hover:text-white hover:bg-red-500";
    else if (label === "Dismiss") colorClass = "text-green-600 hover:text-white hover:bg-green-500";
    return (
        <button className={`${baseStyles} ${colorClass}`} onClick={onClick}>
            {icon} {label}
        </button>
    );
}

function Dropdown({ value, onChange, options }) {
    return (
        <div className="relative">
            <select
                className="appearance-none border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-black bg-white pr-8"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                {options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
            <div className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-700">
                <FaChevronDown />
            </div>
        </div>
    );
}

function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const hours = Math.floor(diffMs / 1000 / 60 / 60);
    const days = Math.floor(hours / 24);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    return `${days} day${days > 1 ? "s" : ""} ago`;
}

