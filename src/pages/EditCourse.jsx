import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";
import { Trash2, Pencil } from "lucide-react";
import { label } from "framer-motion/client";

import API, { BASE_URL } from "../services/apiService";

export default function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    lessons: "",
    category: "",
    level: "",
    previewVideo: "",
    description: "",
    instructor: "",
    duration: "",
    enrolled: "",
    language: "",
    price: "",
    whatYouWillLearn: [""],
    courseContent: []
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [lessons, setLessons] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const [tempSection, setTempSection] = useState({
    sectionTitle: "",
    lectures: [{ lessonId: "" }],
  });

  // ✅ LOAD DATA
  useEffect(() => {
    API.get("/categories").then(res => setCategories(res.data));
    API.get("/lessons").then(res => setLessons(res.data));

    API.get("/courses").then(res => {
      const course = res.data.find(c => c._id === id);
      if (!course) return;

      console.log("IMAGE PATH 👉", course.image);

      // ✅ YOUTUBE LINK FIX (ONLY ADDITION)
      const convertToEmbed = (url) => {
        if (!url) return "";

        if (url.includes("watch?v=")) {
          const id = url.split("watch?v=")[1].split("&")[0];
          return `https://www.youtube.com/embed/${id}`;
        }

        if (url.includes("youtu.be/")) {
          const id = url.split("youtu.be/")[1].split("?")[0];
          return `https://www.youtube.com/embed/${id}`;
        }

        return url;
      };

      setForm({
        ...course,
        previewVideo: convertToEmbed(course.previewVideo) || "", // ✅ UPDATED
        category:
          typeof course.category === "object"
            ? course.category._id
            : course.category,
        whatYouWillLearn: course.whatYouWillLearn || [],
        courseContent: course.courseContent || []
      });

      if (course.image) {
        setPreview(`${BASE_URL}/uploads/${course.image}`);
      }
    });
  }, [id]);
  // ✅ AUTO LESSON COUNT
  useEffect(() => {
    const total = form.courseContent.reduce(
      (acc, sec) => acc + (sec.lectures?.length || 0),
      0
    );
    setForm(prev => ({ ...prev, lessons: total }));
  }, [form.courseContent]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "previewVideo") {
      let embedUrl = value;

      if (value.includes("watch?v=")) {
        const videoId = value.split("watch?v=")[1].split("&")[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }

      if (value.includes("youtu.be/")) {
        const videoId = value.split("youtu.be/")[1].split("?")[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }

      setForm({ ...form, previewVideo: embedUrl });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleLearnChange = (i, val) => {
    const updated = [...form.whatYouWillLearn];
    updated[i] = val;
    setForm({ ...form, whatYouWillLearn: updated });
  };

  const addLearn = () => {
    setForm({
      ...form,
      whatYouWillLearn: [...form.whatYouWillLearn, ""],
    });
  };

  const deleteSection = (index) => {
    const updated = form.courseContent.filter((_, i) => i !== index);
    setForm({ ...form, courseContent: updated });
  };

  const saveSection = () => {
    const updated = [...form.courseContent];

    if (editingIndex !== null) {
      updated[editingIndex] = tempSection;
    } else {
      updated.push(tempSection);
    }

    setForm({ ...form, courseContent: updated });
    setShowModal(false);
    setEditingIndex(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();

Object.keys(form).forEach((key) => {
  if (key !== "whatYouWillLearn" && key !== "courseContent") {

    // 🔥 FORCE HANDLE VIDEO (IMPORTANT FOR OLD DATA)
    if (key === "previewVideo") {
      let value = form.previewVideo || "";

      if (value.includes("watch?v=")) {
        const id = value.split("watch?v=")[1].split("&")[0];
        value = `https://www.youtube.com/embed/${id}`;
      }

      if (value.includes("youtu.be/")) {
        const id = value.split("youtu.be/")[1].split("?")[0];
        value = `https://www.youtube.com/embed/${id}`;
      }

      console.log("SAVING VIDEO 👉", value); // 👈 DEBUG

      data.append("previewVideo", value);
    } else {
      data.append(key, form[key]);
    }
  }
});

    data.append("whatYouWillLearn", JSON.stringify(form.whatYouWillLearn));
    data.append("courseContent", JSON.stringify(form.courseContent));

    if (image) data.append("image", image);

    try {
      await API.put(`/courses/${id}`, data);
      toast.success("Updated Successfully");
      navigate("/courses");
    } catch {
      toast.error("Update Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid mt-4">
      <div className="card shadow-sm p-4">

        <h4 className="mb-4">Edit Course</h4>

        <form onSubmit={handleSubmit}>

          {/* TITLE + LESSONS */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label>Course Title</label>
              <input name="title" value={form.title} onChange={handleChange} className="form-control" />
            </div>

            <div className="col-md-6">
              <label>Total Lessons</label>
              <input value={form.lessons || 0} readOnly className="form-control bg-light" />
            </div>
          </div>

          {/* CATEGORY + LEVEL */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label>Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="form-select">
                <option value="">Select</option>
                {categories.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label>Level</label>
              <select name="level" value={form.level} onChange={handleChange} className="form-select">
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="mb-3">
            <label>Description</label>
            <input name="description" value={form.description} onChange={handleChange} className="form-control" />
          </div>

          {/* DETAILS */}
          <div className="row mb-3">
            <div className="col-md-4">
              <label>Instructor</label>
              <input name="instructor" value={form.instructor} onChange={handleChange} className="form-control" />
            </div>
            <div className="col-md-4">
              <label>Duration</label>
              <input name="duration" value={form.duration} onChange={handleChange} className="form-control" />
            </div>
            <div className="col-md-4">
              <label>Enrolled</label>
              <input name="enrolled" value={form.enrolled} onChange={handleChange} className="form-control" />
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-6">
              <label>Language</label>
              <input name="language" value={form.language} onChange={handleChange} className="form-control" />
            </div>
            <div className="col-md-6">
              <label>Price</label>
              <input name="price" value={form.price} onChange={handleChange} className="form-control" />
            </div>
          </div>

          {/* WHAT YOU LEARN */}
          <div className="mb-4">
            <label>What You Will Learn</label>
            {form.whatYouWillLearn.map((item, i) => (
              <input key={i} value={item} onChange={(e) => handleLearnChange(i, e.target.value)} className="form-control mb-2" />
            ))}
            <button type="button" onClick={addLearn} className="btn btn-sm btn-outline-primary">+ Add</button>
          </div>

          {/* COURSE CONTENT */}
          <div className="mb-4">
            {form.courseContent.map((sec, i) => (
              <div key={i} className="border rounded p-3 mb-3 bg-light">

                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <b>{sec.sectionTitle}</b>
                    <div className="text-muted small">
                      {sec.lectures?.length || 0} lectures
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-light"
                      onClick={() => {
                        setTempSection({
                          sectionTitle: sec.sectionTitle || "",
                          lectures: sec.lectures.map(l => {
                            const found = lessons.find(x => x._id === l.lessonId);

                            return {
                              lessonId: l.lessonId || "",
                              title: found?.lectureTitle || l.title || "",
                              duration: found?.duration || l.duration || "",
                            };
                          })
                        });
                        setEditingIndex(i);
                        setShowModal(true);
                      }}
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm btn-light text-danger"
                      onClick={() => deleteSection(i)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

              </div>
            ))}
            <label>Course Content</label>
            <button
              type="button"
              onClick={() => {
                setTempSection({
                  sectionTitle: "",
                  lectures: [{ lessonId: "" }]
                });
                setEditingIndex(null);
                setShowModal(true);
              }}
              className="btn btn-outline-success btn-sm"
            >
              + Add Section
            </button>
          </div>

          {/* IMAGE */}
          {/* IMAGE */}
          {/* IMAGE UPLOAD */}
<input
  type="file"
  onChange={handleImage}
  className="form-control mb-3"
/>

{/* PREVIEW VIDEO INPUT */}
<div className="mb-3 mt-3">
  <label className="form-label">Preview Video</label>

  <input
    name="previewVideo"
    value={
      form.previewVideo
        ? form.previewVideo.replace(
            "https://www.youtube.com/embed/",
            "https://www.youtube.com/watch?v="
          )
        : ""
    }
    onChange={handleChange}
    className="form-control"
    placeholder="Paste YouTube link"
  />
</div>

{/* ✅ COMBINED PREVIEW (IMAGE + VIDEO SIDE BY SIDE) */}
<div className="d-flex gap-3 mt-3">

  {/* IMAGE PREVIEW */}
  {preview && (
    <img
      src={preview}
      style={{
        width: "120px",
        height: "80px",
        objectFit: "cover",
        borderRadius: "8px"
      }}
    />
  )}

  {/* VIDEO PREVIEW */}
  {form.previewVideo && (
    <iframe
      src={form.previewVideo}
      style={{
        width: "120px",
        height: "80px",
        border: "none",
        borderRadius: "8px"
      }}
      allow="autoplay; encrypted-media"
      allowFullScreen
    />
  )}

</div>

          <button className="btn btn-success">
            {loading ? "Updating..." : "Update"}
          </button>

        </form>
      </div>

      {/* MODAL */}
      {showModal && (
        <>
          <div className="modal-backdrop fade show"></div>

          <div className="modal fade show d-block">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg rounded-4">

                <div className="modal-header bg-light">
                  <h5 className="fw-bold">Edit Section</h5>
                  <button className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>

                <div className="modal-body">

                  <input
                    className="form-control mb-3"
                    placeholder="Section Title"
                    value={tempSection.sectionTitle}
                    onChange={(e) =>
                      setTempSection({
                        ...tempSection,
                        sectionTitle: e.target.value
                      })
                    }
                  />

                  {tempSection.lectures.map((lec, i) => (
                    <div key={i}>

                      <select
                        className="form-select mb-1"
                        value={lec.lessonId?.toString() || ""}
                        onChange={(e) => {
                          const selected = lessons.find(l => l._id === e.target.value);
                          if (!selected) return;

                          const updated = [...tempSection.lectures];
                          updated[i] = {
                            lessonId: selected._id,
                            title: selected.lectureTitle,
                            duration: selected.duration,
                          };

                          setTempSection({
                            ...tempSection,
                            lectures: updated
                          });
                        }}
                      >
                        <option value="">Select Lecture</option>

                        {lessons.map(l => (
                          <option key={l._id} value={l._id}>
                            {l.lectureTitle}
                          </option>
                        ))}
                      </select>

                      {/* ✅ ADD THIS (lecture preview) */}
                      {lec.title && (
                        <div className="d-flex justify-content-between small text-muted mb-2">
                          <span>📘 {lec.title}</span>
                          <span>⏱ {lec.duration}</span>
                        </div>
                      )}

                    </div>
                  ))}

                  <button
                    onClick={() =>
                      setTempSection({
                        ...tempSection,
                        lectures: [...tempSection.lectures, { lessonId: "" }]
                      })
                    }
                    className="btn btn-primary btn-sm mt-2"
                  >
                    + Add Lecture
                  </button>

                </div>

                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>

                  <button className="btn btn-success" onClick={saveSection}>
                    Save Section
                  </button>
                </div>

              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}