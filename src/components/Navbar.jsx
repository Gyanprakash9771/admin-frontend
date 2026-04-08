import { Menu, Bell, LogOut, User, Sun, Moon } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Navbar({ toggleSidebar }) {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Apply dark mode
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // ✅ ADDED LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("token");
    setOpen(false);
    window.location.href = "/admin-login";
  };

  return (
    <div className="h-14 bg-[#2f3e4d] dark:bg-gray-900 text-white flex items-center justify-between px-4">
      
      {/* Left */}
      <div className="flex items-center gap-4">
        <Menu 
          className="cursor-pointer"
          onClick={toggleSidebar}
        />
        <h1 className="font-bold">EDUTEST</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4 relative" ref={dropdownRef}>
        
        {/* Dark Mode Toggle */}
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <Bell />

        {/* Profile Image */}
        <img
          src="https://i.pravatar.cc/40"
          className="w-8 h-8 rounded-full cursor-pointer"
          onClick={() => setOpen(!open)}
        />

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-800 text-black dark:text-white rounded shadow-lg py-2 z-50">
            
            {/* User Info */}
            <div className="px-4 py-2 border-b dark:border-gray-600">
              <p className="text-sm font-semibold">Admin User</p>
              <p className="text-xs text-gray-500 dark:text-gray-300">admin@gmail.com</p>
            </div>

            {/* Options */}
            <div className="flex flex-col">
              <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">
                <User size={16} /> Profile
              </button>

              {/* ✅ UPDATED LOGOUT BUTTON */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-red-500"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}