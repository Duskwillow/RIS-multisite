import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  Activity,
  Clock,
  Users,
  FileText,
  Edit3,
  LogOut,
  Menu,
  ListChecks,
} from "lucide-react";
import { useAuthStore } from "../services/authStore";

const SimpleSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [radiologueName, setRadiologueName] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user) {
      console.log("User from authStore:", user);
      setRadiologueName(user.nom_prenom || user.username);
    }
  }, [user]);

  const navItems = [
    { name: "Tableau de Bord", path: "/dashboard", icon: <Clock size={20} /> },
    { name: "Saisie", path: "/w2", icon: <Edit3 size={20} /> },
    {
      name: "Liste de Travail",
      path: "/worklist",
      icon: <ListChecks size={20} />,
      badge: 14,
    },
    { name: "Comptes-Rendus", path: "/Rapport", icon: <FileText size={20} /> },
    { name: "Recherche Patient", path: "/patients", icon: <Users size={20} /> },
  ];

  return (
    <>
      {/* Hamburger button for small screens */}
      <div className="md:hidden absolute top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-white rounded-lg shadow-md"
        >
          <Menu size={24} />
        </button>
      </div>

      <div className="flex ">
        {/* Sidebar */}
        <div
          className={`bg-white shadow-xl flex flex-col transition-all duration-300 p-2
      ${isOpen ? "w-64" : "w-16"}`}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200 ">
            {isOpen && (
              <h1 className="text-xl font-bold text-gray-800">RIS National</h1>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 rounded hover:bg-gray-100"
            >
              <Menu size={20} />
            </button>
          </div>

          <nav className="flex-1  mt-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg transition ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`
                }
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {isOpen && <span className="ml-3">{item.name}</span>}
                {item.badge && isOpen && (
                  <span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
          <div>
            {isOpen && radiologueName && (
              <span className="ml-3 flex items-center w-full p-3 rounded text-gray-700">
                {user?.nom_prenom || user?.username}
              </span>
            )}
          </div>

          {/* Logout */}
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={() => {}}
              className="flex items-center w-full p-3 rounded hover:bg-red-50 text-gray-700 hover:text-red-600 transition"
            >
              <LogOut size={20} className="flex-shrink-0" />
              {isOpen && <span className="ml-3 ">Déconnexion</span>}
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-6 bg-gray-50">
          {/* Your page content goes here */}
        </div>
      </div>
    </>
  );
};

export default SimpleSidebar;
