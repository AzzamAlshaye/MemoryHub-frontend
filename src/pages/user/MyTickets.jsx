import React, { useEffect, useState } from "react";
import {
  FaFlag,
  FaThumbtack,
  FaCommentDots,
  FaChevronDown,
} from "react-icons/fa";
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
        setCurrentUserId(user.id);

        // const result = await reportService.list();
        const result = await reportService.listMy();

        const allReports = Array.isArray(result) ? result : result?.data || [];

        const pinsData = await pinService.list();
        const pins = Array.isArray(pinsData) ? pinsData : [];
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
    "Pending": "open",
    "Resolved": "resolved",
    "Dismissed": "dismissed",
  };

  const filteredReports = reports.filter((r) => {
    const isCorrectTab =
      activeTab === "post" ? r.targetType === "pin" : r.targetType === "comment";
    const statusMatch =
      !statusMap[statusFilter] || r.status === statusMap[statusFilter];
    return isCorrectTab && statusMatch;
  });

  const sortedReports = [...filteredReports].sort((a, b) => {
    if (sortFilter === "Newest First")
      return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortFilter === "Oldest First")
      return new Date(a.createdAt) - new Date(b.createdAt);
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

  return (
<<<<<<< HEAD
    <div className="p-6 bg-gradient-to-tr from-amber-50 to-amber-200 min-h-screen">
=======
    <div className="p-6 bg-[#FDF7F0] min-h-screen">
      {/* Page title and toast container for messages */}
>>>>>>> 4542b485d96d4b2a2ede3827eea58a5d1306d77b
      <h1 className="text-2xl font-bold mb-6 text-gray-800">My Tickets</h1>
      <ToastContainer />
      <div className="bg-white border border-gray-300 rounded-xl p-4 shadow">
        {/* Tabs */}
        <div className="flex gap-4 border-b mb-4">
          <TabButton
            label="Post Reports"
            icon={FaThumbtack}
            active={activeTab === "post"}
            onClick={() => setActiveTab("post")}
          />
          <TabButton
            label="Comment Reports"
            icon={FaCommentDots}
            active={activeTab === "comment"}
            onClick={() => setActiveTab("comment")}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center mb-6">
          <Dropdown
            value={statusFilter}
            onChange={setStatusFilter}
            options={["All Reports", "Pending", "Resolved", "Dismissed"]}
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <Dropdown
              value={sortFilter}
              onChange={setSortFilter}
              options={["Newest First", "Oldest First"]}
            />
          </div>
        </div>

        {/* Report List */}
        <div className="space-y-6">
          {currentReports.map((r) => {
            const target =
              r.targetType === "pin" ? pinsMap[r.targetId] : commentsMap[r.targetId];

            if (!target) {
              return (
                <div
                  key={r.id}
                  className="p-4 border border-red-300 rounded bg-red-50 text-red-700"
                >
                  <p>Target not found (ID: {r.targetId}, type: {r.targetType})</p>
                </div>
              );
            }

            return (
              <div
                key={r.id}
                className="border border-gray-300 bg-white rounded-md shadow overflow-hidden"
              >
                <div className="flex justify-between items-center px-4 py-2 bg-red-100">
                  <div className="flex items-center gap-2">
                    <div className="bg-white p-2 rounded-full text-red-600 text-base">
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
                  <p className="text-xs font-medium text-gray-400 uppercase mb-1">
                    Report Reason
                  </p>
                  <div className="bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-black rounded">
                    {r.reason}
                  </div>

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
            Showing {indexOfFirst + 1}-{Math.min(indexOfLast, sortedReports.length)} of{" "}
            {sortedReports.length}
          </span>
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                className={`px-3 py-1 rounded-md border text-sm ${
                  currentPage === n ? "bg-blue-400 text-white" : "bg-white text-black"
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

function Dropdown({ value, onChange, options }) {
  return (
    <div className="relative">
      <select
        className="appearance-none border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-black bg-white pr-8"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-700">
        <FaChevronDown />
      </div>
    </div>
  );
}

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

function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}
