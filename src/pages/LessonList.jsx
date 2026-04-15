import { useEffect, useState } from "react";
import API from "../services/apiService";

export default function LessonList() {
  const [lessons, setLessons] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    API.get("/categories").then(res => setCategories(res.data));
  }, []);

  useEffect(() => {
    let url = "/lessons";
    if (selectedCategory) {
      url += `?category=${selectedCategory}`;
    }

    API.get(url).then(res => setLessons(res.data));
  }, [selectedCategory]);

  // ✅ DELETE FUNCTION
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/lessons/${id}`);
      setLessons(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  // ✅ EDIT FUNCTION (simple prompt-based)
  const handleEdit = async (lesson) => {
    const newTitle = prompt("Enter new title", lesson.lectureTitle);
    const newDuration = prompt("Enter new duration", lesson.duration);
    console.log("EDIT ID:", lesson._id);

    if (!newTitle || !newDuration) return;

    try {
      const res = await API.put(`/lessons/${lesson._id}`, {
        
        lectureTitle: newTitle,
        duration: newDuration,
      });

      setLessons(prev =>
        prev.map(item =>
          item._id === lesson._id ? res.data : item
        )
      );
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-4">Lessons</h4>

      {/* Filter */}
      <div className="mb-4">
        <label className="form-label">Filter by Category</label>
        <select
          className="form-select"
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Lessons */}
      <div className="row">
        {lessons.map((lesson, i) => (
          <div key={i} className="col-md-6 mb-4">
            <div className="card shadow-sm h-100">

              <div className="card-body">
                <h6 className="fw-bold">{lesson.lectureTitle}</h6>

                <p className="text-muted mb-1">
                  Category: {lesson.category?.name}
                </p>

                <p className="mb-2">
                  Duration: {lesson.duration}
                </p>

                {lesson.video && (
                  <iframe
                    width="100%"
                    height="200"
                    src={lesson.video}
                    title="video"
                    allowFullScreen
                    style={{ borderRadius: "8px" }}
                  ></iframe>
                )}

                {/* ✅ ACTION BUTTONS */}
                <div className="d-flex gap-2 mt-3">
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => handleEdit(lesson)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(lesson._id)}
                  >
                    Delete
                  </button>
                </div>

              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Empty */}
      {lessons.length === 0 && (
        <div className="text-center text-muted mt-5">
          No lessons found
        </div>
      )}
    </div>
  );
}