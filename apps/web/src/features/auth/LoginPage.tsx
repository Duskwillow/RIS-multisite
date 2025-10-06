import React, { useState } from "react";
import axios from "axios";
import { useAuthStore } from "../../../src/services/authStore";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const credentials = {
      username: username,
      password: password,
    };

    console.log("Sending login request with credentials:", credentials);

    try {
      const response = await axios.post("http://localhost:3001/auth/login", {
        username,
        password,
      });
      console.log("Login successful - Full response:", response);
      console.log("Access token:", response.data.access_token);
      console.log("User data:", response.data.user);

      const { access_token, user } = response.data;

      login(access_token, {
        userId: user?.id ?? user?.userId ?? 0,
        username: user?.username ?? username,
        role: user?.role ?? "Undefined",
        siteId_origine: user?.site_origine_id ?? user?.siteId_origine ?? "",
        reference_id: user?.reference_id ?? 0,
        nom_prenom: user?.nom_prenom ?? null,
      });

      navigate("/dashboard");
    } catch (err: unknown) {
      let errorMessage = "Login failed. Please check your credentials.";
      console.log(errorMessage);
      if (axios.isAxiosError(err) && err.response) {
        errorMessage = err.response.data?.message || err.message;
        console.error("Login failed - Error details:", err.response?.data);
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      console.error("Login failed:", errorMessage);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md relative z-10">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-amber-400 focus:border-amber-400 p-2"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-amber-400 focus:border-amber-400 p-2"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-amber-400 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-amber-500 transition"
          >
            Login
          </button>
        </form>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
