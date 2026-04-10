import { useEffect, useState } from "react";
import API from "../services/apiService";
import toast from "react-hot-toast";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCat, setSelectedCat] = useState("");

  const [name, setName] = useState("");
  const [parent, setParent] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch {
      toast.error("Failed to load categories ❌");
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await API.get("/courses");
      setCourses(res.data);
    } catch {
      toast.error("Failed to load courses ❌");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchCourses();
  }, []);

  const addCategory = async () => {
    if (!name.trim()) return toast.error("Enter category name");

    try {
      await API.post("/categories", {
        name,
        parent: parent || null,
      });

      toast.success("Category added ✅");
      setName("");
      setParent("");
      fetchCategories();

    } catch (err) {
      toast.error(err.response?.data?.message || "Error ❌");
    }
  };

  // FILTER COURSES
  const filteredCourses = courses.filter((course) => {
    if (!selectedCat) return false;

    return (
      course.category === selectedCat ||
      course.category ===
        categories.find((c) => c._id === selectedCat)?.name
    );
  });

  // COUNT COURSES PER CATEGORY
  const getCount = (catId) => {
    return courses.filter((c) =>
      c.category === catId ||
      c.category === categories.find((x) => x._id === catId)?.name
    ).length;
  };

  return (
    <div className="container-fluid mt-4">

      <div className="card p-4 shadow-sm">

        <h4 className="mb-4">Categories</h4>

        {/* ADD CATEGORY */}
        <div className="row mb-4">
          <div className="col-md-4">
            <input
              placeholder="Enter category name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="col-md-4">
            <select
              value={parent}
              onChange={(e) => setParent(e.target.value)}
              className="form-select"
            >
              <option value="">No Parent</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <button onClick={addCategory} className="btn btn-success w-100">
              + Add Category
            </button>
          </div>
        </div>

        <div className="row">

          {/* LEFT: CATEGORY CARDS */}
          <div className="col-md-4">
            <h6 className="mb-3">All Categories</h6>

            {categories.map((cat) => (
              <div
                key={cat._id}
                onClick={() => setSelectedCat(cat._id)}
                className="mb-2 p-3 rounded shadow-sm"
                style={{
                  cursor: "pointer",
                  background:
                    selectedCat === cat._id
                      ? "linear-gradient(135deg,#22c55e,#16a34a)"
                      : "#f8fafc",
                  color: selectedCat === cat._id ? "white" : "#333",
                  transition: "0.2s",
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <span>{cat.name}</span>
                  <span className="badge bg-dark">
                    {getCount(cat._id)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: COURSES */}
          <div className="col-md-8">
            <h6 className="mb-3">Courses</h6>

            {!selectedCat && (
              <div className="text-center text-muted mt-5">
                 Select a category to view courses
              </div>
            )}

            {selectedCat && filteredCourses.length === 0 && (
              <div className="text-center text-muted mt-5">
                 No courses in this category
              </div>
            )}

            <div className="row">
              {filteredCourses.map((course) => (
                <div key={course._id} className="col-md-6 mb-3">
                  <div className="card shadow-sm h-100 p-2">

                    {course.image && (
                      <img
                        src={`https://edutest-backend-0r41.onrender.com/uploads/${course.image}`}
                        alt=""
                        className="w-100 rounded mb-2"
                        style={{ height: "140px", objectFit: "cover" }}
                      />
                    )}

                    <h6>{course.title}</h6>
                    <small className="text-muted">
                      {course.instructor}
                    </small>

                    <div className="mt-2 d-flex justify-content-between">
                      <span className="badge bg-success">
                        {course.level}
                      </span>
                      <span>₹{course.price}</span>
                    </div>

                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}