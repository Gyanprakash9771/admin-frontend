import { useState, useEffect } from "react";
import API from "../services/apiService";
import toast from "react-hot-toast";

export default function AddCourse() {
  const [form, setForm] = useState({
    title: "",
    lessons: "",
    category: "",
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
  useEffect(() => {
  API.get("/lessons")
    .then(res => setLessons(res.data))
    .catch(() => toast.error("Failed to load lessons"));
}, []);
  const [tempSection, setTempSection] = useState({
    sectionTitle: "",
    lectures: [{ title: "", duration: "" }],
  });
  

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
      lectures: [{ title: "", duration: "" }],
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
    const updated = [...form.courseContent];
    updated[sIndex].lectures.push({ title: "", duration: "" });
    setForm({ ...form, courseContent: updated });
  };

  const handleModalLectureChange = (index, field, value) => {
    const updated = [...tempSection.lectures];
    updated[index][field] = value;
    setTempSection({ ...tempSection, lectures: updated });
  };

  const addModalLecture = () => {
    setTempSection({
      ...tempSection,
      lectures: [...tempSection.lectures, { title: "", duration: "" }],
    });
  };

  const saveSection = () => {
    setForm({
      ...form,
      courseContent: [...form.courseContent, tempSection],
    });
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();

      Object.keys(form).forEach((key) => {
        if (key !== "whatYouWillLearn" && key !== "courseContent") {
          data.append(key, form[key]);
        }
      });

      data.append("image", image);
      data.append("whatYouWillLearn", JSON.stringify(form.whatYouWillLearn));
      data.append("courseContent", JSON.stringify(form.courseContent));

      await API.post("/courses", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Course Added Successfully ");

      setForm({
        title: "",
        lessons: "",
        category: "",
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

      setImage(null);
      setPreview(null);

    } catch (err) {
      toast.error("Failed to add course ❌");
    } finally {
      setLoading(false);
    }
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
              <input name="description" value={form.description} onChange={handleChange} className="form-control" />
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
        <h6 className="mb-0 fw-semibold">{section.sectionTitle}</h6>

        {/* ✏️ EDIT BUTTON */}
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={() => {
            setTempSection(section);
            setShowModal(true);

            // optional: store index for update
            setEditingIndex(sIndex);
          }}
        >
          Edit
        </button>
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

          
          <div className="mb-4">
            <label className="form-label">Course Image</label>
            <input type="file" onChange={handleImage} className="form-control" />

            {preview && (
              <img src={preview} className="mt-3 rounded" style={{ width: "120px" }} />
            )}
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
              <div className="modal-content shadow-lg border-0 rounded-4 overflow-hidden">

                
                <div className="modal-header border-0 pb-2 pt-3 px-4 bg-white">
                  <div>
                    <h5 className="fw-bold mb-0"> Add New Section</h5>
                    <small className="text-muted">
                      Organize your course content clearly
                    </small>
                  </div>
                  <button
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                
                <div className="modal-body px-4 py-3">

                  
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark">
                      Section Title
                    </label>
                    <input
                      placeholder="e.g. Introduction to React"
                      className="form-control form-control-lg rounded-3 shadow-sm"
                      value={tempSection.sectionTitle}
                      onChange={(e) =>
                        setTempSection({
                          ...tempSection,
                          sectionTitle: e.target.value,
                        })
                      }
                    />
                  </div>

                  
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <label className="form-label fw-semibold mb-0 text-dark">
                        Lectures
                      </label>
                      <button
                        onClick={addModalLecture}
                        className="btn btn-sm btn-outline-primary rounded-pill px-3"
                      >
                        + Add Lecture
                      </button>
                    </div>

                    {tempSection.lectures.map((lec, i) => (
                      <div
                        key={i}
                        className="border rounded-4 p-3 mb-3 bg-white shadow-sm position-relative"
                      >

                        
                        {tempSection.lectures.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 rounded-circle shadow-sm"
                            onClick={() => {
                              const updated = tempSection.lectures.filter((_, index) => index !== i);
                              setTempSection({ ...tempSection, lectures: updated });
                            }}
                          >
                            ✕
                          </button>
                        )}

                        <div className="row g-3">
                          <div className="col-md-7">
                            <input
                              placeholder="Lecture Title"
                              className="form-control shadow-sm"
                              value={lec.title}
                              onChange={(e) =>
                                handleModalLectureChange(i, "title", e.target.value)
                              }
                            />
                          </div>

                          <div className="col-md-5">
                            <select
  className="form-select shadow-sm"
  value={lec.title}
  onChange={(e) => {
    const selected = lessons.find(l => l._id === e.target.value);

    handleModalLectureChange(i, "title", selected?.lectureTitle || "");
    handleModalLectureChange(i, "duration", selected?.duration || "");
  }}
>
  <option value="">Select Lecture</option>

  {lessons.map((l) => (
    <option key={l._id} value={l._id}>
      {l.lectureTitle}
    </option>
  ))}
</select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>

                
                <div className="modal-footer border-0 px-4 pb-3 pt-2 bg-white">
                  <button
                    className="btn btn-light px-4 rounded-pill"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-success px-4 rounded-pill shadow-sm"
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