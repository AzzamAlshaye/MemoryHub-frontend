import React from 'react';
import { FaMapMarkedAlt, FaHome, FaUsers, FaTicketAlt, FaCamera, FaEdit, FaTrash } from 'react-icons/fa';
import Footer from '../components/Footer';

function ProfilePage() {
  const memories = [
    {
      title: 'Sunset Beach Walk',
      location: 'Malibu, California',
      description: 'Beautiful sunset walk along the beach. The colors were absolutely breathtaking!',
      date: 'June 15, 2023',
      visibility: 'Public',
      image: '/Sunset.png'
    },
    {
      title: 'City Lights',
      location: 'New York City, NY',
      description: 'The city that never sleeps. Amazing view from the rooftop bar!',
      date: 'May 28, 2023',
      visibility: 'Private',
      image: '/City.png'
    },
    {
      title: 'Mountain Trail',
      location: 'Rocky Mountains, CO',
      description: 'Hiking with friends in the Rockies. Such an amazing experience!',
      date: 'April 10, 2023',
      visibility: 'Group',
      image: '/Mountain.png'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      
      <div className="w-full md:w-64 bg-white border-r flex flex-col justify-between p-6">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-bold text-lg mb-10">
            <FaMapMarkedAlt className="text-xl" /> Map Memory
          </div>
          <ul className="space-y-4">
            <li><a href="/Home" className="flex items-center gap-2 text-gray-700 hover:text-blue-600"><FaHome /> Home</a></li>
            <li><a href="/map" className="flex items-center gap-2 text-gray-700 hover:text-blue-600"><FaMapMarkedAlt /> Map</a></li>
            <li><a href="/communities" className="flex items-center gap-2 text-gray-700 hover:text-blue-600"><FaUsers /> Communities</a></li>
            <li><a href="/tickets" className="flex items-center gap-2 text-gray-700 hover:text-blue-600"><FaTicketAlt /> My Tickets</a></li>
          </ul>
        </div>

        <div className="mt-10 flex items-center gap-3">
          <img src="https://randomuser.me/api/portraits/women/45.jpg" alt="Sarah Johnson" className="w-10 h-10 rounded-full" />
          <div>
            <p className="text-sm font-semibold">Sarah Johnson</p>
            <a href="#" className="text-xs text-blue-500">View Profile</a>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <img src="https://randomuser.me/api/portraits/women/45.jpg" className="w-28 h-28 rounded-full" />
                  <button className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full text-white text-sm"><FaCamera /></button>
                </div>
                <h3 className="mt-4 text-lg font-semibold">Sarah Johnson</h3>
                <p className="text-gray-500 text-sm">@sarahjohnson</p>
                <p className="text-gray-400 text-xs mt-1">New York, USA</p>
                <p className="text-gray-400 text-xs">Joined April 2023</p>
                <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded text-sm">Share Profile</button>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium">Full Name</label>
                    <input type="text" className="w-full border rounded px-3 py-2 mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Username</label>
                    <input type="text" className="w-full border rounded px-3 py-2 mt-1" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <input type="email" className="w-full border rounded px-3 py-2 mt-1" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Phone</label>
                  <input type="text" className="w-full border rounded px-3 py-2 mt-1" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Password</label>
                  <input type="password" className="w-full border rounded px-3 py-2 mt-1" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Bio</label>
                  <textarea className="w-full border rounded px-3 py-2 mt-1" rows={3}></textarea>
                </div>
                <div className="flex justify-end gap-3">
                  <button className="px-4 py-2 border rounded text-sm">Cancel</button>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded text-sm">Save Changes</button>
                </div>
              </form>
            </div>
          </div>


          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold">my Memories</h2>
            <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded">+ New Memory</button>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {memories.map((memory, i) => (
              <div key={i} className="bg-white rounded shadow overflow-hidden">
                <div className="relative">
                  <img src={memory.image} alt={memory.title} className="w-full h-40 object-cover" />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button className="p-1 bg-white rounded-full shadow"><FaEdit className="text-sm" /></button>
                    <button className="p-1 bg-white rounded-full shadow"><FaTrash className="text-sm text-red-500" /></button>
                  </div>
                  <span className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">{memory.visibility}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm">{memory.title}</h3>
                  <p className="text-gray-500 text-xs">{memory.location}</p>
                  <p className="text-gray-500 text-xs mt-1">{memory.description}</p>
                  <p className="text-gray-400 text-xs mt-1">{memory.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default ProfilePage;
