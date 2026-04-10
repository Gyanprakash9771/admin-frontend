import { HashRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./Layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import AddCourse from "./pages/AddCourse";
import Users from "./pages/Users";
import Categories from "./pages/Categories";
import EditCourse from "./pages/EditCourse";
import AdminLogin from "./pages/AdminLogin"; 
import ProtectedRoute from "./components/ProtectedRoute"; 
import { Toaster } from "react-hot-toast";
import AdminRegister from "./pages/AdminRegister";
import AddLecture from "./pages/AddLecture";
import LessonList from "./pages/LessonList";

export default function App() {
  return (
    <>
      <Toaster position="top-right" />

      <HashRouter>
        <Routes>

          
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-register" element={<AdminRegister />} />

          
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
                    <Route path="/lessons" element={<AddLecture />} />
                    <Route path="/lessonlist" element={<LessonList />} />
                    
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            }
          />

        </Routes>
      </HashRouter>
    </>
  );
}