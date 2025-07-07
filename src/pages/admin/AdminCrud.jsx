import React, { useEffect, useState } from "react";
import { FaTrashAlt, FaPlus, FaEdit, FaArrowLeft, FaArrowRight } from "react-icons/fa";
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
    } catch (error) {
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
    } catch (error) {
      toast.error("Failed to add user");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This user will be deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
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

  const cancelEdit = () => {
    setEditingUser(null);
  };

  const filtered = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / usersPerPage);
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filtered.slice(indexOfFirst, indexOfLast);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-[#FDF7F0] min-h-screen">
      <ToastContainer />
      <h1 className="text-2xl font-bold text-gray-800 mb-6">User Management</h1>

      <div className="bg-white border border-gray-300 rounded-xl p-4 sm:p-6 shadow mb-6 w-full">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Create New User</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Full name"
            className="px-4 py-2 border border-gray-300 rounded-md text-sm 
            focus:outline-none focus:ring-0 focus:border-blue-300"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            className="px-4 py-2 border border-gray-300 rounded-md text-sm
            focus:outline-none focus:ring-0 focus:border-blue-300"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="px-4 py-2 border border-gray-300 rounded-md text-sm
            focus:outline-none focus:ring-0 focus:border-blue-300"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          />
        </div>
        <button
          onClick={handleAddUser}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm"
        >
          <FaPlus /> Add User
        </button>
      </div>

      <div className="bg-white border border-gray-300 rounded-xl p-4 sm:p-6 shadow w-full">
        <div className="bg-gray-50 p-4 rounded-md border border-gray-300 mb-4 flex flex-col sm:flex-row justify-between gap-4 items-center">
          <input
            type="text"
            placeholder="Search users..."
            className="px-4 py-2 border border-gray-300 rounded-md text-sm w-full sm:max-w-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

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
                <tr key={user.id} className="border-t border-gray-300 hover:bg-gray-50">
                  <td className="px-4 py-2">
                    {editingUser === user.id ? (
                      <input
                        className="border border-gray-300 rounded px-2 py-1 text-sm
                        focus:outline-none focus:ring-0 focus:border-blue-300"
                        value={editedData.name}
                        onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                      />
                    ) : (
                      user.name
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editingUser === user.id ? (
                      <input
                        className="border border-gray-300 rounded px-2 py-1 text-sm
                        focus:outline-none focus:ring-0 focus:border-blue-300"
                        value={editedData.email}
                        onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    {editingUser === user.id ? (
                      <>
                        <button onClick={() => saveEdit(user.id)} className="text-green-600 text-sm font-semibold">Save</button>
                        <button onClick={cancelEdit} className="text-gray-500 text-sm font-semibold">Cancel</button>
                      </>
                    ) : (
                      <FaEdit className="text-blue-500 cursor-pointer" title="Edit" onClick={() => handleEdit(user)} />
                    )}
{editingUser !== user.id && (
  <FaTrashAlt
    className="text-red-500 cursor-pointer"
    title="Delete"
    onClick={() => handleDelete(user.id)}
  />
)}

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-6">
  <p className="text-sm text-gray-500">
    Showing {indexOfFirst + 1} to {Math.min(indexOfLast, filtered.length)} of {filtered.length} users
  </p>

  <div className="flex items-center gap-4">
    {/* زر السابق */}
    <button
      onClick={() => goToPage(currentPage - 1)}
      disabled={currentPage === 1}
      className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
    >
      <FaArrowLeft />
    </button>

    {/*page no# and edit page no#*/}
    <div className="flex items-center gap-1 text-sm text-gray-700">
      Page
      <input
        type="number"
        min={1}
        max={totalPages}
        value={currentPage}
        onChange={(e) => {
          const page = Number(e.target.value);
          if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
          }
        }}
        className="w-14 px-2 py-1 border border-gray-300 rounded text-center 
        focus:outline-none focus:ring-0 focus:border-blue-300"
      />
      of {totalPages}
    </div>

    {/* next btn*/}
    <button
      onClick={() => goToPage(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
    >
      <FaArrowRight />
    </button>
  </div>
</div>

      </div>
    </div>
  );
}
