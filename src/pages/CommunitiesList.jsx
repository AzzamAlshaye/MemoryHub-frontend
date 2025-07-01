import React from 'react';
import Footer from '../components/Footer';
import { FaMapMarkedAlt, FaHome, FaUsers, FaTicketAlt } from 'react-icons/fa';

function CommunitiesList() {
  const communities = [
    {
      title: 'Travel Enthusiasts',
      description: 'A community for sharing travel memories, tips, and planning group adventures around the world.',
      location: 'Global',
      activity: 'Active 2h ago',
      members: '42 members',
      img: '/Travel.png'
    },
    {
      title: 'City Explorers',
      description: 'Discover hidden gems in your city with fellow urban adventurers. Weekly meetups and photo challenges.',
      location: 'New York',
      activity: 'Active 5h ago',
      members: '88 members',
      img: '/Travel.png'
    },
    {
      title: 'Photography Club',
      description: 'Share your best shots, learn techniques, and join photo walks with fellow photography enthusiasts.',
      location: 'Multiple locations',
      activity: 'Active 1d ago',
      members: '125 members',
      img: '/Travel.png'
    },
    {
      title: 'Hiking Buddies',
      description: 'Explore trails, share hiking experiences, and organize group hikes in scenic locations.',
      location: 'Mountain regions',
      activity: 'Active 3d ago',
      members: '64 members',
      img: '/Travel.png'
    },
    {
      title: 'Foodie Adventures',
      description: 'Document culinary experiences, share restaurant recommendations, and organize food tours.',
      location: 'San Francisco',
      activity: 'Active 12h ago',
      members: '102 members',
      img: '/Travel.png'
    },
    {
      title: 'Historical Sites',
      description: 'Document and explore historical landmarks, share stories, and learn about local history together.',
      location: 'London',
      activity: 'Active 2d ago',
      members: '57 members',
      img: '/Travel.png'
    },
    {
      title: 'Beach Lovers',
      description: 'Best spots for beach getaways, sunbathing, surfing, and sea food discoveries.',
      location: 'Coastal Areas',
      activity: 'Active 7h ago',
      members: '77 members',
      img: '/Travel.png'
    },
    {
      title: 'Cultural Exchange',
      description: 'A place to share and learn about different cultures, languages, and international traditions.',
      location: 'Worldwide',
      activity: 'Active 1h ago',
      members: '93 members',
      img: '/Travel.png'
    },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col justify-between p-6">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-bold text-lg mb-10">
            <FaMapMarkedAlt className="text-xl" /> Map Memory
          </div>
          <ul className="space-y-4">
            <li><a href="/" className="flex items-center gap-2 text-gray-700 hover:text-blue-600"><FaHome /> Home</a></li>
            <li><a href="/map" className="flex items-center gap-2 text-gray-700 hover:text-blue-600"><FaMapMarkedAlt /> Map</a></li>
            <li><a href="/communities" className="flex items-center gap-2 text-gray-700 hover:text-blue-600"><FaUsers /> Communities</a></li>
            <li><a href="/tickets" className="flex items-center gap-2 text-gray-700 hover:text-blue-600"><FaTicketAlt /> My Tickets</a></li>
          </ul>
        </div>
        <div className="mt-10 flex items-center gap-3">
          <img src="https://randomuser.me/api/portraits/women/45.jpg" alt="Sarah Johnson" className="w-10 h-10 rounded-full object-cover" />
          <div>
            <p className="text-sm font-semibold">Sarah Johnson</p>
            <a href="#" className="text-xs text-blue-500">View Profile</a>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50">
        <h1 className="text-2xl font-semibold mb-2">Communities</h1>
        <p className="text-sm text-gray-600 mb-6">Discover and manage your group memberships</p>

        <div className="flex flex-wrap gap-2 mb-6 items-center justify-between">
          <input type="text" placeholder="Search communities..." className="border px-4 py-2 rounded-md w-full md:w-80" />
          <div className="flex gap-2 mt-2 md:mt-0">
            <button className="bg-gray-100 text-xs px-3 py-1 rounded">All ✕</button>
            <button className="bg-gray-100 text-xs px-3 py-1 rounded">Nearby</button>
            <button className="bg-gray-100 text-xs px-3 py-1 rounded">Recently Active</button>
            <button className="bg-gray-200 text-xs px-3 py-1 rounded flex items-center gap-1">
              <span>More Filters</span>
            </button>
          </div>
          <button className="bg-blue-400 text-white px-4 py-2 rounded-md text-sm">join</button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((item, index) => (
            <div key={index} className="bg-white shadow rounded overflow-hidden">
              <img src={item.img} alt={item.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-blue-900 text-base mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{item.description}</p>
                <p className="text-xs text-gray-400 mb-1">{item.location} • {item.activity}</p>
                <p className="text-xs text-blue-400 mb-3">{item.members}</p>
                <button className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded">View Group</button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <button className="px-4 py-2 border rounded text-sm text-gray-600 hover:text-blue-500">Load More Communities</button>
        </div>

        <Footer />
      </main>
    </div>
  );
}

export default CommunitiesList;