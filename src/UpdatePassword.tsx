import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabase";
import { Session } from "@supabase/supabase-js";

export default function UpdatePassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "PASSWORD_RECOVERY") {
          setSession(session);
        } else if (event === "SIGNED_IN") {
          // This can happen if the user is already logged in.
          // We still want to allow password reset.
          const { data } = await supabase.auth.getSession();
          if (data.session) {
            setSession(data.session);
          }
        } else {
          setSession(null);
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setMessage("");
    setError("");

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
    } else {
      setMessage(
        "Password updated successfully! Redirecting to your profile...",
      );
      setTimeout(() => navigate("/profile"), 2000);
    }
    setLoading(false);
  };

  const inputCls =
    "w-full px-4 py-2.5 rounded-xl text-sm font-sans outline-none transition-all";
  const inputStyle = {
    backgroundColor: "#fff",
    border: "1px solid #e0d8cc",
    color: "#1e2d1f",
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#faf7f2", fontFamily: "'Georgia', serif" }}
    >
      <div className="max-w-md w-full p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-serif" style={{ color: "#1e3a20" }}>
            Update Your Password
          </h1>
          <p className="text-sm font-sans mt-2" style={{ color: "#6b5c45" }}>
            Enter a new password for your account.
          </p>
        </div>
        <form className="space-y-4" onSubmit={handlePasswordUpdate}>
          <div>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputCls}
              style={inputStyle}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputCls}
              style={inputStyle}
              required
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={!session || loading}
              className="w-full py-3.5 rounded-full text-sm font-sans transition-all duration-200 disabled:opacity-50"
              style={{
                backgroundColor: loading ? "#a3a89c" : "#1e3a20",
                color: "#fff",
                letterSpacing: "0.08em",
                cursor: !session || loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Updating..." : "Update Password"}
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
        {message && (
          <p
            className="text-sm text-center font-sans"
            style={{ color: "#1e3a20" }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
