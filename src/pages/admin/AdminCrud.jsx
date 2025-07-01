// UserManagementPage.jsx
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
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <ToastContainer />
      <h1 className="text-3xl font-semibold mb-4 text-gray-800">User Management</h1>

      {/* Add User Box */}
      <div className="max-w-6xl mx-auto bg-white shadow border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Create New User</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Full name"
            className="px-4 py-2 border border-gray-300 rounded-md text-sm"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            className="px-4 py-2 border border-gray-300 rounded-md text-sm"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <input
            type="text"
            placeholder="Avatar URL"
            className="px-4 py-2 border border-gray-300 rounded-md text-sm"
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

      {/* Filters + Table Box */}
      <div className="max-w-6xl mx-auto bg-white shadow border border-gray-200 rounded-lg p-6">
        {/* Filters Row */}
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4 flex flex-col sm:flex-row justify-between gap-4 items-center">
          <input
            type="text"
            placeholder="Search users..."
            className="px-4 py-2 border border-gray-300 rounded-md w-full sm:max-w-xs text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-gray-200 rounded-md">
          <table className="w-full text-sm">
            <thead className="bg-blue-50">
              <tr className="text-gray-600">
                <th className="text-left px-4 py-2">NAME</th>
                <th className="text-left px-4 py-2">EMAIL</th>
                <th className="text-left px-4 py-2">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-2 flex items-center gap-2">
                    <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
                    <span className="text-gray-800 font-medium">{user.name}</span>
                  </td>
                  <td className="px-4 py-2 text-gray-600">{user.email}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <FaEdit className="text-blue-500 cursor-pointer" title="Edit" />
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
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-500">
            Showing {indexOfFirst + 1} to {Math.min(indexOfLast, filtered.length)} of {filtered.length} users
          </p>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setCurrentPage(n)}
                className={`w-8 h-8 text-sm rounded border border-gray-300 ${
                  currentPage === n ? "bg-blue-500 text-white" : "bg-white text-gray-700"
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
