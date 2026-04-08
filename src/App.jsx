import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./Layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import AddCourse from "./pages/AddCourse";
import Users from "./pages/Users";
import Categories from "./pages/Categories";
import EditCourse from "./pages/EditCourse";
import AdminLogin from "./pages/AdminLogin"; // ✅ ADDED
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ ADDED
import { Toaster } from "react-hot-toast";
import AdminRegister from "./pages/AdminRegister";

export default function App() {
  return (
    <>
      <Toaster position="top-right" />

      <BrowserRouter>
        <Routes>

          {/* ✅ LOGIN (NO LAYOUT) */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-register" element={<AdminRegister />} />

          {/* ✅ PROTECTED APP */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/add-course" element={<AddCourse />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/edit-course/:id" element={<EditCourse />} />
                    
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            }
          />

        </Routes>
      </BrowserRouter>
    </>
  );
}