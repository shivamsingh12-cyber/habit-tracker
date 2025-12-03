import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

type Habit = {
  _id: string;
  name: string;
  description?: string;
  streak: number;
  checkedInToday: boolean;
};

type LeaderItem = {
  userId: string;
  name: string;
  email: string;
  totalCheckins: number;
};

const DashboardPage = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [leaderboard, setLeaderboard] = useState<LeaderItem[]>([]);
  const navigate = useNavigate();

  const loadHabits = async () => {
    const res = await api.get("/habits");
    setHabits(res.data);
  };

  const loadLeaderboard = async () => {
    const res = await api.get("/habits/leaderboard");
    setLeaderboard(res.data);
  };

  const createHabit = async () => {
    if (!name.trim()) return;
    await api.post("/habits", { name, description });
    setName("");
    setDescription("");
    loadHabits();
  };

  useEffect(() => {
    loadHabits();
    loadLeaderboard();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6">
      
      {/* LEFT SIDE – HABITS */}
      <div className="md:col-span-2 space-y-6">
        <h3 className="text-2xl font-semibold text-purple-500">Your Habits</h3>

        {/* CREATE HABIT FORM */}
        <div className="bg-gray-800 rounded-xl p-5 shadow-md space-y-3">
          <input
            placeholder="Habit name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg bg-gray-700 px-4 py-2 text-white outline-none focus:ring focus:ring-blue-500"
          />
          <input
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg bg-gray-700 px-4 py-2 text-white outline-none focus:ring focus:ring-blue-500"
          />
          <button
            onClick={createHabit}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Create Habit
          </button>
        </div>

        {/* HABIT LIST */}
        <div className="space-y-4">
          <h1 className="text-xl font-semibold text-gray-500">Habit List</h1>
          {habits.map((h) => (
            <div
              key={h._id}
              onClick={() => navigate(`/habit/${h._id}`)}
              className="bg-gray-800 rounded-xl p-5 cursor-pointer shadow-md hover:bg-gray-700 transition border border-gray-700"
            >
              <h4 className="text-xl font-semibold text-blue-400">{h.name}</h4>
              {h.description && (
                <p className="text-gray-300 mt-1">{h.description}</p>
              )}

              <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between text-gray-200">
                <p>🔥 Streak: <span className="font-bold">{h.streak} days</span></p>
                <p>
                  Today:{" "}
                  {h.checkedInToday ? (
                    <span className="text-green-400 font-medium">Checked In</span>
                  ) : (
                    <span className="text-red-400 font-medium">Not Yet</span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE – LEADERBOARD */}
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold text-yellow-400">Leaderboard</h3>

        <div className="bg-gray-800 rounded-xl p-5 shadow-md">
          {leaderboard.length === 0 && (
            <p className="text-gray-400">No data yet.</p>
          )}

          <div className="space-y-4">
            {leaderboard.map((item, index) => (
              <div
                key={item.userId}
                className="flex justify-between items-center bg-gray-700 p-3 rounded-lg"
              >
                <div className="text-gray-200">
                  <p className="font-semibold">
                    #{index + 1} {item.name}
                  </p>
                  <p className="text-gray-400 text-sm">{item.email}</p>
                </div>

                <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                  {item.totalCheckins} check-ins
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;
