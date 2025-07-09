// src/pages/admin/AdminTicketsPage.jsx
import React, { useEffect, useState } from "react";
import {
  FaCheck,
  FaTimes,
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
    if (status === "accepted") return "bg-main-theme text-white-theme";
    if (status === "rejected") return "bg-dark-theme text-white-theme";
    /* open */ return "bg-lighter-theme text-dark-theme";
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
    <div className="p-6 bg-white-theme min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-dark-theme">Admin Tickets</h1>
      <ToastContainer />

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Reports"
          value={reports.length}
          icon={<FaFlag className="text-main-theme" />}
          color="bg-white-theme border border-lighter-theme"
        />
        <StatCard
          label="Pending"
          value={pendingCount}
          icon={<FaClock className="text-main-theme" />}
          color="bg-white-theme border border-lighter-theme"
        />
        <StatCard
          label="Accepted"
          value={acceptedCount}
          icon={<FaCheckCircle className="text-main-theme" />}
          color="bg-white-theme border border-lighter-theme"
        />
        <StatCard
          label="Rejected"
          value={rejectedCount}
          icon={<FaBan className="text-main-theme" />}
          color="bg-white-theme border border-lighter-theme"
        />
      </div>

      <div className="bg-white-theme border border-lighter-theme rounded-xl p-4 shadow">
        {/* Tabs */}
        <div className="flex gap-4 mb-4 border-b border-lighter-theme pb-2">
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

        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <Dropdown
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusOptions}
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-dark-theme">Sort by:</span>
            <Dropdown
              value={sortFilter}
              onChange={setSortFilter}
              options={["Newest First", "Oldest First"]}
            />
          </div>
        </div>

        {/* Report Items */}
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
                className="border border-lighter-theme bg-white-theme rounded-md shadow"
              >
                {/* Header */}
                <div className="flex justify-between items-center px-4 py-2 bg-lighter-theme">
                  <div className="flex items-center gap-2">
                    <div className="bg-white-theme p-2 rounded-full text-main-theme text-base">
                      <FaFlag />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white leading-tight">
                        {r.reason}
                      </p>
                      <p className="text-xs text-white ">
                        {formatTimeAgo(r.createdAt)}
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

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border-b border-lighter-theme">
                  <UserCard label="Reporter" user={reporter} />
                  <UserCard label="Reported User" user={reportedUser} />
                  {location?.lat && (
                    <div>
                      <p className="text-xs font-medium text-dark-theme uppercase mb-1">
                        Location
                      </p>
                      <p className="text-sm text-dark-theme">
                        Lat: {location.lat}, Lng: {location.lng}
                      </p>
                    </div>
                  )}
                </div>

                {/* Description & Resolution */}
                <div className="px-4 pt-4 pb-2">
                  <p className="text-xs font-medium text-dark-theme uppercase mb-1">
                    Description
                  </p>
                  <div className="bg-white-theme border border-lighter-theme px-4 py-3 text-sm text-dark-theme rounded">
                    {r.description}
                  </div>
                  {r.resolutionReason && (
                    <>
                      <p className="text-xs font-medium text-dark-theme uppercase mt-3 mb-1">
                        Resolution Reason
                      </p>
                      <div className="bg-white-theme border border-lighter-theme px-4 py-3 text-sm text-dark-theme rounded">
                        {r.resolutionReason}
                      </div>
                    </>
                  )}
                  {r.status === "open" && (
                    <>
                      <p className="text-xs font-medium text-dark-theme uppercase mt-3 mb-1">
                        Resolution Note
                      </p>
                      <textarea
                        className="w-full border border-lighter-theme rounded px-3 py-2 text-sm text-dark-theme"
                        placeholder="Write resolution reason..."
                        value={resolutionNotes[r.id] || ""}
                        onChange={(e) =>
                          setResolutionNotes((prev) => ({
                            ...prev,
                            [r.id]: e.target.value,
                          }))
                        }
                      />
                    </>
                  )}
                </div>

                {/* Action Buttons */}
                {r.status === "open" && (
                  <div className="flex flex-wrap justify-end gap-3 items-center px-4 py-3 bg-white-theme border-t border-lighter-theme">
                    <ActionButton
                      icon={<FaTimes />}
                      label="Reject"
                      onClick={() => updateReportStatus(r.id, "rejected")}
                    />
                    <ActionButton
                      icon={<FaCheck />}
                      label="Accept"
                      onClick={() => updateReportStatus(r.id, "accepted")}
                    />
                    <ActionButton icon={<FaFlag />} label="Details" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6">
          <span className="text-sm text-dark-theme">
            Showing {indexOfFirst + 1}–
            {Math.min(indexOfLast, sortedReports.length)} of{" "}
            {sortedReports.length}
          </span>
          <div className="flex gap-2 flex-wrap">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setCurrentPage(n)}
                className={`
                  px-3 py-1 rounded-md text-sm border
                  ${
                    n === currentPage
                      ? "bg-main-theme text-white-theme border-main-theme"
                      : "bg-white-theme text-dark-theme border-lighter-theme"
                  }
                `}
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

// ─── Subcomponents ───────────────────────────────────────────────────

function TabButton({ label, icon: Icon, active, onClick, count }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 text-sm px-3 py-1 font-medium
        ${
          active
            ? "text-main-theme border-b-2 border-main-theme"
            : "text-dark-theme"
        }
      `}
    >
      <Icon className={active ? "text-main-theme" : "text-dark-theme"} />
      {label}
      <span
        className={`
          ml-1 px-2 py-0.5 rounded-full text-xs font-semibold
          ${
            active
              ? "bg-lighter-theme text-dark-theme"
              : "bg-white-theme text-dark-theme border border-lighter-theme"
          }
        `}
      >
        {count}
      </span>
    </button>
  );
}

function UserCard({ label, user }) {
  return (
    <div className="border-r border-lighter-theme pr-4">
      <p className="text-xs font-medium text-dark-theme uppercase mb-1">
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
            <p className="text-sm font-semibold text-dark-theme">{user.name}</p>
            <p className="text-xs text-dark-theme">{user.email}</p>
          </div>
        </div>
      ) : (
        <p className="text-xs text-dark-theme">Unknown</p>
      )}
    </div>
  );
}

function ActionButton({ icon, label, onClick }) {
  let styles =
    {
      Details: "text-dark-theme hover:bg-lighter-theme",
      Accept: "bg-main-theme text-white-theme hover:bg-dark-theme",
      Reject: "bg-dark-theme text-white-theme hover:bg-lighter-theme",
    }[label] || "text-dark-theme";
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 text-sm px-3 py-1 rounded-md border
        transition-colors duration-150 ${styles}
      `}
    >
      {icon} {label}
    </button>
  );
}

function Dropdown({ value, onChange, options }) {
  return (
    <div className="relative">
      <select
        className="
          appearance-none border border-dark-theme rounded-md
          px-4 py-2 text-sm text-dark-theme bg-white-theme pr-8
        "
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 text-dark-theme">
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
        <p className="text-xs font-semibold text-black uppercase">{label}</p>
        <p className="text-xl font-bold text-black">{value}</p>
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
