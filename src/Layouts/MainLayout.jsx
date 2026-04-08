import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function MainLayout({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      
      {/* Overlay (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed z-50 top-0 left-0 h-full w-64 bg-[#2f3e4d] dark:bg-gray-900
          transform transition-all duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar />
      </div>

      {/* Right Section */}
      <div
        className={`
          flex-1 flex flex-col transition-all duration-300
          ${isOpen ? "md:ml-64" : "ml-0"}
        `}
      >
        <Navbar toggleSidebar={() => setIsOpen(!isOpen)} />

        <div className="p-4 bg-gray-100 dark:bg-gray-900 flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}