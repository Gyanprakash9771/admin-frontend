import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Layers,
  BarChart,
  Settings,
  ChevronDown,
} from "lucide-react";

export default function Sidebar() {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <div className="h-full w-64 bg-[#2f3e4d] dark:bg-gray-900 text-white flex flex-col shadow-lg">
      
      {/* Profile */}
      <div className="flex flex-col items-center py-6 border-b border-gray-700">
        <img
          src="https://i.pravatar.cc/100"
          alt="profile"
          className="w-14 h-14 rounded-full border-2 border-green-400"
        />
        <h2 className="mt-2 text-sm font-semibold">Admin</h2>
        <p className="text-xs text-gray-400">Administrator</p>
      </div>

      {/* Navigation */}
      <ul className="space-y-1 flex-1 px-2 py-4">

        {/* Dashboard */}
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `p-2 rounded-lg flex items-center gap-3 transition shadow ${
                isActive
                  ? "bg-green-500"
                  : "hover:bg-gray-700"
              }`
            }
          >
            <LayoutDashboard size={18} />
            <span className="text-sm font-medium">Dashboard</span>
          </NavLink>
        </li>

        {/* Courses */}
        <li>
          <div
            onClick={() => toggleMenu("courses")}
            className="p-2 rounded-lg flex items-center justify-between cursor-pointer hover:bg-gray-700 transition"
          >
            <div className="flex items-center gap-3">
              <BookOpen size={18} />
              <span className="text-sm">Courses</span>
            </div>
            <ChevronDown
              size={16}
              className={`transition-transform ${
                openMenu === "courses" ? "rotate-180" : ""
              }`}
            />
          </div>

          {openMenu === "courses" && (
            <ul className="ml-7 mt-1 space-y-1 text-sm text-gray-300">
              <li>
                <NavLink to="/courses" className="hover:text-white transition">
                  • All Courses
                </NavLink>
              </li>
              <li>
                <NavLink to="/add-course" className="hover:text-white transition">
                  • Add Course
                </NavLink>
              </li>
              <li>
                <NavLink to="/categories" className="hover:text-white transition">
                  • Categories
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        {/* Users */}
        <li>
          <div
            onClick={() => toggleMenu("users")}
            className="p-2 rounded-lg flex items-center justify-between cursor-pointer hover:bg-gray-700 transition"
          >
            <div className="flex items-center gap-3">
              <Users size={18} />
              <span className="text-sm">Users</span>
            </div>
            <ChevronDown
              size={16}
              className={`transition-transform ${
                openMenu === "users" ? "rotate-180" : ""
              }`}
            />
          </div>

          {openMenu === "users" && (
            <ul className="ml-7 mt-1 space-y-1 text-sm text-gray-300">
              <li>
                <NavLink to="/users" className="hover:text-white transition">
                  • All Users
                </NavLink>
              </li>
              <li>
                <NavLink to="/instructors" className="hover:text-white transition">
                  • Instructors
                </NavLink>
              </li>
              <li>
                <NavLink to="/students" className="hover:text-white transition">
                  • Students
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        {/* Content */}
        <li>
          <div
            onClick={() => toggleMenu("content")}
            className="p-2 rounded-lg flex items-center justify-between cursor-pointer hover:bg-gray-700 transition"
          >
            <div className="flex items-center gap-3">
              <Layers size={18} />
              <span className="text-sm">Content</span>
            </div>
            <ChevronDown
              size={16}
              className={`transition-transform ${
                openMenu === "content" ? "rotate-180" : ""
              }`}
            />
          </div>

          {openMenu === "content" && (
            <ul className="ml-7 mt-1 space-y-1 text-sm text-gray-300">
              <li>
                <NavLink to="/lessons" className="hover:text-white transition">
                  • Lessons
                </NavLink>
              </li>
              <li>
                <NavLink to="/modules" className="hover:text-white transition">
                  • Modules
                </NavLink>
              </li>
              <li>
                <NavLink to="/resources" className="hover:text-white transition">
                  • Resources
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        {/* Analytics */}
        <li>
          <NavLink
            to="/analytics"
            className="p-2 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-gray-700 transition"
          >
            <BarChart size={18} />
            <span className="text-sm">Analytics</span>
          </NavLink>
        </li>

        {/* Settings */}
        <li>
          <div
            onClick={() => toggleMenu("settings")}
            className="p-2 rounded-lg flex items-center justify-between cursor-pointer hover:bg-gray-700 transition"
          >
            <div className="flex items-center gap-3">
              <Settings size={18} />
              <span className="text-sm">Settings</span>
            </div>
            <ChevronDown
              size={16}
              className={`transition-transform ${
                openMenu === "settings" ? "rotate-180" : ""
              }`}
            />
          </div>

          {openMenu === "settings" && (
            <ul className="ml-7 mt-1 space-y-1 text-sm text-gray-300">
              <li>
                <NavLink to="/settings" className="hover:text-white transition">
                  • General
                </NavLink>
              </li>
              <li>
                <NavLink to="/payment" className="hover:text-white transition">
                  • Payment
                </NavLink>
              </li>
              <li>
                <NavLink to="/profile" className="hover:text-white transition">
                  • Profile
                </NavLink>
              </li>
            </ul>
          )}
        </li>
      </ul>

      {/* Footer */}
      <div className="text-xs text-gray-400 py-3 text-center border-t border-gray-700">
        © 2026 EduTest Admin
      </div>
    </div>
  );
}