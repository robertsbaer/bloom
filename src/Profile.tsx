import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabase";
import { User } from "@supabase/supabase-js";
import { Link } from "react-router-dom";

interface Order {
  id: string;
  created_at: string;
  total_cents: number;
  status: string;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetStatus, setResetStatus] = useState<{
    submitting: boolean;
    message: string;
    error: string;
  }>({ submitting: false, message: "", error: "" });

  const fetchOrders = useCallback(async (user: User) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("id, created_at, total_cents, status")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error.message);
      setOrders([]);
    } else {
      setOrders(data as Order[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const checkUserAndFetchOrders = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      setUser(currentUser);
      if (currentUser) {
        await fetchOrders(currentUser);
      } else {
        setLoading(false);
      }
    };

    checkUserAndFetchOrders();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (event === "SIGNED_IN" && currentUser) {
          await fetchOrders(currentUser);
        }
        if (event === "SIGNED_OUT") {
          setOrders([]);
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchOrders]);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#faf7f2", fontFamily: "'Georgia', serif" }}
    >
      <header
        className="sticky top-0 z-50"
        style={{
          backgroundColor: "rgba(250,247,242,0.97)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid #e8e0d0",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/">
            <img
              src={`${import.meta.env.BASE_URL}bloom__horizontal_color.png`}
              alt="Bloom 5.5"
              className="h-12 w-auto"
            />
          </Link>
          <div>
            {user ? (
              <button
                onClick={() => supabase.auth.signOut()}
                className="text-xs uppercase transition-colors duration-200 font-sans whitespace-nowrap"
                style={{ color: "#6b5c45", letterSpacing: "0.1em" }}
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="text-xs uppercase transition-colors duration-200 font-sans whitespace-nowrap"
                style={{ color: "#6b5c45", letterSpacing: "0.1em" }}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif" style={{ color: "#1e3a20" }}>
            Your Profile
          </h1>
          {user && (
            <p className="text-sm font-sans mt-2" style={{ color: "#6b5c45" }}>
              Welcome, {user.email}
            </p>
          )}
        </div>

        <div className="mb-10 text-center space-y-4">
          <button
            onClick={async () => {
              if (user) {
                setResetStatus({ submitting: true, message: "", error: "" });
                const { error } = await supabase.auth.resetPasswordForEmail(
                  user.email!,
                );
                if (error) {
                  setResetStatus({
                    submitting: false,
                    message: "",
                    error: `Error: ${error.message}`,
                  });
                } else {
                  setResetStatus({
                    submitting: false,
                    message:
                      "A password reset link has been sent to your email.",
                    error: "",
                  });
                }
              }
            }}
            disabled={resetStatus.submitting}
            className="text-xs uppercase transition-colors duration-200 font-sans whitespace-nowrap disabled:opacity-50"
            style={{ color: "#a07840", letterSpacing: "0.1em" }}
          >
            {resetStatus.submitting ? "Sending..." : "Reset Password"}
          </button>
          {resetStatus.message && (
            <p className="text-sm text-green-700 font-sans">
              {resetStatus.message}
            </p>
          )}
          {resetStatus.error && (
            <p className="text-sm text-red-700 font-sans">
              {resetStatus.error}
            </p>
          )}
        </div>

        <h2
          className="text-2xl font-serif mb-6 border-b pb-3"
          style={{ color: "#1e3a20", borderColor: "#e8e0d0" }}
        >
          Order History
        </h2>

        {loading ? (
          <p className="text-center font-sans" style={{ color: "#6b5c45" }}>
            Loading orders...
          </p>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table
              className="min-w-full text-sm font-sans rounded-lg overflow-hidden"
              style={{ border: "1px solid #e8e0d0" }}
            >
              <thead style={{ backgroundColor: "#f5f0e8" }}>
                <tr>
                  <th
                    className="p-3 text-left tracking-wider"
                    style={{ color: "#1e3a20" }}
                  >
                    Order ID
                  </th>
                  <th
                    className="p-3 text-left tracking-wider"
                    style={{ color: "#1e3a20" }}
                  >
                    Date
                  </th>
                  <th
                    className="p-3 text-left tracking-wider"
                    style={{ color: "#1e3a20" }}
                  >
                    Total
                  </th>
                  <th
                    className="p-3 text-left tracking-wider"
                    style={{ color: "#1e3a20" }}
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody
                style={{
                  backgroundColor: "#fbf8f1",
                  color: "#6b5c45",
                  borderTop: "1px solid #e8e0d0",
                }}
              >
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t"
                    style={{ borderColor: "#e8e0d0" }}
                  >
                    <td className="p-3 font-mono text-xs">
                      {order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="p-3">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      ${(order.total_cents / 100).toFixed(2)}
                    </td>
                    <td className="p-3 capitalize">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div
            className="text-center p-10 rounded-lg"
            style={{ backgroundColor: "#f5f0e8", border: "1px solid #e8d8a8" }}
          >
            <p className="font-sans mb-4" style={{ color: "#6b5c45" }}>
              You haven't placed any orders yet.
            </p>
            <Link
              to="/"
              className="px-6 py-2.5 rounded-full text-sm font-sans transition-all duration-200"
              style={{
                backgroundColor: "#1e3a20",
                color: "#fff",
                letterSpacing: "0.08em",
              }}
            >
              Start Shopping
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
