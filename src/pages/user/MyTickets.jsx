// import React, { useEffect, useState } from "react";
// import axios from "axios";
// // import { jwtDecode } from "jwt-decode";
// import {
//   FaFlag,
//   FaThumbtack,
//   FaCommentDots,
//   FaChevronDown,
// } from "react-icons/fa";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function MyTickets() {
//   // Declare all required state variables
//   const [reports, setReports] = useState([]);
//   const [users, setUsers] = useState({});
//   const [pinsMap, setPinsMap] = useState({});
//   const [commentsMap, setCommentsMap] = useState({});
//   const [currentPage, setCurrentPage] = useState(1);
//   const [activeTab, setActiveTab] = useState("post"); // "post" or "comment"

//   // Define API URLs
//   const REPORTS_API = "https://68219a21259dad2655afc28a.mockapi.io/reports";
//   const USERS_API = "https://685cc514769de2bf085dc721.mockapi.io/users";
//   const PINS_API = "https://685cc514769de2bf085dc721.mockapi.io/pins";
//   const COMMENTS_API = "https://683cc42f199a0039e9e35f20.mockapi.io/comments";

//   // Filters for report status and sorting
//   const [statusFilter, setStatusFilter] = useState("All Reports");
//   const [sortFilter, setSortFilter] = useState("Newest First");
//   const reportsPerPage = 3; // How many reports to show per page

//   // Get user ID (for now hardcoded for testing)
//   // const token = localStorage.getItem("token");
//   // const userId = jwtDecode(token).id;
//   const userId = "user_1"; // test user

//   // Fetch data when component mounts
//   useEffect(() => {
//     async function fetchData() {
//       // Make parallel requests to all needed endpoints
//       const [reportsRes, usersRes, pinsRes, commentsRes] = await Promise.all([
//         axios.get(REPORTS_API),
//         axios.get(USERS_API),
//         axios.get(PINS_API),
//         axios.get(COMMENTS_API),
//       ]);

//       // Only include reports created by this user
//       const filtered = reportsRes.data.filter((r) => r.reporter === userId);
//       setReports(filtered);

//       // Create a map of user ID -> user object
//       const usersMap = {};
//       usersRes.data.forEach((u) => (usersMap[u.id] = u));

//       // Create a map of pin ID -> pin object
//       const pins = {};
//       pinsRes.data.forEach((p) => (pins[p.id] = p));

//       // Create a map of comment ID -> comment object
//       const comments = {};
//       commentsRes.data.forEach((c) => (comments[c.id] = c));

//       // Save all maps into state
//       setUsers(usersMap);
//       setPinsMap(pins);
//       setCommentsMap(comments);
//     }
//     fetchData();
//   }, []);

//   // Apply filters for active tab and status
//   const filteredReports = reports.filter((r) => {
//     const isRightTab =
//       activeTab === "post"
//         ? r.targetType === "pin"
//         : r.targetType === "comment";
//     const statusMatch =
//       statusFilter === "All Reports" || r.status === statusFilter.toLowerCase();
//     return isRightTab && statusMatch;
//   });

//   // Sort reports by date
//   const sortedReports = [...filteredReports].sort((a, b) => {
//     if (sortFilter === "Newest First")
//       return new Date(b.createdAt) - new Date(a.createdAt);
//     if (sortFilter === "Oldest First")
//       return new Date(a.createdAt) - new Date(b.createdAt);
//     return 0;
//   });

//   // Pagination calculations
//   const indexOfLast = currentPage * reportsPerPage;
//   const indexOfFirst = indexOfLast - reportsPerPage;
//   const currentReports = sortedReports.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(sortedReports.length / reportsPerPage);

//   // Function to set background color based on status
//   const getStatusColor = (status) => {
//     if (status === "resolved") return "bg-green-200 text-green-800";
//     if (status === "dismissed") return "bg-gray-200 text-gray-800";
//     return "bg-yellow-200 text-yellow-800"; // pending
//   };

//   return (
//     <div className="p-6 bg-[#FDF7F0] min-h-screen">
//       {/* Page title and toast container for messages */}
//       <h1 className="text-2xl font-bold mb-6 text-gray-800">My Tickets</h1>
//       <ToastContainer />

