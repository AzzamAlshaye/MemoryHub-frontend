import React, { useEffect, useState } from "react";
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
  FaCommentDots,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { reportService } from "../../service/reportService";
import { pinService } from "../../service/pinService";
import { commentService } from "../../service/commentService";
import { userService } from "../../service/userService";

export default function AdminTicketsPage() {
  const [reports, setReports] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [pinsMap, setPinsMap] = useState({});
  const [commentsMap, setCommentsMap] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("post");
  const [resolutionNotes, setResolutionNotes] = useState({});
  const [statusFilter, setStatusFilter] = useState("All Reports");
  const [sortFilter, setSortFilter] = useState("Newest First");
  const reportsPerPage = 10;

  const postCount = reports.filter((r) => r.targetType === "pin").length;
  const commentCount = reports.filter((r) => r.targetType === "comment").length;
  const acceptedCount = reports.filter((r) => r.status === "accepted").length;
  const rejectedCount = reports.filter((r) => r.status === "rejected").length;
  const pendingCount = reports.filter((r) => r.status === "open").length;

  const statusOptions = ["All Reports", "Open", "Accepted", "Rejected"];

  useEffect(() => {
    async function loadAllData() {
      try {
        const [allReports, allUsers, allPins] = await Promise.all([
          reportService.list(),
          userService.list(),
          pinService.list("public", ""),
        ]);

        setUsersMap(Object.fromEntries(allUsers.map((u) => [u.id, u])));
        setPinsMap(Object.fromEntries(allPins.map((p) => [p.id, p])));

        const commentArrays = await Promise.all(
          allPins.map((pin) => commentService.listByPin(pin.id).catch(() => []))
        );
        const allComments = commentArrays.flat();
        setCommentsMap(Object.fromEntries(allComments.map((c) => [c.id, c])));

        setReports(Array.isArray(allReports) ? allReports : []);
      } catch (err) {
        console.error("Failed loading admin data:", err);
        toast.error("Cannot load admin tickets data");
      }
    }
    loadAllData();
  }, []);

  const filteredReports = reports.filter((r) => {
    const tabOk =
      activeTab === "post"
        ? r.targetType === "pin"
        : r.targetType === "comment";
    const statusOk =
      statusFilter === "All Reports" || r.status === statusFilter.toLowerCase();
    return tabOk && statusOk;
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
    if (status === "accepted") return "bg-green-200 text-green-800";
    if (status === "rejected") return "bg-gray-200 text-gray-800";
    return "bg-yellow-200 text-yellow-800";
  };

  const updateReportStatus = async (id, status) => {
    const reason = resolutionNotes[id] || "";
    try {
      await reportService.updateStatus(id, status, reason);
      setReports((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status, resolutionReason: reason } : r
        )
      );
      toast.success(`Report ${status} successfully`);
    } catch {
      toast.error(`Failed to ${status} report`);
    }
  };

  return (
    <div className="p-6 bg-[#FDF7F0] min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Admin Tickets</h1>
      <ToastContainer />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <StatCard
          label="Total Reports"
          value={reports.length}
          icon={<FaFlag />}
          color="bg-blue-100 text-blue-500"
        />
        <StatCard
          label="Pending"
          value={pendingCount}
          icon={<FaClock />}
          color="bg-yellow-100 text-yellow-500"
        />
        <StatCard
          label="Accepted"
          value={acceptedCount}
          icon={<FaCheckCircle />}
          color="bg-green-100 text-green-500"
        />
        <StatCard
          label="Rejected"
          value={rejectedCount}
          icon={<FaBan />}
          color="bg-gray-100 text-gray-500"
        />
      </div>

      <div className="bg-white border border-gray-300 rounded-xl p-4 shadow">
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center border-b border-gray-300 mb-4">
          <TabButton
            label="Post Reports"
            icon={FaThumbtack}
            active={activeTab === "post"}
            onClick={() => setActiveTab("post")}
            count={postCount}
          />
          <TabButton
            label="Comment Reports"
            icon={FaCommentDots}
            active={activeTab === "comment"}
            onClick={() => setActiveTab("comment")}
            count={commentCount}
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-wrap gap-3">
            <Dropdown
              value={statusFilter}
              onChange={setStatusFilter}
              options={statusOptions}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <Dropdown
              value={sortFilter}
              onChange={setSortFilter}
              options={["Newest First", "Oldest First"]}
            />
          </div>
        </div>

        <div className="space-y-6">
          {currentReports.map((r) => {
            const reporter = usersMap[r.reporter];
            const target =
              r.targetType === "pin"
                ? pinsMap[r.targetId]
                : commentsMap[r.targetId];
            const reportedUser =
              target && usersMap[target.authorId || target.ownerId];
            const location = r.targetType === "pin" ? target?.location : null;

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
                      <p className="text-sm font-semibold text-black">
                        {r.reason}
                      </p>
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border-b border-gray-300">
                  <UserCard label="Reporter" user={reporter} />
                  <UserCard label="Reported User" user={reportedUser} />
                  {location?.lat && location?.lng && (
                    <div>
                      <p className="text-xs font-medium text-gray-400 uppercase mb-1">
                        Location
                      </p>
                      <p className="text-xs text-gray-500">
                        Lat: {location.lat}, Long: {location.lng}
                      </p>
                    </div>
                  )}
                </div>

                <div className="px-4 pt-4 pb-2">
                  <p className="text-xs font-medium text-gray-400 uppercase mb-1">
                    Report Description
                  </p>
                  <div className="bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-black rounded">
                    {r.description}
                  </div>

                  {r.resolutionReason && (
                    <div>
                      <p className="text-xs font-medium text-gray-400 uppercase mb-1 mt-3">
                        Resolution Reason
                      </p>
                      <div className="bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-black rounded mb-1">
                        {r.resolutionReason}
                      </div>
                    </div>
                  )}

                  {r.status === "open" && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-gray-400 uppercase mb-1 mt-3">
                        Resolution Note
                      </p>
                      <textarea
                        className="w-full border border-gray-200 mt-1 rounded px-3 py-2 text-sm"
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

                {r.status === "open" && (
                  <div className="flex flex-wrap justify-end gap-3 items-center px-4 py-3 bg-white border-t border-gray-200">
                    <ActionButton icon={<FaInfoCircle />} label="Details" />
                    <ActionButton
                      icon={<FaCheck />}
                      label="Accept"
                      onClick={() => updateReportStatus(r.id, "accepted")}
                    />
                    <ActionButton
                      icon={<FaTimes />}
                      label="Reject"
                      onClick={() => updateReportStatus(r.id, "rejected")}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 gap-3">
          <span className="text-sm text-gray-500">
            Showing {indexOfFirst + 1}-
            {Math.min(indexOfLast, sortedReports.length)} of{" "}
            {sortedReports.length} reports
          </span>
          <div className="flex gap-2 flex-wrap">
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

function TabButton({ label, icon: Icon, active, onClick, count }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 text-sm px-2 py-1 font-medium ${
        active ? "text-sky-600 border-b-2 border-sky-400" : "text-gray-500"
      }`}
    >
      <Icon className={active ? "text-sky-400" : "text-gray-400"} />
      {label}
      <span
        className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
          active ? "bg-sky-200 text-sky-900" : "bg-gray-200 text-gray-700"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function UserCard({ label, user }) {
  return (
    <div className="border-r border-gray-300 pr-4">
      <p className="text-xs font-medium text-gray-400 uppercase mb-1">
        {label}
      </p>
      {user ? (
        <div className="flex items-center gap-2">
          <img
            src={user.avatar}
            alt="avatar"
            className="w-6 h-6 rounded-full"
          />
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
  const base =
    "flex items-center gap-2 text-sm px-3 py-1 border border-gray-300 rounded font-medium transition-colors duration-150";
  const colors = {
    Details: "text-gray-700 hover:text-white hover:bg-gray-400",
    Accept: "text-green-600 hover:text-white hover:bg-green-500",
    Reject: "text-red-600 hover:text-white hover:bg-red-500",
  };
  return (
    <button className={`${base} ${colors[label]}`} onClick={onClick}>
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

function StatCard({ label, value, icon, color }) {
  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-xl shadow-sm ${color}`}
    >
      <div className="text-2xl">{icon}</div>
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}
