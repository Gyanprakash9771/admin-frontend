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

  return (
    <div className="container mt-4">
      <h4 className="mb-4">Lessons</h4>

      
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
              </div>

            </div>
          </div>
        ))}
      </div>

      
      {lessons.length === 0 && (
        <div className="text-center text-muted mt-5">
          No lessons found
        </div>
      )}
    </div>
  );
}