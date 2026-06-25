import React, { useState } from "react";
import { supabase } from "./supabase";
import { Link, useNavigate } from "react-router-dom";

const inputCls =
  "w-full px-4 py-2.5 rounded-xl text-sm font-sans outline-none transition-all";
const inputStyle = {
  backgroundColor: "#f5f0e8",
  border: "1.5px solid #e0d8cc",
  color: "#1e2d1f",
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
    } else {
      navigate("/profile");
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#faf7f2", fontFamily: "'Georgia', serif" }}
    >
      <div className="max-w-md w-full p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-serif" style={{ color: "#1e3a20" }}>
            Login
          </h1>
        </div>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
              style={inputStyle}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputCls}
              style={inputStyle}
              required
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full text-sm font-sans transition-all duration-200"
              style={{
                backgroundColor: loading ? "#a3a89c" : "#1e3a20",
                color: "#fff",
                letterSpacing: "0.08em",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
        {error && (
          <p
            className="text-sm text-center font-sans"
            style={{ color: "#b3261e" }}
          >
            {error}
          </p>
        )}
        <div className="text-center">
          <Link
            to="/"
            className="text-xs font-sans transition-colors"
            style={{ color: "#6b5c45", letterSpacing: "0.05em" }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
