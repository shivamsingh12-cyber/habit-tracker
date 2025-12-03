import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { getSocket } from "../socket";

type Habit = {
  _id: string;
  name: string;
  description?: string;
};

type EventCheckin = {
  habitId: string;
  userId: string;
  date: string;
  streak: number;
};

const HabitPage = () => {
  
  const { id } = useParams<{ id: string }>();
  const [habit, setHabit] = useState<Habit | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const [checkedInToday, setCheckedInToday] = useState<boolean>(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [activity, setActivity] = useState<any[]>([]);

  useEffect(() => {
  if (!id) return;
  api.get(`/activity/${id}`).then(res => setActivity(res.data));
}, [id]);


  const load = async () => {
    const [habitRes, habitsRes] = await Promise.all([
      api.get(`/habits/${id}`),
      api.get("/habits"),
    ]);

    setHabit(habitRes.data);
    const current = habitsRes.data.find((h: any) => h._id === id);
    if (current) {
      setStreak(current.streak);
      setCheckedInToday(current.checkedInToday);
    }
  };

  const doCheckin = async () => {
    if (!id) return;
    try {
      const res = await api.post(`/habits/${id}/checkin`);
      setStreak(res.data.streak);
      setCheckedInToday(true);
    } catch (e: any) {
      alert(e.response?.data?.error || "Error");
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const socket = getSocket();
    socket.emit("join_habit", id);

    const handler = (ev: EventCheckin) => {
      if (ev.habitId === id) {
        setMessages((prev) => [
          `User ${ev.userId} checked in (${ev.date})`,
          ...prev,
        ]);
      }
    };

    socket.on("checkin_created", handler);

    return () => {
      socket.off("checkin_created", handler);
    };
  }, [id]);

  if (!habit)
    return (
      <div className="text-center text-gray-400 py-10">Loading...</div>
    );

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-2 text-indigo-600 dark:text-indigo-400">
          {habit.name}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {habit.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-indigo-50 dark:bg-indigo-950 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-500 dark:text-gray-300">Current Streak</p>
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-300">
              {streak} days
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-500 dark:text-gray-300">Today</p>
            <p className="text-xl font-semibold">
              {checkedInToday ? (
                <span className="text-green-600 dark:text-green-400">✔ Checked in</span>
              ) : (
                <span className="text-red-500 dark:text-red-400">✘ Not yet</span>
              )}
            </p>
          </div>
        </div>

        {/* Check-in Button */}
        <button
          disabled={checkedInToday}
          onClick={doCheckin}
          className={`w-full py-3 rounded-lg font-semibold transition ${
            checkedInToday
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          {checkedInToday ? "Already checked in" : "Check in for today"}
        </button>
      </div>

      {/* Real-time activity */}
      <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          Real-time Activity
        </h2>

     {activity.length === 0 ? (
  <p className="text-gray-500 dark:text-gray-400">No recent activity yet.</p>
) : (
  <ul className="space-y-2">
    {activity.map((a, idx) => (
      <li
        key={idx}
        className="bg-gray-50 dark:bg-gray-800 rounded-md p-3 text-gray-700 dark:text-gray-300"
      >
        <span className="font-semibold">{a.user?.name}</span>: {a.message}
        <br />
        <small>{new Date(a.createdAt).toLocaleString()}</small>
      </li>
    ))}
  </ul>
)}
      </div>
    </div>
  );
};

export default HabitPage;
