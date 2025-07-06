// import React from "react";
// import {
//   FaMapMarkedAlt,
//   FaHome,
//   FaUsers,
//   FaTicketAlt,
//   FaCamera,
//   FaEdit,
//   FaTrash,
// } from "react-icons/fa";

// function ProfilePage() {
//   const memories = [
//     {
//       title: "Sunset Beach Walk",
//       location: "Malibu, California",
//       description:
//         "Beautiful sunset walk along the beach. The colors were absolutely breathtaking!",
//       date: "June 15, 2023",
//       visibility: "Public",
//       image: "/Sunset.png",
//     },
//     {
//       title: "City Lights",
//       location: "New York City, NY",
//       description:
//         "The city that never sleeps. Amazing view from the rooftop bar!",
//       date: "May 28, 2023",
//       visibility: "Private",
//       image: "/City.png",
//     },
//     {
//       title: "Mountain Trail",
//       location: "Rocky Mountains, CO",
//       description:
//         "Hiking with friends in the Rockies. Such an amazing experience!",
//       date: "April 10, 2023",
//       visibility: "Group",
//       image: "/Mountain.png",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
//       <div className="w-full md:w-64 bg-white border-r flex flex-col justify-between p-6">
//         <div>
//           <div className="flex items-center gap-2 text-blue-600 font-bold text-lg mb-10">
//             <FaMapMarkedAlt className="text-xl" /> Map Memory
//           </div>
//           <ul className="space-y-4">
//             <li>
//               <a
//                 href="/Home"
//                 className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
//               >
//                 <FaHome /> Home
//               </a>
//             </li>
//             <li>
//               <a
//                 href="/map"
//                 className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
//               >
//                 <FaMapMarkedAlt /> Map
//               </a>
//             </li>
//             <li>
//               <a
//                 href="/communities"
//                 className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
//               >
//                 <FaUsers /> Communities
//               </a>
//             </li>
//             <li>
//               <a
//                 href="/tickets"
//                 className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
//               >
//                 <FaTicketAlt /> My Tickets
//               </a>
//             </li>
//           </ul>
//         </div>

//         <div className="mt-10 flex items-center gap-3">
//           <img
//             src="https://randomuser.me/api/portraits/women/45.jpg"
//             alt="Sarah Johnson"
//             className="w-10 h-10 rounded-full"
//           />
//           <div>
//             <p className="text-sm font-semibold">Sarah Johnson</p>
//             <a href="#" className="text-xs text-blue-500">
//               View Profile
//             </a>
//           </div>
//         </div>
//       </div>

//       <div className="flex-1 p-6 flex flex-col justify-between">
//         <div>
//           <div className="grid md:grid-cols-2 gap-6 mb-10">
//             <div className="bg-white p-6 rounded-lg shadow">
//               <div className="flex flex-col items-center">
//                 <div className="relative">
//                   <img
//                     src="https://randomuser.me/api/portraits/women/45.jpg"
//                     className="w-28 h-28 rounded-full"
//                   />
//                   <button className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full text-white text-sm">
//                     <FaCamera />
//                   </button>
//                 </div>
//                 <h3 className="mt-4 text-lg font-semibold">Sarah Johnson</h3>
//                 <p className="text-gray-500 text-sm">@sarahjohnson</p>
//                 <p className="text-gray-400 text-xs mt-1">New York, USA</p>
//                 <p className="text-gray-400 text-xs">Joined April 2023</p>
//                 <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded text-sm">
//                   Share Profile
//                 </button>
//               </div>
//             </div>
//             <div className="bg-white p-6 rounded-lg shadow">
//               <h2 className="text-lg font-semibold mb-4">
//                 Personal Information
//               </h2>
//               <form className="space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium">
//                       Full Name
//                     </label>
//                     <input
//                       type="text"
//                       className="w-full border rounded px-3 py-2 mt-1"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium">
//                       Username
//                     </label>
//                     <input
//                       type="text"
//                       className="w-full border rounded px-3 py-2 mt-1"
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium">Email</label>
//                   <input
//                     type="email"
//                     className="w-full border rounded px-3 py-2 mt-1"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium">Phone</label>
//                   <input
//                     type="text"
//                     className="w-full border rounded px-3 py-2 mt-1"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium">Password</label>
//                   <input
//                     type="password"
//                     className="w-full border rounded px-3 py-2 mt-1"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium">Bio</label>
//                   <textarea
//                     className="w-full border rounded px-3 py-2 mt-1"
//                     rows={3}
//                   ></textarea>
//                 </div>
//                 <div className="flex justify-end gap-3">
//                   <button className="px-4 py-2 border rounded text-sm">
//                     Cancel
//                   </button>
//                   <button className="px-4 py-2 bg-blue-500 text-white rounded text-sm">
//                     Save Changes
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>

