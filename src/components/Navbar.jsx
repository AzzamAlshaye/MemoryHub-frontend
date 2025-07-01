import React, { useState } from 'react';
import { Link } from 'react-router';
import { FaHome } from "react-icons/fa";
import { FaMapMarkedAlt } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { FaTicketAlt } from "react-icons/fa";
import { FaBars } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";


const links = [
  { to: "/Home", 
    label: "Home", 
    icon: <FaHome />
   },
  { to: "/map",
     label: "Map",
      icon: <FaMapMarkedAlt />
     },
  { to: "/communities",
     label: "Communities", 
     icon: <FaUsers />
     },
  { to: "/tickets", 
    label: "My Tickets", 
    icon: <FaTicketAlt />
   },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const open = () => setMenuOpen(e => !e);
  const close = () => setMenuOpen(false);

  return (
    <nav className="w-full bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        <div className="flex items-center space-x-2 text-blue-600 font-bold text-xl">
          <FaMapMarkedAlt size={24} />
          <span>Map Memory</span>
        </div>

        <div className="hidden md:flex space-x-4">
          {links.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-2 px-3 py-2 rounded-md font-medium text-blue-600 hover:bg-blue-50 transition"
            >
              {icon}
              <span>{label}</span>
            </Link>
          ))}
        </div>

        <div className="md:hidden">
          <button onClick={open} className="text-blue-600 text-2xl">
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden px-4 pb-4">
          {links.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              onClick={close}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md font-medium text-blue-600 hover:bg-blue-100 transition"
            >
              {icon}
              <span>{label}</span>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
