import { useState, useEffect } from "react";
import API from "../services/apiService";
import toast from "react-hot-toast";
import { Trash2, Pencil } from "lucide-react";

export default function AddCourse() {
  const [form, setForm] = useState({
    title: "",
    lessons: "",
    category: "",
    previewVideo: "",
    level: "",
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
  const [showModal, setShowModal] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  useEffect(() => {
    API.get("/lessons")
      .then(res => setLessons(res.data))
      .catch(() => toast.error("Failed to load lessons"));
  }, []);
  const [tempSection, setTempSection] = useState({
  sectionTitle: "",
  lectures: [{ lessonId: "", title: "", duration: "" }],
});


  const handleChange = (e) => {
    const { name, value } = e.target;

    // 🎯 AUTO-CONVERT YOUTUBE LINK
    if (name === "previewVideo") {
      let embedUrl = value;

      if (value.includes("watch?v=")) {
        const videoId = value.split("watch?v=")[1].split("&")[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
    if (value.includes("youtu.be/")) {
  const videoId = value.split("youtu.be/")[1]?.split("?")[0];
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

  useEffect(() => {
    if (form.courseContent) {
      const total = form.courseContent.reduce((acc, sec) => {
        return acc + (sec.lectures?.length || 0);
      }, 0);
      setForm((prev) => ({ ...prev, lessons: total }));
    }
  }, [form.courseContent]);

  useEffect(() => {
    API.get("/categories").then(res => {
      setCategories(res.data);
    });
  }, []);

  const handleLearnChange = (index, value) => {
    const updated = [...form.whatYouWillLearn];
    updated[index] = value;
    setForm({ ...form, whatYouWillLearn: updated });
  };

  const addLearn = () => {
    setForm({
      ...form,
      whatYouWillLearn: [...form.whatYouWillLearn, ""],
    });
  };

  const addSection = () => {
    setTempSection({
  sectionTitle: "",
  lectures: [{ lessonId: "", title: "", duration: "" }],
});
    setShowModal(true);
  };

  const handleSectionTitle = (index, value) => {
    const updated = [...form.courseContent];
    updated[index].sectionTitle = value;
    setForm({ ...form, courseContent: updated });
  };

  const handleLectureChange = (sIndex, lIndex, field, value) => {
    const updated = [...form.courseContent];
    updated[sIndex].lectures[lIndex][field] = value;
    setForm({ ...form, courseContent: updated });
  };

  const addLecture = (sIndex) => {
  setForm((prev) => {
    const updated = [...prev.courseContent];

    // safety check
    if (!updated[sIndex]) return prev;

    updated[sIndex] = {
      ...updated[sIndex],
      lectures: [
        ...(updated[sIndex].lectures || []),
        { lessonId: "", title: "", duration: "" }
      ],
    };

    return {
      ...prev,
      courseContent: updated,
    };
  });
};

  const handleModalLectureChange = (index, field, value) => {
  const updated = [...tempSection.lectures];
  updated[index][field] = value;

  setTempSection({
    ...tempSection,
    lectures: updated,
  });
};

const addModalLecture = () => {
  setTempSection({
    ...tempSection,
    lectures: [
      ...tempSection.lectures,
      { lessonId: "", title: "", duration: "" }
    ],
  });
};

const saveSection = () => {
  // 🔥 SECTION TITLE VALIDATION
  if (!tempSection.sectionTitle.trim()) {
    toast.error("Section title required");
    return;
  }

  // 🔥 EMPTY LECTURE CHECK
  const hasEmptyLecture = tempSection.lectures.some(
    (lec) => !lec.lessonId
  );

  if (hasEmptyLecture) {
    toast.error("Please select all lectures");
    return;
  }

  // 🔥 DUPLICATE LECTURE CHECK
  const lectureIds = tempSection.lectures.map((lec) => lec.lessonId);
  const hasDuplicates = new Set(lectureIds).size !== lectureIds.length;

  if (hasDuplicates) {
    toast.error("Duplicate lectures not allowed");
    return;
  }

  // 🔥 UPDATE OR ADD
  if (editingIndex !== null) {
    const updated = [...form.courseContent];
    updated[editingIndex] = {
  sectionTitle: tempSection.sectionTitle,
  lectures: tempSection.lectures.map((lec) => ({
    lessonId: lec.lessonId,
    title: lec.title,
    duration: lec.duration,
  })),
};

    setForm({
      ...form,
      courseContent: updated,
    });

    setEditingIndex(null);
  } else {
    setForm({
      ...form,
      courseContent: [
  ...form.courseContent,
  {
    sectionTitle: tempSection.sectionTitle,
    lectures: tempSection.lectures.map((lec) => ({
      lessonId: lec.lessonId,
      title: lec.title,
      duration: lec.duration,
    })),
  }
],
    });
  }

  // 🔥 CLOSE MODAL
  setShowModal(false);

  // 🔥 RESET MODAL STATE (VERY IMPORTANT)
  setTempSection({
    sectionTitle: "",
    lectures: [{ lessonId: "", title: "", duration: "" }],
  });
};

const handleSubmit = async (e) => {
  e.preventDefault();

  // 🔥 BASIC VALIDATION
  if (!form.title.trim()) {
    return toast.error("Course title is required");
  }

  if (!form.category) {
    return toast.error("Select category");
  }

  if (!form.level) {
    return toast.error("Select level");
  }

  if (!form.courseContent.length) {
    return toast.error("Add at least one section");
  }

  // 🔥 CHECK EMPTY LECTURES
  const hasInvalidLecture = form.courseContent.some(section =>
    section.lectures.some(lec => !lec.lessonId)
  );

  if (hasInvalidLecture) {
    return toast.error("Some lectures are not selected");
  }

  setLoading(true);

  try {
    const data = new FormData();

    Object.keys(form).forEach((key) => {
      if (key !== "whatYouWillLearn" && key !== "courseContent") {
        data.append(key, form[key]);
      }
    });

    // 🔥 SAFE IMAGE APPEND
    if (image) {
      data.append("image", image);
    }

const cleanedLearn = form.whatYouWillLearn.filter(item => item.trim());

data.append(
  "whatYouWillLearn",
  JSON.stringify(cleanedLearn)
);

    data.append(
      "courseContent",
      JSON.stringify(form.courseContent)
    );

    await API.post("/courses", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success("Course Added Successfully 🚀");

    // 🔥 RESET FORM
    setForm({
      title: "",
      lessons: "",
      category: "",
      previewVideo: "",
      level: "",
      description: "",
      instructor: "",
      duration: "",
      enrolled: "",
      language: "",
      price: "",
      whatYouWillLearn: [""],
      courseContent: [],
    });

    setImage(null);
    setPreview(null);

  } catch (err) {
    console.log(err);
    toast.error("Failed to add course ❌");
  } finally {
    setLoading(false);
  }
};
  const deleteSection = (index) => {
    const updated = form.courseContent.filter((_, i) => i !== index);
    setForm({ ...form, courseContent: updated });
  };

  return (
    <div className="container-fluid mt-4">

      <div className="card shadow-sm p-4">

        <h4 className="mb-4">Add Course</h4>

        <form onSubmit={handleSubmit}>


          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Course Title</label>
              <input name="title" value={form.title} onChange={handleChange} className="form-control" />
            </div>

            <div className="col-md-6">
              <label className="form-label">Total Lessons</label>
              <input value={form.lessons || 0} readOnly className="form-control bg-light" />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Category</label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select Category</option>

                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>

            </div>



            <div className="col-md-6">
              <label className="form-label">Level</label>
              <select name="level" value={form.level} onChange={handleChange} className="form-select">
                <option value="">Select Level</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
          </div>


          <div className="row mb-3">
            <div className="col-md-12">
              <label className="form-label">Description</label>
              <textarea
  name="description"
  value={form.description || ""}
  onChange={handleChange}
  className="form-control"
  rows="4"
  placeholder="Enter course description"
/>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-4">
              <label className="form-label">Instructor</label>
              <input name="instructor" value={form.instructor} onChange={handleChange} className="form-control" />
            </div>

            <div className="col-md-4">
              <label className="form-label">Duration</label>
              <input name="duration" value={form.duration} onChange={handleChange} className="form-control" />
            </div>

            <div className="col-md-4">
              <label className="form-label">Enrolled</label>
              <input name="enrolled" value={form.enrolled} onChange={handleChange} className="form-control" />
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-6">
              <label className="form-label">Language</label>
              <input name="language" value={form.language} onChange={handleChange} className="form-control" />
            </div>

            <div className="col-md-6">
              <label className="form-label">Price</label>
              <input name="price" value={form.price} onChange={handleChange} className="form-control" />
            </div>
          </div>


          <div className="mb-4">
            <label className="form-label">What You Will Learn</label>

            {form.whatYouWillLearn.map((item, i) => (
              <input
                key={i}
                value={item}
                onChange={(e) => handleLearnChange(i, e.target.value)}
                className="form-control mb-2"
              />
            ))}

            <button type="button" onClick={addLearn} className="btn btn-outline-primary btn-sm">
              + Add Point
            </button>
          </div>


          <div className="mb-4">
            <label className="form-label">Course Content</label>

            {form.courseContent.map((section, sIndex) => (
              <div key={sIndex} className="border rounded p-3 mb-3 bg-light">

                {/* SECTION HEADER */}
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div>
                    <h6 className="mb-0 fw-bold">{section.sectionTitle}</h6>
                    <small className="text-muted">
                      {section.lectures?.length || 0} lectures
                    </small>
                  </div>

                  <div className="d-flex align-items-center gap-2">

                    {/* EDIT BUTTON */}
                    <button
                      type="button"
                      className="btn btn-sm btn-light rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "36px", height: "36px" }}
                      onClick={() => {
                        setTempSection({
  sectionTitle: section.sectionTitle,
  lectures: section.lectures.map((lec) => ({
    lessonId: lec.lessonId,
    title: lec.title,
    duration: lec.duration,
  })),
});
                        setShowModal(true);
                        setEditingIndex(sIndex);
                      }}
                    >
                      <Pencil size={16} />
                    </button>

                    {/* DELETE BUTTON */}
                    <button
                      type="button"
                      className="btn btn-sm btn-light rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: "36px",
                        height: "36px",
                        color: "#dc3545",
                        transition: "all 0.2s ease"
                      }}
                      onClick={() => deleteSection(sIndex)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#dc3545";
                        e.currentTarget.style.color = "#fff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "";
                        e.currentTarget.style.color = "#dc3545";
                      }}
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>
                </div>
                {/* LECTURES LIST */}
                {section.lectures.map((lec, lIndex) => (
                  <div key={lIndex} className="d-flex justify-content-between border rounded px-2 py-1 mb-2 bg-white">

                    <span>{lec.title}</span>
                    <small className="text-muted">{lec.duration}</small>

                  </div>
                ))}

              </div>
            ))}

            <button type="button" onClick={addSection} className="btn btn-outline-success btn-sm">
              + Add Section
            </button>
          </div>


          <div className="row mb-4">

  {/* IMAGE */}
  <div className="col-md-6">
    <label className="form-label">Course Image</label>
    <input type="file" onChange={handleImage} className="form-control" />

    {preview && (
      <img
        src={preview}
        className="mt-3 rounded"
        style={{ width: "120px", height: "80px", objectFit: "cover" }}
      />
    )}
  </div>

  {/* VIDEO */}
  <div className="col-md-6">
    <label className="form-label">Preview Video URL</label>
    <input
      name="previewVideo"
      value={form.previewVideo}
      onChange={handleChange}
      className="form-control"
      placeholder="Paste YouTube link"
    />

    {form.previewVideo && (
      <div className="mt-3">
        <iframe
          src={form.previewVideo}
          style={{
            width: "120px",
            height: "80px",
            borderRadius: "8px",
            border: "none"
          }}
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </div>
    )}
  </div>

</div>

          {/* SUBMIT */}
          <button disabled={loading} className="btn btn-success px-4">
            {loading ? "Adding..." : "Add Course"}
          </button>

        </form>
      </div>
      {showModal && (
        <>
          <div className="modal-backdrop fade show"></div>

          <div className="modal fade show d-block">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">

                {/* HEADER */}
                <div className="modal-header bg-light border-0 px-4 py-3">
                  <div>
                    <h5 className="fw-bold mb-0">📚 Add Section</h5>
                    <small className="text-muted">
                      Create structured learning content
                    </small>
                  </div>
                  <button
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                {/* BODY */}
                <div className="modal-body px-4 py-3">

                  {/* SECTION TITLE */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      Section Title
                    </label>
                    <input
                      placeholder="e.g. Introduction to React"
                      className="form-control form-control-lg rounded-3"
                      value={tempSection.sectionTitle}
                      onChange={(e) =>
                        setTempSection({
                          ...tempSection,
                          sectionTitle: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* LECTURES */}
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="fw-semibold mb-0">Lectures</h6>

                      <button
                        onClick={addModalLecture}
                        className="btn btn-primary btn-sm rounded-pill px-3"
                      >
                        + Add Lecture
                      </button>
                    </div>

                    {tempSection.lectures.map((lec, i) => (
                      <div
                        key={i}
                        className="border rounded-4 p-3 mb-3 bg-white shadow-sm"
                      >
                        <div className="d-flex justify-content-between align-items-center mb-2">

                          <span className="fw-semibold text-muted">
                            Lecture {i + 1}
                          </span>

                          {tempSection.lectures.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-sm btn-light rounded-circle d-flex align-items-center justify-content-center"
                              style={{
                                width: "32px",
                                height: "32px",
                                color: "#dc3545",
                                transition: "all 0.2s ease"
                              }}
                              onClick={() => {
                                const updated = tempSection.lectures.filter((_, index) => index !== i);
                                setTempSection({ ...tempSection, lectures: updated });
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#dc3545";
                                e.currentTarget.style.color = "#fff";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "";
                                e.currentTarget.style.color = "#dc3545";
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>

                        {/* SINGLE DROPDOWN (FIXED UX) */}
                        <select
                          className="form-select mb-2"
                          value={lec.lessonId || ""}
                          onChange={(e) => {
                            const selected = lessons.find(l => l._id === e.target.value);

                            if (!selected) return; // 🔥 IMPORTANT FIX

                            const updated = [...tempSection.lectures];

                            updated[i] = {
  lessonId: selected._id,
  title: selected.lectureTitle,
  duration: selected.duration,
};

                            setTempSection({
                              ...tempSection,
                              lectures: updated,
                            });
                          }}
                        >
                          <option value="">Select Lecture</option>

                          {lessons.map((l) => (
                            <option key={l._id} value={l._id}>
                              {l.lectureTitle}
                            </option>
                          ))}
                        </select>

                        {/* INFO DISPLAY */}
                        {lec.title && (
                          <div className="d-flex justify-content-between small text-muted">
                            <span>📘 {lec.title}</span>
                            <span>⏱ {lec.duration}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                </div>

                {/* FOOTER */}
                <div className="modal-footer border-0 px-4 py-3 bg-light">
                  <button
                    className="btn btn-outline-secondary px-4 rounded-pill"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>

                  <button
                    className="btn btn-success px-4 rounded-pill"
                    onClick={saveSection}
                  >
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