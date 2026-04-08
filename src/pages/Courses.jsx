import { useEffect, useState } from "react";
import API from "../services/apiService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  const itemsPerPage = 5;

  // Fetch courses
  const fetchCourses = async () => {
    try {
      const res = await API.get("/courses");
      setCourses(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Delete
  const handleDelete = async (id) => {
    try {
      await API.delete(`/courses/${id}`);
      toast.success("Course deleted 🗑️");
      fetchCourses();
    } catch {
      toast.error("Delete failed ❌");
    }
  };

  // 🔍 Filter logic
  const filteredCourses = courses.filter((c) => {
    return (
      c.title.toLowerCase().includes(search.toLowerCase()) &&
      (category === "All" || c.category === category)
    );
  });

  // 📄 Pagination logic
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const start = (page - 1) * itemsPerPage;
  const currentCourses = filteredCourses.slice(
    start,
    start + itemsPerPage
  );

  // Get unique categories
  const categories = ["All", ...new Set(courses.map(c => c.category))];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        
        <h2 className="text-xl font-bold text-black dark:text-white">
           Courses
        </h2>

        <div className="flex gap-2 flex-wrap">

          {/* Search */}
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 rounded border bg-gray-100 dark:bg-gray-700"
          />

          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-2 rounded border bg-gray-100 dark:bg-gray-700"
          >
            {categories.map((cat, i) => (
              <option key={i}>{cat}</option>
            ))}
          </select>

          {/* Add Button */}
          <button
            onClick={() => navigate("/add-course")}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            + Add
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-separate border-spacing-y-2">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="p-2">Image</th>
              <th className="p-2">Title</th>
              <th className="p-2">Lessons</th>
              <th className="p-2">Category</th>
              <th className="p-2">Level</th>
              <th className="p-2 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {currentCourses.map((course) => (
              <tr
                key={course._id}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg shadow hover:scale-[1.01] transition"
              >
                <td className="p-2">
                  <img
                    src={`http://localhost:5000/uploads/${course.image}`}
                    className="w-12 h-12 rounded"
                  />
                </td>

                <td className="p-2 font-medium text-black dark:text-white">
                  {course.title}
                </td>

                <td className="p-2 text-blue-600 font-semibold">
                  {course.lessons}
                </td>

                <td className="p-2 text-gray-600 dark:text-gray-300">
                  {course.category}
                </td>

                <td className="p-2 text-purple-600 font-semibold">
                  {course.level}
                </td>

                <td className="p-2 flex justify-center gap-2">
                  <button
                    onClick={() => navigate(`/edit-course/${course._id}`)}
                    className="bg-blue-500 px-3 py-1 rounded text-white text-xs"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(course._id)}
                    className="bg-red-500 px-3 py-1 rounded text-white text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${
              page === i + 1
                ? "bg-green-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

    </div>
  );
}