//           <div className="mb-6 flex items-center justify-between">
//             <h2 className="text-lg font-semibold">my Memories</h2>
//             <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded">
//               + New Memory
//             </button>
//           </div>
//           <div className="grid md:grid-cols-3 gap-4">
//             {memories.map((memory, i) => (
//               <div key={i} className="bg-white rounded shadow overflow-hidden">
//                 <div className="relative">
//                   <img
//                     src={memory.image}
//                     alt={memory.title}
//                     className="w-full h-40 object-cover"
//                   />
//                   <div className="absolute top-2 right-2 flex gap-2">
//                     <button className="p-1 bg-white rounded-full shadow">
//                       <FaEdit className="text-sm" />
//                     </button>
//                     <button className="p-1 bg-white rounded-full shadow">
//                       <FaTrash className="text-sm text-red-500" />
//                     </button>
//                   </div>
//                   <span className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
//                     {memory.visibility}
//                   </span>
//                 </div>
//                 <div className="p-4">
//                   <h3 className="font-semibold text-sm">{memory.title}</h3>
//                   <p className="text-gray-500 text-xs">{memory.location}</p>
//                   <p className="text-gray-500 text-xs mt-1">
//                     {memory.description}
//                   </p>
//                   <p className="text-gray-400 text-xs mt-1">{memory.date}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ProfilePage;



