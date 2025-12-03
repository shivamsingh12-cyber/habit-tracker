import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (e: any) {
      setError(e.response?.data?.error || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Login
        </h2>

        {error && (
          <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
        )}

        <div className="flex flex-col gap-4">
          <input
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={submit}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
          >
            Login
          </button>
        </div>

        <p className="text-gray-400 text-sm text-center mt-4">
          No account?{" "}
          <Link
            to="/register"
            className="text-indigo-400 hover:text-indigo-300 underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
