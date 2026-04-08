import { useState } from "react";
import API from "../services/apiService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AdminRegister() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ FIXED (no e.preventDefault needed here)
  const handleSubmit = async () => {
    setLoading(true);

    try {
      console.log("🔥 Button clicked");
      console.log("📤 Data:", form);

      const res = await API.post("/admin/signup", form);

      console.log("✅ Success:", res.data);

      toast.success("Admin Registered Successfully 🎉");
      navigate("/admin-login");

    } catch (err) {
      console.log("❌ ERROR:", err.response?.data || err.message);
      toast.error(err.response?.data || "Registration Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">

      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md space-y-4">
        
        <h2 className="text-xl font-bold text-center text-black dark:text-white">
          Admin Register
        </h2>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          autoComplete="email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          autoComplete="new-password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700"
        />

        {/* Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {/* Login Link */}
        <p className="text-sm text-center text-gray-500 dark:text-gray-300">
          Already have account?{" "}
          <span
            onClick={() => navigate("/admin-login")}
            className="text-blue-500 cursor-pointer"
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}