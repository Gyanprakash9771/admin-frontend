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
  const [openSubMenu, setOpenSubMenu] = useState(null);

  const toggleSubMenu = (label) => {
    setOpenSubMenu(openSubMenu === label ? null : label);
  };

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const linkBase = {
    padding: "10px 14px",
    borderRadius: "10px",
    transition: "all 0.25s ease",
    cursor: "pointer",
  };

  const hoverEffect = (e, enter) => {
    e.currentTarget.style.background = enter
      ? "rgba(255,255,255,0.08)"
      : "transparent";
    e.currentTarget.style.transform = enter ? "translateX(4px)" : "none";
  };

  return (
    <div
      className="d-flex flex-column text-white"
      style={{
        width: "270px",
        height: "100vh",
        overflowY: "auto",
        background: "linear-gradient(180deg, #1e293b, #0f172a)",
        boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
      }}
    >
      {/* Profile */}
      <div className="d-flex flex-column align-items-center justify-content-center py-4 border-bottom border-secondary text-center">
        <img
          src="https://i.pravatar.cc/100"
          alt="profile"
          className="rounded-circle"
          style={{
            width: "72px",
            height: "72px",
            border: "3px solid #22c55e",
            objectFit: "cover",
          }}
        />
        <h6 className="mt-3 mb-0 fw-semibold">Admin</h6>
        <small className="text-secondary">Administrator</small>
      </div>

      {/* Navigation */}
      <ul className="nav flex-column px-2 py-3 flex-grow-1">
        {/* Dashboard */}
        <li className="nav-item mb-2">
          <NavLink
            to="/"
            className="nav-link d-flex align-items-center gap-2 text-white"
            style={({ isActive }) => ({
              ...linkBase,
              background: isActive ? "rgba(34,197,94,0.15)" : "transparent",
              borderLeft: isActive
                ? "4px solid #22c55e"
                : "4px solid transparent",
            })}
            onMouseEnter={(e) => hoverEffect(e, true)}
            onMouseLeave={(e) => hoverEffect(e, false)}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>
        </li>

        {/* Menus */}
        {[
          {
            key: "courses",
            icon: <BookOpen size={18} />,
            label: "Courses",
            items: [
              { to: "/courses", label: "All Courses" },
              { to: "/add-course", label: "Add Course" },
              { to: "/categories", label: "Categories" },
            ],
          },
          {
            key: "users",
            icon: <Users size={18} />,
            label: "Users",
            items: [
              { to: "/users", label: "All Users" },
              { to: "/instructors", label: "Instructors" },
              { to: "/students", label: "Students" },
            ],
          },
          {
            key: "content",
            icon: <Layers size={18} />,
            label: "Content",
            items: [
              {
                label: "Lecture",
                subItems: [
                  { to: "/lessons", label: "Add Lecture" },
                  { to: "/lessonlist", label: "Lecture List" },
                ],
              },
              { to: "/modules", label: "Modules" },
              { to: "/resources", label: "Resources" },
            ],
          },
          {
            key: "settings",
            icon: <Settings size={18} />,
            label: "Settings",
            items: [
              { to: "/settings", label: "General" },
              { to: "/payment", label: "Payment" },
              { to: "/profile", label: "Profile" },
            ],
          },
        ].map((menu) => (
          <li className="nav-item mb-2" key={menu.key}>
            {/* Parent */}
            <div
              onClick={() => toggleMenu(menu.key)}
              style={linkBase}
              className="d-flex justify-content-between align-items-center text-white"
              onMouseEnter={(e) => hoverEffect(e, true)}
              onMouseLeave={(e) => hoverEffect(e, false)}
            >
              <div className="d-flex align-items-center gap-2">
                {menu.icon}
                <span>{menu.label}</span>
              </div>
              <ChevronDown
                size={16}
                style={{
                  transform:
                    openMenu === menu.key
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  transition: "0.3s",
                  color:
                    openMenu === menu.key ? "#22c55e" : "#cbd5f5",
                }}
              />
            </div>

            {/* Dropdown */}
            <div
              style={{
                maxHeight: openMenu === menu.key ? "400px" : "0px",
                opacity: openMenu === menu.key ? 1 : 0,
                overflow: "hidden",
                transition: "all 0.35s ease",
              }}
            >
              <ul
                className="list-unstyled ms-3 mt-2 p-2 rounded"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                {menu.items.map((item, i) => (
                  <li key={i}>
                    {/* NORMAL LINK */}
                    {!item.subItems ? (
                      <NavLink
                        to={item.to}
                        className="d-block text-decoration-none"
                        style={({ isActive }) => ({
                          padding: "8px 10px",
                          borderRadius: "6px",
                          transition: "0.2s",
                          color: isActive ? "white" : "#9ca3af",
                          background: isActive
                            ? "rgba(34,197,94,0.15)"
                            : "transparent",
                        })}
                      >
                        {item.label}
                      </NavLink>
                    ) : (
                      <>
                        {/* SUBMENU PARENT */}
                        <div
                          onClick={() => toggleSubMenu(item.label)}
                          className="d-flex justify-content-between align-items-center"
                          style={{
                            padding: "8px 10px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            color: "#9ca3af",
                          }}
                        >
                          <span>{item.label}</span>
                          <ChevronDown
                            size={14}
                            style={{
                              transform:
                                openSubMenu === item.label
                                  ? "rotate(180deg)"
                                  : "rotate(0deg)",
                              transition: "0.3s",
                            }}
                          />
                        </div>

                        {/* SUBMENU ITEMS */}
                        <div
                          style={{
                            maxHeight:
                              openSubMenu === item.label
                                ? "200px"
                                : "0px",
                            overflow: "hidden",
                            transition: "0.3s",
                          }}
                        >
                          <ul className="list-unstyled ms-3">
                            {item.subItems.map((sub, j) => (
                              <li key={j}>
                                <NavLink
                                  to={sub.to}
                                  className="d-block text-decoration-none"
                                  style={({ isActive }) => ({
                                    padding: "6px 10px",
                                    borderRadius: "6px",
                                    fontSize: "14px",
                                    color: isActive
                                      ? "white"
                                      : "#9ca3af",
                                    background: isActive
                                      ? "rgba(34,197,94,0.15)"
                                      : "transparent",
                                  })}
                                >
                                  {sub.label}
                                </NavLink>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}

        {/* Analytics */}
        <li className="nav-item mt-2">
          <NavLink
            to="/analytics"
            className="nav-link d-flex align-items-center gap-2 text-white"
            style={linkBase}
            onMouseEnter={(e) => hoverEffect(e, true)}
            onMouseLeave={(e) => hoverEffect(e, false)}
          >
            <BarChart size={18} />
            <span>Analytics</span>
          </NavLink>
        </li>
      </ul>

      {/* Footer */}
      <div className="text-center text-secondary small py-3 border-top border-secondary">
        © 2026 EduTest Admin
      </div>
    </div>
  );
}