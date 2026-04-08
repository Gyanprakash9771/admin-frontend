import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/apiService";
import toast from "react-hot-toast";

export default function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({});
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      const res = await API.get(`/courses`);
      const course = res.data.find((c) => c._id === id);

      let safeLearn = [];
      let safeContent = [];

      try {
        if (Array.isArray(course?.whatYouWillLearn)) {
          safeLearn = course.whatYouWillLearn;
        } else if (typeof course?.whatYouWillLearn === "string") {
          safeLearn = course.whatYouWillLearn.split(",").map(i => i.trim());
        }
      } catch {
        safeLearn = [];
      }

      try {
        if (Array.isArray(course?.courseContent)) {
          safeContent = course.courseContent;
        } else if (typeof course?.courseContent === "string") {
          safeContent = JSON.parse(course.courseContent);
        }
      } catch {
        safeContent = [];
      }

      setForm({
        ...course,
        description: course?.description || "",
        instructor: course?.instructor || "",
        duration: course?.duration || "",
        enrolled: course?.enrolled || "",
        language: course?.language || "",
        price: course?.price || "",
        whatYouWillLearn: safeLearn,
        courseContent: safeContent,
      });
    };
    fetchCourse();
  }, [id]);

  // 🔥 AUTO UPDATE LESSONS (NEW)
  useEffect(() => {
    if (form.courseContent) {
      const total = form.courseContent.reduce((acc, sec) => {
        return acc + (sec.lectures?.length || 0);
      }, 0);

      setForm((prev) => ({ ...prev, lessons: total }));
    }
  }, [form.courseContent]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  // WHAT YOU WILL LEARN
  const handleLearnChange = (index, value) => {
    const updated = [...form.whatYouWillLearn];
    updated[index] = value;
    setForm({ ...form, whatYouWillLearn: updated });
  };

  const addLearn = () => {
    setForm({
      ...form,
      whatYouWillLearn: [...(form.whatYouWillLearn || []), ""],
    });
  };

  // COURSE CONTENT
  const addSection = () => {
    setForm({
      ...form,
      courseContent: [
        ...(form.courseContent || []),
        { sectionTitle: "", lectures: [{ title: "", duration: "" }] },
      ],
    });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("title", form.title);
    data.append("category", form.category);
    data.append("level", form.level);

    data.append("description", form.description);
    data.append("instructor", form.instructor);
    data.append("duration", form.duration);
    data.append("enrolled", form.enrolled);
    data.append("language", form.language);
    data.append("price", form.price);

    data.append(
      "whatYouWillLearn",
      JSON.stringify(form.whatYouWillLearn || [])
    );

    data.append(
      "courseContent",
      JSON.stringify(form.courseContent || [])
    );

    if (image) {
      data.append("image", image);
    }

    try {
      await API.put(`/courses/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Course Updated Successfully ");
      navigate("/courses");
    } catch {
      toast.error("Update Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow max-w-2xl">
      <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
        Edit Course
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input name="title" value={form.title || ""} onChange={handleChange} className="w-full p-2 border rounded" />

        {/* 🔥 FIXED LESSON FIELD */}
        <input
          name="lessons"
          value={form.lessons || 0}
          readOnly
          className="w-full p-2 border rounded bg-gray-200 cursor-not-allowed"
        />

        <input name="category" value={form.category || ""} onChange={handleChange} className="w-full p-2 border rounded" />

        <select name="level" value={form.level || ""} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Select Level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <input name="description" value={form.description || ""} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded" />
        <input name="instructor" value={form.instructor || ""} onChange={handleChange} placeholder="Instructor" className="w-full p-2 border rounded" />
        <input name="duration" value={form.duration || ""} onChange={handleChange} placeholder="Duration" className="w-full p-2 border rounded" />
        <input name="enrolled" value={form.enrolled || ""} onChange={handleChange} placeholder="Enrolled" className="w-full p-2 border rounded" />
        <input name="language" value={form.language || ""} onChange={handleChange} placeholder="Language" className="w-full p-2 border rounded" />
        <input name="price" value={form.price || ""} onChange={handleChange} placeholder="Price" className="w-full p-2 border rounded" />

        {/* WHAT YOU WILL LEARN */}
        <div>
          <h3>What You Will Learn</h3>
          {(form.whatYouWillLearn || []).map((item, i) => (
            <input
              key={i}
              value={item}
              onChange={(e) => handleLearnChange(i, e.target.value)}
              className="w-full p-2 border rounded mt-2"
            />
          ))}
          <button type="button" onClick={addLearn}>+ Add</button>
        </div>

        {/* COURSE CONTENT */}
        <div>
          <h3>Course Content</h3>
          {(form.courseContent || []).map((section, sIndex) => (
            <div key={sIndex} className="border p-3 mt-3">
              <input
                placeholder="Section Title"
                value={section.sectionTitle}
                onChange={(e) => handleSectionTitle(sIndex, e.target.value)}
                className="w-full p-2 border rounded"
              />

              {section.lectures.map((lec, lIndex) => (
                <div key={lIndex} className="flex gap-2 mt-2">
                  <input
                    placeholder="Lecture Title"
                    value={lec.title}
                    onChange={(e) =>
                      handleLectureChange(sIndex, lIndex, "title", e.target.value)
                    }
                    className="w-full p-2 border rounded"
                  />
                  <input
                    placeholder="Duration"
                    value={lec.duration}
                    onChange={(e) =>
                      handleLectureChange(sIndex, lIndex, "duration", e.target.value)
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
              ))}

              <button type="button" onClick={() => addLecture(sIndex)}>
                + Add Lecture
              </button>
            </div>
          ))}
          <button type="button" onClick={addSection}>+ Add Section</button>
        </div>

        <input type="file" onChange={handleImage} />

        {form.image && (
          <img src={`https://edutest-backend-0r41.onrender.com/uploads/${form.image}`} className="w-24 h-24" />
        )}

        <button disabled={loading} className="bg-green-500 text-white px-4 py-2 rounded">
          {loading ? "Updating..." : "Update Course"}
        </button>
      </form>
    </div>
  );
}