// src/pages/user/GroupPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { FaMapMarkerAlt, FaFlag } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { FiSend } from "react-icons/fi";

const postsData = [
  {
    id: 1,
    user: "Michael Johnson",
    date: "July 4, 2025 at 3:24 PM",
    avatar: "https://i.pravatar.cc/36?img=10",
    location: "Downtown Square",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    caption:
      "Amazing sunset view from the rooftop bar downtown! Can’t believe it’s been 2 years since we first discovered this hidden gem. The live music was incredible as always. Who’s joining next weekend? 🎤 #DowntownMemories",
    likes: 42,
    dislikes: 2,
    comments: [
      {
        name: "Sarah Williams",
        time: "July 4, 2025 at 4:15 PM",
        text: "Such a beautiful view! I'll definitely join next weekend!",
        likes: 5,
      },
      {
        name: "David Chen",
        time: "July 4, 2025 at 5:32 PM",
        text: "The band was amazing! What was the name of that last song they played?",
        likes: 2,
      },
    ],
  },
  {
    id: 2,
    user: "Emily Rodriguez",
    date: "July 3, 2025 at 11:45 AM",
    avatar: "https://i.pravatar.cc/36?img=20",
    location: "Riverside Café",
    image:
      "https://images.unsplash.com/photo-1533777324565-a040eb52fac1?auto=format&fit=crop&w=800&q=80",
    caption:
      "Found this adorable café by the river today! They have the best pastries and the latte art is incredible. Perfect spot for our next book club meeting. Who's in? 📚☕ #RiversideCafé",
    likes: 27,
    dislikes: 0,
    comments: [
      {
        name: "Jessica Lee",
        time: "July 3, 2025 at 12:30 PM",
        text: "I'm definitely in for the book club! Their almond croissants are to die for!",
        likes: 3,
      },
    ],
  },
  {
    id: 3,
    user: "Thomas Wilson",
    date: "July 2, 2025 at 7:18 PM",
    avatar: "https://i.pravatar.cc/36?img=33",
    location: "Arts District",
    image:
      "https://images.unsplash.com/photo-1603575448362-5a8c50ffb309?auto=format&fit=crop&w=800&q=80",
    caption:
      "Just discovered this incredible new mural in the Arts District! The artist finished it last week. It’s even more impressive in person - the colors are so vibrant. Definitely worth checking out if you're in the area. 🎨 #StreetArt #ArtsDistrict",
    likes: 36,
    dislikes: 1,
    comments: [
      {
        name: "Olivia Martinez",
        time: "July 2, 2025 at 8:05 PM",
        text: "I love this! Do you know who the artist is? I’d like to check out more of their work.",
        likes: 4,
      },
      {
        name: "Thomas Wilson",
        time: "July 2, 2025 at 8:17 PM",
        text: "@Olivia The artist is Maya Sanchez. She has an Instagram account @MayaArtistry where she posts all her work!",
        likes: 2,
      },
    ],
  },
];

export default function GroupPage() {
  const navigate = useNavigate();
  const [posts] = useState(postsData);

  return (
    <div className="min-h-screen bg-gray-100 p-4 space-y-6">

      {/* Top Header with back + group name + filter */}
      <div className="max-w-6xl mx-auto mb-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-black">
            <IoIosArrowBack size={20} />
          </button>
          <div>
            <h1 className="font-semibold text-lg text-gray-800">Downtown Memories</h1>
            <p className="text-sm text-gray-500">Group • 28 members</p>
          </div>
        </div>
        <div>
          <select className="border border-gray-300 rounded-md px-3 py-1 text-sm text-gray-700 focus:outline-none">
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="mostLiked">Most Liked</option>
          </select>
        </div>
      </div>

      {/* Posts */}
      {posts.map((post, postIdx) => (
        <div key={post.id} className="max-w-3xl mx-auto bg-white rounded-xl shadow p-5 space-y-4">

          {/* Post Header */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <img src={post.avatar} className="rounded-full w-9 h-9" alt="avatar" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-800">
                  {post.user} <span className="text-blue-500">• Downtown Memories</span>
                </span>
                <span className="text-xs text-gray-500">{post.date}</span>
              </div>
            </div>
            <div className="text-xl text-gray-400 hover:text-gray-600 cursor-pointer">⋯</div>
          </div>

          {/* Image */}
          <div className="relative w-full h-[370px] rounded-md overflow-hidden">
            <img src={post.image} className="object-cover w-full h-full" alt="memory" />
            <div className="absolute inset-0 flex items-center justify-between px-3 text-white text-xl">
              <IoIosArrowBack className="cursor-pointer hover:scale-110" />
              <IoIosArrowForward className="cursor-pointer hover:scale-110" />
            </div>
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
              📍 {post.location}
            </div>
          </div>

          {/* Caption */}
          <p className="text-gray-800 text-sm">{post.caption}</p>

          {/* Reactions */}
          <div className="flex justify-between text-gray-600 text-sm items-center">
            <div className="flex gap-5 items-center">
              <button className="flex items-center gap-1 hover:text-blue-600">
                <AiOutlineLike size={18} /> {post.likes}
              </button>
              <button className="flex items-center gap-1 hover:text-gray-500">
                <AiOutlineDislike size={18} />
              </button>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <FaFlag className="hover:text-red-500 cursor-pointer" />
            </div>
          </div>

          {/* Comments */}
          <div>
            <h4 className="text-sm font-medium text-gray-600">Comments ({post.comments.length})</h4>
            <div className="mt-2 space-y-5">
              {post.comments.map((comment, idx) => (
                <div key={idx}>
                  <div className="flex gap-3 items-start">
                    <img src={`https://i.pravatar.cc/30?img=${idx + 30 + postIdx * 10}`} className="w-8 h-8 rounded-full mt-1" alt="comment avatar" />
                    <div className="border border-gray-200 px-4 py-2 rounded-xl w-full bg-white shadow-sm">
                      <div className="flex justify-between text-xs text-gray-600 font-medium">
                        <span>{comment.name}</span>
                        <span>{comment.time}</span>
                      </div>
                      <p className="text-gray-700 text-sm mt-1">{comment.text}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 text-gray-500 text-sm mt-1 ps-12">
                    <button className="flex items-center gap-1 hover:text-blue-600">
                      <AiOutlineLike size={16} /> {comment.likes}
                    </button>
                    <button className="flex items-center gap-1 hover:text-gray-600">
                      <AiOutlineDislike size={16} />
                    </button>
                    <button className="flex items-center gap-1 hover:text-red-500">
                      <FaFlag size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Comment */}
            <div className="flex gap-3 mt-4 items-start">
              <img src="https://i.pravatar.cc/30?img=1" className="w-8 h-8 rounded-full mt-1" alt="your avatar" />
              <div className="flex items-center justify-between border border-gray-300 rounded-xl px-4 py-2 w-full bg-white shadow-sm">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="flex-1 text-sm focus:outline-none bg-transparent"
                />
                <button className="text-blue-600 hover:text-blue-800 ms-2">
                  <FiSend size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
