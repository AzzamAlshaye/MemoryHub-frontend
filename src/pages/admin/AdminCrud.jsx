import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrashAlt, FaPlus, FaEdit } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const USERS_API = "https://685cc514769de2bf085dc721.mockapi.io/users";

export default function AdminCrud() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [newUser, setNewUser] = useState({ name: "", email: "", avatar: "" });
  const usersPerPage = 5;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get(USERS_API);
    setUsers(res.data);
  };

  const filtered = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / usersPerPage);

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.avatar) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      const res = await axios.post(USERS_API, newUser);
      setUsers((prev) => [...prev, res.data]);
      setNewUser({ name: "", email: "", avatar: "" });
      toast.success("User added successfully");
    } catch {
      toast.error("Failed to add user");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${USERS_API}/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("User deleted");
    } catch {
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <ToastContainer />
      <h1 className="text-2xl font-bold text-gray-800 mb-6">User Management</h1>

      {/* Create User Box */}
      <div className="bg-white border border-gray-300 rounded-xl p-4 sm:p-6 shadow mb-6 w-full">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Create New User</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Full name"
            className="px-4 py-2 border border-gray-300 rounded-md text-sm w-full"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            className="px-4 py-2 border border-gray-300 rounded-md text-sm w-full"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <input
            type="text"
            placeholder="Avatar URL"
            className="px-4 py-2 border border-gray-300 rounded-md text-sm w-full"
            value={newUser.avatar}
            onChange={(e) => setNewUser({ ...newUser, avatar: e.target.value })}
          />
        </div>
        <button
          onClick={handleAddUser}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm"
        >
          <FaPlus /> Add User
        </button>
      </div>

      {/* Search + Table Box */}
      <div className="bg-white border border-gray-300 rounded-xl p-4 sm:p-6 shadow w-full">
        {/* Search bar */}
        <div className="bg-gray-50 p-4 rounded-md border border-gray-300 mb-4 flex flex-col sm:flex-row justify-between gap-4 items-center">
          <input
            type="text"
            placeholder="Search users..."
            className="px-4 py-2 border border-gray-300 rounded-md text-sm w-full sm:max-w-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-gray-300 rounded-md">
          <table className="min-w-[600px] w-full text-sm">
            <thead className="bg-blue-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-2">NAME</th>
                <th className="text-left px-4 py-2">EMAIL</th>
                <th className="text-left px-4 py-2">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-gray-300 hover:bg-gray-50"
                >
                  <td className="px-4 py-2 flex items-center gap-2">
                    <img
                      src={user.avatar}
                      alt="avatar"
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-gray-800 font-medium">{user.name}</span>
                  </td>
                  <td className="px-4 py-2 text-gray-600">{user.email}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <FaEdit
                      className="text-blue-500 cursor-pointer"
                      title="Edit"
                    />
                    <FaTrashAlt
                      className="text-red-500 cursor-pointer"
                      title="Delete"
                      onClick={() => handleDelete(user.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-3">
          <p className="text-sm text-gray-500 text-center sm:text-left">
            Showing {indexOfFirst + 1} to {Math.min(indexOfLast, filtered.length)} of {filtered.length} users
          </p>
          <div className="flex flex-wrap gap-1 justify-center sm:justify-end">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setCurrentPage(n)}
                className={`w-8 h-8 text-sm rounded border border-gray-300 ${
                  currentPage === n
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700"
                }`}
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
