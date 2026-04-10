import { useState } from "react";
import API from "../services/apiService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AdminLogin() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await API.post("/admin/login", form);

            
            localStorage.setItem("token", res.data.token);

            toast.success("Admin Login Successful ");

            navigate("/"); 
        } catch (err) {
            toast.error("Invalid Credentials ");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">

            <form
                onSubmit={handleSubmit}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md space-y-4"
            >
                <h2 className="text-xl font-bold text-center text-black dark:text-white">
                    Admin Login
                </h2>

                
                <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                    }
                    className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700"
                />

                
                <input
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                    }
                    className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700"
                />

                
                <button
                    disabled={loading}
                    className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
                <p className="text-sm text-center text-gray-500 dark:text-gray-300">
                    Don't have account?{" "}
                    <span
                        onClick={() => navigate("/admin-register")}
                        className="text-blue-500 cursor-pointer"
                    >
                        Register
                    </span>
                </p>
            </form>
        </div>
    );
}