import React, { useEffect, useState } from "react"
import {
  FaEnvelope,
  FaCamera,
  FaEllipsisV,
  FaEdit,
  FaTrash,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa"
import { userService } from "../../service/userService"
import { pinService } from "../../service/pinService"

function Profile() {
  const [user, setUser] = useState(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [editingPin, setEditingPin] = useState(null)
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    privacy: "",
  })
  const [memories, setMemories] = useState([])
  const [avatarFile, setAvatarFile] = useState(null)

  // هذا احتياط لحد يحذفه
  // useEffect(() => {
  //   userService.getCurrentUser().then((data) => {
  //     setUser(data);
  //     setName(data.name || "");
  //     setEmail(data.email || "");
  //   });

  //   pinService.list().then((data) => {
  //     setMemories(data || []);
  //   });
  // }, []);
useEffect(() => {
  let currentUserId = null;

  userService.getCurrentUser()
    .then((data) => {
      setUser(data);
      setName(data.name || "");
      setEmail(data.email || "");
      currentUserId = data.id;

      pinService.list("", "") 
        .then((pins) => {
          const filteredPins = (pins || []).filter(
            (pin) => String(pin.owner?._id || pin.owner) === String(currentUserId)
          );
          setMemories(filteredPins);

          const storedNewPin = localStorage.getItem("newPin");
          if (storedNewPin) {
            const newPin = JSON.parse(storedNewPin);
            if (String(newPin.owner?._id || newPin.owner) === String(currentUserId)) {
              setMemories((prev) => [...prev, newPin]);
            }
            localStorage.removeItem("newPin");
          }
        })
        .catch((err) => console.error("Failed to fetch memories", err));
    })
    .catch((err) => console.error("Failed to fetch user", err));
}, []);

<<<<<<< HEAD


=======
  useEffect(() => {
    let currentUserId = null

    userService
      .getCurrentUser()
      .then((data) => {
        setUser(data)
        setName(data.name || "")
        setEmail(data.email || "")
        currentUserId = data.id

        pinService
          .list()
          .then((pins) => {
            const filteredPins = (pins || []).filter(
              (pin) => pin.userId === currentUserId
            )
            setMemories(filteredPins)
          })
          .catch((err) => console.error("Failed to fetch memories", err))
      })
      .catch((err) => console.error("Failed to fetch user", err))
  }, [])
>>>>>>> d66e25e841f51b570db9fd8e5184a436630abe50

  const handleSave = () => {
    const updateData = { name, email }
    if (password.trim()) {
      updateData.password = password
    }

    userService
      .updateSelf(updateData)
      .then((res) => {
        setUser(res)
        setPassword("")
        alert("Profile updated successfully.")
      })
      .catch((err) => {
        console.error("Update failed", err)
        alert("Error updating profile.")
      })
  }

  const handleDeletePin = (pinId) => {
    if (window.confirm("Are you sure you want to delete this pin?")) {
      pinService
        .remove(pinId)
        .then(() => {
          setMemories((prev) => prev.filter((pin) => pin.id !== pinId))
          alert("Pin deleted successfully.")
        })
        .catch((err) => {
          console.error("Failed to delete pin", err)
          alert("Error deleting pin.")
        })
    }
  }

  const handleEditPin = (pin) => {
    setEditingPin(pin)
    setEditForm({
      title: pin.title,
      description: pin.description,
      privacy: pin.privacy,
    })
  }

  const handleSaveEdit = () => {
    pinService
      .update(editingPin.id, editForm)
      .then((updated) => {
        setMemories((prev) =>
          prev.map((pin) => (pin.id === updated.id ? updated : pin))
        )
        setEditingPin(null)
        alert("Pin updated successfully.")
      })
      .catch((err) => {
        console.error("Update failed", err)
        alert("Error updating pin.")
      })
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatarFile(file)
      // will update
      const reader = new FileReader()
      reader.onload = () => {
        setUser((prev) => ({ ...prev, avatar: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <main className="flex-1 p-8 flex flex-col">
        {/* profile */}
        <section className="bg-white rounded-xl shadow-lg p-8 mb-10">
          <div className="flex items-center gap-6 mb-6">
            <div className="relative">
              <img
                src={
                  user?.avatar ||
                  "https://randomuser.me/api/portraits/women/45.jpg"
                }
                className="w-20 h-20 rounded-full border-4 border-blue-500 object-cover"
                alt="Profile"
              />
              <label className="absolute bottom-0 right-0 bg-blue-500 p-1 rounded-full border-2 border-white shadow-lg cursor-pointer">
                <FaCamera className="text-white" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {user?.name || "Loading..."}
              </h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={handleSave}
              className="ml-auto bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg shadow transition"
            >
              Save Changes
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-200 bg-gray-100 rounded-lg px-4 py-2"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-200 bg-gray-100 rounded-lg px-4 py-2"
              />
            </div>
            <div className="flex flex-col relative">
              <label className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-200 bg-gray-100 rounded-lg px-4 py-2 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-[38px] right-3 text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
        </section>

        {/* Memories Section */}
        <section className="flex-1 mb-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            My Memories
          </h3>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {memories.length === 0 && (
              <p className="text-gray-500">No memories to display.</p>
            )}
            {memories.map((memory, idx) => (
              <div
                key={idx}
                className="group bg-white rounded-2xl shadow-2xl overflow-hidden hover:scale-105 transition"
              >
                <div className="relative">
                  <img
                    src={memory.image}
                    alt={memory.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => handleEditPin(memory)}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                    >
                      <FaEdit className="text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDeletePin(memory.id)}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                    >
                      <FaTrash className="text-red-500" />
                    </button>
                  </div>
                  <span className="absolute bottom-4 left-4 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                    {memory.privacy}
                  </span>
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-2">
                    {memory.title}
                  </h4>
<<<<<<< HEAD
    <p className="text-gray-500 text-xs mb-1 uppercase tracking-wide">
  {`${memory.location.lat.toFixed(4)}, ${memory.location.lng.toFixed(4)}`}
</p>
 <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                    {memory.description}
                  </p>
                  {/* <p className="text-gray-400 text-xs">{memory.date}</p> */}
                  <p className="text-gray-400 text-xs">{new Date(memory.createdAt).toLocaleDateString()}</p>
 </div>
=======
                  <p className="text-gray-500 text-xs mb-1 uppercase tracking-wide">
                    {JSON.stringify(memory.location)}
                  </p>
                  <p className="text-gray-400 text-xs">{memory.date}</p>
                </div>
>>>>>>> d66e25e841f51b570db9fd8e5184a436630abe50
              </div>
            ))}
          </div>
{/* edit pins */}
          {editingPin && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h3 className="text-lg font-bold mb-4">Edit Memory</h3>
                <input
                  type="text"
                  placeholder="Title"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  className="w-full mb-3 px-3 py-2 border rounded"
                />
                <textarea
                  placeholder="Description"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="w-full mb-3 px-3 py-2 border rounded"
                />
                <select
                  value={editForm.privacy}
                  onChange={(e) =>
                    setEditForm({ ...editForm, privacy: e.target.value })
                  }
                  className="w-full mb-3 px-3 py-2 border rounded"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingPin(null)}
                    className="px-4 py-2 bg-gray-300 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
