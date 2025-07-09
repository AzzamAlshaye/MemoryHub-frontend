// src/pages/admin/AdminCrud.jsx
import React, { useEffect, useState } from "react";
import {
  FaTrashAlt,
  FaPlus,
  FaEdit,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { userService } from "../../service/userService";

export default function AdminCrud() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "" });
  const [editingUser, setEditingUser] = useState(null);
  const [editedData, setEditedData] = useState({ name: "", email: "" });

  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await userService.list();
      setUsers(data);
    } catch {
      toast.error("Failed to fetch users");
    }
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      const res = await userService.create(newUser);
      setUsers((prev) => [...prev, res]);
      setNewUser({ name: "", email: "", password: "" });
      toast.success("User added successfully");
    } catch {
      toast.error("Failed to add user");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This user will be deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ca6e40", // dark-theme
      cancelButtonColor: "#fda073", // lighter-theme
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await userService.remove(id);
        setUsers((prev) => prev.filter((u) => u.id !== id));
        toast.success("User deleted");
      } catch {
        toast.error("Failed to delete user");
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user.id);
    setEditedData({ name: user.name, email: user.email });
  };

  const saveEdit = async (id) => {
    try {
      const updated = await userService.update(id, editedData);
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
      setEditingUser(null);
      toast.success("User updated");
    } catch {
      toast.error("Update failed");
    }
  };

  const cancelEdit = () => setEditingUser(null);

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / usersPerPage);
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filtered.slice(indexOfFirst, indexOfLast);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="p-4 sm:p-6 bg-white-theme min-h-screen">
      <ToastContainer />

      <h1 className="text-2xl font-bold text-dark-theme mb-6">
        User Management
      </h1>

      {/* Create New User */}
      <div className="bg-white border border-white-theme rounded-xl p-4 sm:p-6 shadow mb-6 w-full">
        <h2 className="text-lg font-semibold text-dark-theme mb-4">
          Create New User
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {["name", "email", "password"].map((field, i) => (
            <input
              key={i}
              type={
                field === "password"
                  ? "password"
                  : field === "email"
                  ? "email"
                  : "text"
              }
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="
                px-4 py-2 border border-dark-theme rounded-md text-sm
                focus:outline-none focus:ring-0 focus:border-main-theme
              "
              value={newUser[field]}
              onChange={(e) =>
                setNewUser({ ...newUser, [field]: e.target.value })
              }
            />
          ))}
        </div>
        <button
          onClick={handleAddUser}
          className="
            mt-4 bg-main-theme hover:bg-dark-theme text-white-theme
            px-4 py-2 rounded-md flex items-center gap-2 text-sm
          "
        >
          <FaPlus /> Add User
        </button>
      </div>

      {/* Search & Table */}
      <div className="bg-white border border-white-theme rounded-xl p-4 sm:p-6 shadow w-full">
        <div
          className="
          p-4 rounded-md 
          mb-4 flex flex-col sm:flex-row justify-between gap-4 items-center
        "
        >
          <input
            type="text"
            placeholder="Search users..."
            className="
              px-4 py-2 border border-lighter-theme rounded-md text-sm
              w-full sm:max-w-xs focus:outline-none focus:ring-0 focus:border-main-theme
            "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto border border-lighter-theme rounded-md">
          <table className="min-w-[600px] w-full text-sm">
            <thead className="bg-white-theme text-dark-theme border-b border-lighter-theme">
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
                  className="border-t border-lighter-theme hover:bg-white-theme"
                >
                  <td className="px-4 py-2">
                    {editingUser === user.id ? (
                      <input
                        className="
                          border border-lighter-theme rounded px-2 py-1 text-sm
                          focus:outline-none focus:ring-0 focus:border-main-theme
                        "
                        value={editedData.name}
                        onChange={(e) =>
                          setEditedData({ ...editedData, name: e.target.value })
                        }
                      />
                    ) : (
                      user.name
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editingUser === user.id ? (
                      <input
                        className="
                          border border-dark-theme rounded px-2 py-1 text-sm
                          focus:outline-none focus:ring-0 focus:border-main-theme
                        "
                        value={editedData.email}
                        onChange={(e) =>
                          setEditedData({
                            ...editedData,
                            email: e.target.value,
                          })
                        }
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="px-4 py-2 flex gap-4 text-xl">
                    {editingUser === user.id ? (
                      <>
                        <button
                          onClick={() => saveEdit(user.id)}
                          className="text-main-theme text-sm font-semibold"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="text-dark-theme text-sm font-semibold"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <FaEdit
                          className="text-main-theme cursor-pointer"
                          title="Edit"
                          onClick={() => handleEdit(user)}
                        />
                        <FaTrashAlt
                          className="text-red-500 cursor-pointer"
                          title="Delete"
                          onClick={() => handleDelete(user.id)}
                        />
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-dark-theme">
            Showing {indexOfFirst + 1} to{" "}
            {Math.min(indexOfLast, filtered.length)} of {filtered.length} users
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="
                px-3 py-1 text-sm bg-white-theme border border-lighter-theme
                text-dark-theme rounded disabled:opacity-50 hover:bg-lighter-theme
              "
            >
              <FaArrowLeft />
            </button>
            <div className="flex items-center gap-1 text-sm text-dark-theme">
              Page
              <input
                type="number"
                min={1}
                max={totalPages}
                value={currentPage}
                onChange={(e) => goToPage(Number(e.target.value))}
                className="
                  w-14 px-2 py-1 border border-dark-theme rounded text-center 
                  focus:outline-none focus:ring-0 focus:border-main-theme
                "
              />
              of {totalPages}
            </div>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="
                px-3 py-1 text-sm bg-white-theme border border-lighter-theme
                text-dark-theme rounded disabled:opacity-50 hover:bg-lighter-theme
              "
            >
              <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
