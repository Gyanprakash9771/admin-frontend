import { Menu, Bell, LogOut, User, Sun, Moon } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Navbar({ toggleSidebar }) {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load dark mode
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setDarkMode(true);
  }, []);

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setOpen(false);
    window.location.href = "/admin-login";
  };

  return (
    <div className="navbar-custom d-flex align-items-center justify-content-between px-3">

      {/* LEFT */}
      <div className="d-flex align-items-center gap-3">
        <Menu
          style={{ cursor: "pointer" }}
          onClick={toggleSidebar}
        />
        <h5 className="mb-0 fw-bold">EDUTEST</h5>
      </div>

      {/* RIGHT */}
      <div className="d-flex align-items-center gap-3 position-relative" ref={dropdownRef}>

        {/* Dark Mode */}
        <button
          className="btn btn-sm btn-outline-light"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Bell */}
        <Bell />

        {/* Profile + Dropdown FIX */}
        <div className="position-relative">
          <img
            src="https://i.pravatar.cc/40"
            className="rounded-circle"
            width="32"
            height="32"
            style={{ cursor: "pointer" }}
            onClick={() => setOpen(!open)}
          />

          {open && (
            <div
              className="dropdown-menu show mt-2 p-2 shadow"
              style={{
                position: "absolute",
                right: 0,
                top: "100%",
                width: "200px",
                zIndex: 1000
              }}
            >
              
              {/* User Info */}
              <div className="px-2 pb-2 border-bottom">
                <p className="mb-0 fw-semibold">Admin User</p>
                <small className="text-muted">admin@gmail.com</small>
              </div>

              {/* Options */}
              <div className="d-flex flex-column mt-2">
                <button className="dropdown-item d-flex align-items-center gap-2">
                  <User size={16} /> Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="dropdown-item d-flex align-items-center gap-2 text-danger"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}