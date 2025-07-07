// src/components/MyTickets.jsx
import React, { useEffect, useState, useMemo } from "react";
import { FaFlag, FaThumbtack, FaCommentDots, FaChevronDown } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { reportService } from "../../service/reportService";
import { pinService } from "../../service/pinService";
import { commentService } from "../../service/commentService";
import { userService } from "../../service/userService";

export default function MyTickets() {
  const [reports, setReports] = useState([]);
  const [pinsMap, setPinsMap] = useState({});
  const [commentsMap, setCommentsMap] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("post");
  const [statusFilter, setStatusFilter] = useState("All Reports");
  const [sortFilter, setSortFilter] = useState("Newest First");
  const reportsPerPage = 3;

  useEffect(() => {
    async function fetchData() {
      try {
        const user = await userService.getCurrentUser();
        if (!user) throw new Error("User not found");
        setCurrentUserId(user.id);

        const result = await reportService.listMy();
        const allReports = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
          ? result.data
          : [];

        const pins = await pinService.list();
        const pinMap = Object.fromEntries(pins.map((p) => [p.id, p]));
        setPinsMap(pinMap);

        const commentArrays = await Promise.all(
          pins.map((pin) => commentService.listByPin(pin.id).catch(() => []))
        );
        const allComments = commentArrays.flat();
        const commentMap = Object.fromEntries(allComments.map((c) => [c.id, c]));
        setCommentsMap(commentMap);

        const myReports = allReports.filter((r) => r.reporter === user.id);
        setReports(myReports);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    }
    fetchData();
  }, []);

  const statusMap = {
    "All Reports": null,
    Pending: "open",
    Resolved: "resolved",
    Dismissed: "dismissed",
  };

  const filteredReports = useMemo(
    () =>
      reports.filter((r) => {
        const isCorrectTab =
          activeTab === "post" ? r.targetType === "pin" : r.targetType === "comment";
        const statusMatch =
          !statusMap[statusFilter] || r.status === statusMap[statusFilter];
        return isCorrectTab && statusMatch;
      }),
    [reports, activeTab, statusFilter]
  );

  const sortedReports = useMemo(
    () =>
      [...filteredReports].sort((a, b) => {
        if (sortFilter === "Newest First")
          return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortFilter === "Oldest First")
          return new Date(a.createdAt) - new Date(b.createdAt);
        return 0;
      }),
    [filteredReports, sortFilter]
  );

  const indexOfLast = currentPage * reportsPerPage;
  const indexOfFirst = indexOfLast - reportsPerPage;
  const currentReports = sortedReports.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedReports.length / reportsPerPage);

  const getStatusColor = (status) => {
    if (status === "resolved") return "bg-green-200 text-green-800";
    if (status === "dismissed") return "bg-gray-200 text-gray-800";
    return "bg-yellow-200 text-yellow-800";
  };



  return (
    <div className="p-6 bg-gradient-to-tr bg-[#FDF7F0] min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">My Tickets</h1>
      <ToastContainer />

      <div className="bg-white border border-gray-300 rounded-xl p-4 shadow">
        {/* Tabs */}
        <div className="flex gap-4 items-center border-b border-gray-300 mb-4">
          <TabButton
            label="Post Reports"
            icon={FaThumbtack}
            active={activeTab === "post"}
            onClick={() => {
              setActiveTab("post");
              setCurrentPage(1);
            }}
          />
          <TabButton
            label="Comment Reports"
            icon={FaCommentDots}
            active={activeTab === "comment"}
            onClick={() => {
              setActiveTab("comment");
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center mb-6">
          <Dropdown
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}
            options={["All Reports", "Pending", "Resolved", "Dismissed"]}
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <Dropdown
              value={sortFilter}
              onChange={(val) => {
                setSortFilter(val);
                setCurrentPage(1);
              }}
              options={["Newest First", "Oldest First"]}
            />
          </div>
        </div>

        {/* Report List */}
        <div className="space-y-6">
          {currentReports.map((r) => {
            const target =
              r.targetType === "pin"
                ? pinsMap[r.targetId]
                : commentsMap[r.targetId];

            return (
<div key={r.id}
                className="border border-gray-300 bg-white rounded-md shadow overflow-hidden"
              >
                <div className="flex justify-between items-center px-4 py-2 bg-red-100">
                  <div className="flex items-center gap-2">
                    <div className="bg-white p-2 rounded-full text-red-600">
                      <FaFlag />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-black">{r.reason}</p>
                      <p className="text-xs text-gray-600">
                        Reported {formatTimeAgo(r.createdAt)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded capitalize ${getStatusColor(
                      r.status
                    )}`}
                  >
                    {r.status}
                  </span>
                </div>

<div className="px-4 pt-4 pb-2">

{/* Description */}
{(() => {
  const key = `reportDesc_${r.targetType}_${r.targetId}`;
  const storedDescription = localStorage.getItem(key);

  return (
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase mb-1 mt-3">
          Report Reason
      </p>
      <div className="bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-black rounded">
        {storedDescription || "There is no description."}
      </div>
    </div>
  );
})()}

{/* Resolution */}
  {r.resolutionReason && (
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase mb-1 mt-3">
        Resolution
      </p>
      <div className="bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-black rounded">
        {r.resolutionReason}
      </div>
    </div>
)}

</div>

</div>
);
})}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <span className="text-sm text-gray-500">
            {sortedReports.length > 0
              ? `Showing ${indexOfFirst + 1}-${Math.min(
                  indexOfLast,
                  sortedReports.length
                )} of ${sortedReports.length}`
              : "No reports to show"}
          </span>
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                className={`px-3 py-1 rounded-md border text-sm ${
                  currentPage === n
                    ? "bg-blue-400 text-white"
                    : "bg-white text-black"
                }`}
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

// Reusable Dropdown
function Dropdown({ value, onChange, options }) {
  return (
    <div className="relative">
      <select
        className="appearance-none border border-gray-300 rounded-md px-4 py-2 text-sm bg-white pr-8"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-700">
        <FaChevronDown />
      </div>
    </div>
  );
}

// Reusable TabButton
function TabButton({ label, icon: Icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 text-sm px-2 py-1 font-medium ${
        active ? "text-sky-600 border-b-2 border-sky-400" : "text-gray-500"
      }`}
    >
      <Icon />
      {label}
    </button>
  );
}

// Format time-ago helper
function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}