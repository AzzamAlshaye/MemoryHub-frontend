import React, { useState, useEffect } from 'react';
import { FaUserPlus } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { FaSort } from "react-icons/fa";

function GroupView() {
  const initialCommunities = [
    {
      title: 'Travel Enthusiasts',
      description: 'A community for sharing travel memories, tips, and planning group adventures around the world.',
      location: 'Global',
      activity: 'Active 2h ago',
      members: 42,
      img: '/magical-golden-glittering-wave-in-abstract-sparkling-background-for-festive-design-photo.jpg',
      postedDate: '2025-06-29',
    },
    {
      title: 'City Explorers',
      description: 'Discover hidden gems in your city with fellow urban adventurers. Weekly meetups and photo challenges.',
      location: 'New York',
      activity: 'Active 5h ago',
      members: 88,
      img: '/magical-golden-glittering-wave-in-abstract-sparkling-background-for-festive-design-photo.jpg',
      postedDate: '2025-06-28',
    },
    {
      title: 'Photography Club',
      description: 'Share your best shots, learn techniques, and join photo walks with fellow photography enthusiasts.',
      location: 'Multiple locations',
      activity: 'Active 1d ago',
      members: 125,
      img: '/magical-golden-glittering-wave-in-abstract-sparkling-background-for-festive-design-photo.jpg',
      postedDate: '2025-06-27',
    },
  ];
// handel with sort 
  const [communities, setCommunities] = useState(initialCommunities);
  const [sortBy, setSortBy] = useState('recent');
  const [searchTerm, setSearchTerm] = useState('');
  const sortPosts = (data, criterion) => {
    let sorted = [...data];
    switch (criterion) {
      case 'recent':
        sorted.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
        break;
      case 'alphabetical':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'members':
        sorted.sort((a, b) => b.members - a.members);
        break;
      default:
        break;
    }
    return sorted;
  };
// handel with sort
  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
  };
// handel with search
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handelSort = () => {
//  serach bar
    const filtered = communities.filter(c =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
// show result of serach
    return sortPosts(filtered, sortBy);
  };
  useEffect(() => {
// sort community
    setCommunities(prev => sortPosts(prev, sortBy));
  }, [sortBy]);

  return (
    <>
      <div className="min-h-screen bg-gray-50 px-6 py-4">
{/* group headet-info */}
        <div className="flex  md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-[.8rem] lg:text-xl font-bold text-blue-900">Travel Buddies Group</h1>
            <p className="text-gray-500 text-sm">Share your travel memories with your friends</p>
          </div>
          <div className="flex flex-row gap-2 mt-4 md:mt-0">
            <button className="bg-blue-200 hover:bg-blue-300 text-white text-sm p-2 lg:px-4 lg:py-2 rounded">+ New Group</button>
            <button className="bg-white text-black shadow-2xl text-sm p-0 lg:px-4 lg:py-2 rounded flex items-center gap-0 lg:gap-2">
              <FaUserPlus /> Invite Members
            </button>
          </div>
        </div>
        {/* group */}
        <div className="mb-6 flex gap-0.5">
          <h2 className="text-md font-semibold mb-2">Members:</h2>
          <div className="flex items-center ">
            <img src="/images.jpg" alt="member1" className="w-6 h-6 rounded-full object-cover" />
            <img src="/images.jpg" alt="member2" className="w-6 h-6 rounded-full object-cover" />
            <span className="text-blue-400 text-sm text-[.6rem] cursor-pointer hover:underline">View all</span>
          </div>
        </div>
        {/* sort and search */}
        <div className="flex gap-4 mb-6 items-center justify-between">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search memories..."
              className="w-full text-[.7rem] flex items-center border border-gray-300 px-4 py-2 pl-10 rounded-md text-sm"
              value={searchTerm}
              onChange={handleSearchChange}/>
            <IoIosSearch className="absolute top-3 flex items-center left-3 text-gray-400 text-lg" />
          </div>
        <div className="flex items-center gap-2 border border-gray-300 rounded px-2 py-1 w-max">
  <FaSort className="text-gray-600" />
  <select
    className="text-sm rounded border-none outline-none"
    value={sortBy}
    onChange={handleSortChange}
  >
    {/* <option value="Sort">Sort</option>  */}
    <option value="recent">Recently Active</option>
    <option value="alphabetical">A - Z</option>
    <option value="members">Most Members</option>
  </select>
</div>
        </div>

        {/* memories Cards */}
        <div className="grid md:grid-cols-2 grid-cols-3 gap-3">
          {handelSort().map((item, index) => (
            <div key={index} className="bg-white shadow rounded overflow-hidden">
              <img src={item.img} alt={item.title} className="w-full h-40 object-cover" />
              <div className="flex items-center gap-2 px-2">
                <img src="/images.jpg" alt="author" className="w-6 h-6 rounded-full object-cover" />
                <div className="text-sm">
                  <p className="font-medium text-[.5rem] text-gray-800">username</p>
                  <p className="text-xs text-[.4rem] text-gray-400">Posted {item.postedDate}</p>
                </div>
              </div>
              <div className="p-2">
                <h3 className="font-semibold text-[.7rem] text-blue-900 text-base">{item.title}</h3>
                <p className="text-sm text-[.6rem] text-gray-500 ">{item.description}</p>
                <p className="text-xs text-[.4rem] text-gray-400 ">{item.location} • {item.activity}</p>
              </div>
            </div>
          ))}
        </div>
        {/* load more memories */}
        <div className="mt-6 flex justify-center">
          <button className="px-4 py-2 border rounded text-sm text-gray-600 hover:text-blue-500">
            Load More memories
          </button>
        </div>
      </div>
    </>
  );
}

export default GroupView;
