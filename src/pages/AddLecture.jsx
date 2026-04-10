import { useEffect, useState } from "react";
import API from "../services/apiService";
import toast from "react-hot-toast";

export default function AddLecture() {
  const [categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");

  const [lecture, setLecture] = useState({
    title: "",
    video: "",
    duration: "",
  });

  useEffect(() => {
    API.get("/categories").then(res => setCategories(res.data));
  }, []);

  const convertToEmbed = (url) => {
    const regExp = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/;
    const match = url.match(regExp);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  const handleSubmit = async () => {
    if (!selectedCategory) {
      return toast.error("Select category");
    }

    try {
      await API.post("/lessons", {
        category: selectedCategory,
        lectureTitle: lecture.title,
        video: convertToEmbed(lecture.video),
        duration: lecture.duration,
      });

      toast.success("Lecture Added ");

      setLecture({
        title: "",
        video: "",
        duration: "",
      });

    } catch (err) {
      toast.error("Failed ");
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-4">Add Lecture</h4>

      {/* CATEGORY */}
      <div className="mb-3">
        <label>Category</label>
        <select
          className="form-select"
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* LECTURE INPUTS */}
      <div className="mb-3">
        <label>Lecture Title</label>
        <input
          className="form-control"
          value={lecture.title}
          onChange={(e) => setLecture({ ...lecture, title: e.target.value })}
        />
      </div>

      <div className="mb-3">
        <label>YouTube Link</label>
        <input
          className="form-control"
          placeholder="https://youtube.com/watch?v=..."
          value={lecture.video}
          onChange={(e) => setLecture({ ...lecture, video: e.target.value })}
        />
      </div>

      <div className="mb-3">
        <label>Duration</label>
        <input
          className="form-control"
          placeholder="e.g. 10 min"
          value={lecture.duration}
          onChange={(e) =>
            setLecture({ ...lecture, duration: e.target.value })
          }
        />
      </div>

      <button onClick={handleSubmit} className="btn btn-success">
        Add Lecture
      </button>

      {/* PREVIEW */}
      {lecture.video && (
        <div className="mt-4">
          <h6>Preview</h6>
          <iframe
            width="100%"
            height="300"
            src={convertToEmbed(lecture.video)}
            title="preview"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  );
}