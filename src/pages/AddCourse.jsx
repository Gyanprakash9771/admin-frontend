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

    // ✅ CHANGED (ARRAY FORMAT)
    whatYouWillLearn: [""],
    courseContent: []
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false); 

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // 🔥 AUTO LESSON CALCULATION
  useEffect(() => {
    if (form.courseContent) {
      const total = form.courseContent.reduce((acc, sec) => {
        return acc + (sec.lectures?.length || 0);
      }, 0);

      setForm((prev) => ({ ...prev, lessons: total }));
    }
  }, [form.courseContent]);

  // ✅ WHAT YOU WILL LEARN
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

  // ✅ COURSE CONTENT
  const addSection = () => {
    setForm({
      ...form,
      courseContent: [
        ...form.courseContent,
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

    try {
      const data = new FormData();

      data.append("title", form.title);
      data.append("lessons", form.lessons); // ✅ AUTO
      data.append("category", form.category);
      data.append("level", form.level);
      data.append("image", image);

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

      await API.post("/courses", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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
      console.log(err);
      toast.error("Failed to add course ❌"); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow max-w-2xl">
      <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
        Add Course
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input name="title" value={form.title} onChange={handleChange} className="w-full p-2 border rounded" />

        {/* 🔥 AUTO LESSON FIELD */}
        <input
          value={form.lessons || 0}
          readOnly
          className="w-full p-2 border rounded bg-gray-200"
        />

        <input name="category" value={form.category} onChange={handleChange} className="w-full p-2 border rounded" />

        <select name="level" value={form.level} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Select Level</option>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>

        <input name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded" />
        <input name="instructor" value={form.instructor} onChange={handleChange} placeholder="Instructor" className="w-full p-2 border rounded" />
        <input name="duration" value={form.duration} onChange={handleChange} placeholder="Duration" className="w-full p-2 border rounded" />
        <input name="enrolled" value={form.enrolled} onChange={handleChange} placeholder="Enrolled" className="w-full p-2 border rounded" />
        <input name="language" value={form.language} onChange={handleChange} placeholder="Language" className="w-full p-2 border rounded" />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Price" className="w-full p-2 border rounded" />

        {/* WHAT YOU WILL LEARN */}
        <div>
          <h3>What You Will Learn</h3>
          {form.whatYouWillLearn.map((item, i) => (
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
          {form.courseContent.map((section, sIndex) => (
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

        {preview && (
          <img src={preview} className="w-32 h-32 object-cover rounded" />
        )}

        <button disabled={loading} className="bg-green-500 text-white px-4 py-2 rounded">
          {loading ? "Adding..." : "Add Course"}
        </button>
      </form>
    </div>
  );
}