//       <div className="bg-white border border-gray-300 rounded-xl p-4 shadow">
//         {/* Tabs for switching between post and comment reports */}
//         <div className="flex gap-4 items-center border-b border-gray-300 mb-4">
//           <button
//             onClick={() => setActiveTab("post")}
//             className={`flex items-center gap-2 text-sm px-2 py-1 font-medium ${
//               activeTab === "post"
//                 ? "text-sky-600 border-b-2 border-sky-400"
//                 : "text-gray-500"
//             }`}
//           >
//             <FaThumbtack />
//             Post Reports
//           </button>
//           <button
//             onClick={() => setActiveTab("comment")}
//             className={`flex items-center gap-2 text-sm px-2 py-1 font-medium ${
//               activeTab === "comment"
//                 ? "text-sky-600 border-b-2 border-sky-400"
//                 : "text-gray-500"
//             }`}
//           >
//             <FaCommentDots />
//             Comment Reports
//           </button>
//         </div>

//         {/* Filter dropdowns for status and sorting */}
//         <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center mb-6">
//           <Dropdown
//             value={statusFilter}
//             onChange={setStatusFilter}
//             options={["All Reports", "Pending", "Resolved", "Dismissed"]}
//           />
//           <div className="flex items-center gap-2">
//             <span className="text-sm text-gray-500">Sort by:</span>
//             <Dropdown
//               value={sortFilter}
//               onChange={setSortFilter}
//               options={["Newest First", "Oldest First"]}
//             />
//           </div>
//         </div>

//         {/* Report Cards */}
//         <div className="space-y-6">
//           {currentReports.map((r) => {
//             const target =
//               r.targetType === "pin"
//                 ? pinsMap[r.targetId]
//                 : commentsMap[r.targetId];
//             return (
//               <div
//                 key={r.id}
//                 className="border border-gray-300 bg-white rounded-md shadow overflow-hidden"
//               >
//                 {/* Header with flag icon, reason, date, and status */}
//                 <div className="flex justify-between items-center px-4 py-2 bg-red-100">
//                   <div className="flex items-center gap-2">
//                     <div className="bg-white p-2 rounded-full text-red-600 text-base">
//                       <FaFlag />
//                     </div>
//                     <div>
//                       <p className="text-sm font-semibold text-black">
//                         {r.reason}
//                       </p>
//                       <p className="text-xs text-gray-600">
//                         Reported {formatTimeAgo(r.createdAt)}
//                       </p>
//                     </div>
//                   </div>
//                   <span
//                     className={`text-xs font-medium px-2 py-0.5 rounded capitalize ${getStatusColor(
//                       r.status
//                     )}`}
//                   >
//                     {r.status}
//                   </span>
//                 </div>

//                 {/* Report details and resolution if exists */}
//                 <div className="px-4 pt-4 pb-2">
//                   <p className="text-xs font-medium text-gray-400 uppercase mb-1">
//                     Report Reason
//                   </p>
//                   <div className="bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-black rounded">
//                     {r.reason}
//                   </div>

//                   {r.resolutionReason && (
//                     <div>
//                       <p className="text-xs font-medium text-gray-400 uppercase mb-1 mt-3">
//                         Resolution
//                       </p>
//                       <div className="bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-black rounded">
//                         {r.resolutionReason}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* Pagination controls */}
//         <div className="flex justify-between items-center mt-6">
//           <span className="text-sm text-gray-500">
//             Showing {indexOfFirst + 1}-
//             {Math.min(indexOfLast, sortedReports.length)} of{" "}
//             {sortedReports.length}
//           </span>
//           <div className="flex gap-2">
//             {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
//               <button
//                 key={n}
//                 className={`px-3 py-1 rounded-md border text-sm ${
//                   currentPage === n
//                     ? "bg-blue-400 text-white"
//                     : "bg-white text-black"
//                 }`}
//                 onClick={() => setCurrentPage(n)}
//               >
//                 {n}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Dropdown reusable component for filter/sort
// function Dropdown({ value, onChange, options }) {
//   return (
//     <div className="relative">
//       <select
//         className="appearance-none border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-black bg-white pr-8"
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//       >
//         {options.map((opt) => (
//           <option key={opt} value={opt}>
//             {opt}
//           </option>
//         ))}
//       </select>
//       {/* Dropdown arrow icon */}
//       <div className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-700">
//         <FaChevronDown />
//       </div>
//     </div>
//   );
// }

// // Convert a date to "x hours ago" or "x days ago" format
// function formatTimeAgo(dateString) {
//   const date = new Date(dateString);
//   const now = new Date();
//   const diffMs = now - date;
//   const hours = Math.floor(diffMs / 1000 / 60 / 60);
//   const days = Math.floor(hours / 24);
//   if (hours < 1) return "Just now";
//   if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
//   return `${days} day${days > 1 ? "s" : ""} ago`;
// }


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
