import { useEffect, useState } from "react";
import API from "../services/apiService";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liveUsers, setLiveUsers] = useState(120);

  useEffect(() => {
    const fetchData = async () => {
      const res = await API.get("/courses");
      setCourses(res.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  // 🔥 Simulate real-time users
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveUsers((prev) => prev + Math.floor(Math.random() * 3 - 1));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const totalRevenue = courses.reduce((acc, c) => acc + Number(c.price), 0);

  // 🧠 AI Insights (basic logic)
  const insights = [
    totalRevenue > 5000
      ? "🚀 Revenue is growing fast"
      : "⚠️ Increase pricing strategy",
    courses.length > 5
      ? "📚 Good course variety"
      : "➕ Add more courses",
  ];

  return (
    <div className="p-6 bg-gradient-to-br from-black to-gray-900 min-h-screen text-white space-y-6">

      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Elite Dashboard</h1>
        <span className="text-sm text-gray-400">
          Live Users: {liveUsers}
        </span>
      </div>

      {/* 🔥 KPI CARDS */}
      <div className="grid md:grid-cols-3 gap-6">

        {loading ? (
          [...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-white/10 animate-pulse rounded-xl"
            />
          ))
        ) : (
          <>
            <motion.div className="bg-white/10 p-5 rounded-xl backdrop-blur">
              <p className="text-gray-400 text-sm">Revenue</p>
              <h2 className="text-3xl font-bold">₹{totalRevenue}</h2>
            </motion.div>

            <motion.div className="bg-white/10 p-5 rounded-xl backdrop-blur">
              <p className="text-gray-400 text-sm">Courses</p>
              <h2 className="text-3xl font-bold">{courses.length}</h2>
            </motion.div>

            <motion.div className="bg-gradient-to-r from-pink-500 to-purple-500 p-5 rounded-xl">
              <p>Growth</p>
              <h2 className="text-3xl font-bold">+32%</h2>
            </motion.div>
          </>
        )}

      </div>

      {/* 🧠 AI INSIGHTS */}
      <div className="bg-white/10 p-5 rounded-xl backdrop-blur">
        <h2 className="mb-3 font-semibold">AI Insights</h2>
        <ul className="space-y-2 text-sm text-gray-300">
          {insights.map((i, idx) => (
            <li key={idx}>{i}</li>
          ))}
        </ul>
      </div>

      {/* 🔔 NOTIFICATIONS */}
      <div className="bg-white/10 p-5 rounded-xl backdrop-blur">
        <h2 className="mb-3 font-semibold">Notifications</h2>
        <ul className="text-sm text-gray-400 space-y-2">
          <li>🔔 New course added</li>
          <li>💰 Payment received</li>
          <li>👤 New user joined</li>
        </ul>
      </div>

      {/* 🏆 RECENT COURSES */}
      <div className="bg-white/10 p-5 rounded-xl backdrop-blur">
        <h2 className="mb-4 font-semibold">Recent Courses</h2>

        {loading ? (
          <div className="h-20 bg-white/10 animate-pulse rounded" />
        ) : (
          <div className="space-y-3">
            {courses.slice(0, 5).map((c) => (
              <motion.div
                key={c._id}
                whileHover={{ scale: 1.02 }}
                className="flex justify-between items-center p-2 hover:bg-white/5 rounded"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={`http://localhost:5000/uploads/${c.image}`}
                    className="w-10 h-10 rounded"
                  />
                  <span>{c.title}</span>
                </div>
                <span className="text-green-400">₹{c.price}</span>
              </motion.div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}