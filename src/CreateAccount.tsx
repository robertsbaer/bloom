import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "./supabase";

const inputCls =
  "w-full px-4 py-2.5 rounded-xl text-sm font-sans outline-none transition-all";
const inputStyle = {
  backgroundColor: "#f5f0e8",
  border: "1.5px solid #e0d8cc",
  color: "#1e2d1f",
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function CreateAccount() {
  const query = useQuery();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPostPurchase, setIsPostPurchase] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const emailFromQuery = query.get("email");
    if (emailFromQuery) {
      setEmail(emailFromQuery);
    }
    if (sessionStorage.getItem("pendingOrderId")) {
      setIsPostPurchase(true);
    }
  }, [query]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setMessage("");
    setError("");

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
    } else if (data.user) {
      setMessage("Account created successfully! Linking order...");
      const orderId = sessionStorage.getItem("pendingOrderId");
      if (orderId) {
        // Link the order to the new user
        const { error: invokeError } = await supabase.functions.invoke(
          "link-order",
          {
            body: { orderId, userId: data.user.id },
          },
        );
        if (invokeError) {
          setError(`Error linking order: ${invokeError.message}`);
          setLoading(false);
          return;
        }
        sessionStorage.removeItem("pendingOrderId");
      }
      setMessage("Order linked! Redirecting to your profile...");
      setTimeout(() => navigate("/profile"), 2000);
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
            {isPostPurchase ? "One Last Step!" : "Create Your Account"}
          </h1>
          <p className="text-sm font-sans mt-2" style={{ color: "#6b5c45" }}>
            {isPostPurchase
              ? "Create an account to save your order details and track your shipment."
              : "Join the Bloom 5.5 family and start your journey to radiant skin."}
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSignUp}>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPostPurchase}
              className={`${inputCls} ${
                isPostPurchase ? "bg-gray-200 cursor-not-allowed" : ""
              }`}
              style={inputStyle}
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
            <input
              type="password"
              placeholder="Confirm Password"
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
              disabled={loading}
              className="w-full py-3.5 rounded-full text-sm font-sans transition-all duration-200"
              style={{
                backgroundColor: loading ? "#a3a89c" : "#1e3a20",
                color: "#fff",
                letterSpacing: "0.08em",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Creating Account..." : "Create Account"}
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
