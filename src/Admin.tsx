import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { Link, useNavigate } from "react-router-dom";

type OrderStatus =
  | "New Order"
  | "Packed"
  | "Shipped"
  | "Completed"
  | "Refunded";

interface Order {
  id: string;
  created_at: string;
  email: string;
  ship_name: string;
  ship_address1: string;
  ship_address2: string | null;
  ship_city: string;
  ship_state: string;
  ship_postal_code: string;
  total_cents: number;
  status: OrderStatus;
  square_receipt_url: string | null;
}

const statusColors: Record<OrderStatus, string> = {
  "New Order": "bg-blue-100 text-blue-800",
  Packed: "bg-yellow-100 text-yellow-800",
  Shipped: "bg-purple-100 text-purple-800",
  Completed: "bg-green-100 text-green-800",
  Refunded: "bg-red-100 text-red-800",
};

export default function Admin() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCheckCompleted, setAdminCheckCompleted] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  async function updateOrderStatus(orderId: string, status: OrderStatus) {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);

    if (error) {
      console.error("Error updating order status:", error);
      return;
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
    );
  }

  useEffect(() => {
    const checkAdminAndFetchOrders = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      const { data: admin, error: adminError } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", user.id)
        .single();

      if (adminError || !admin) {
        setIsAdmin(false);
        setAdminCheckCompleted(true);
        setLoading(false);
        return;
      }

      setIsAdmin(true);
      setAdminCheckCompleted(true);

      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (ordersError) {
        console.error("Error fetching orders:", ordersError);
      } else {
        setOrders(orders);
      }

      setLoading(false);
    };

    checkAdminAndFetchOrders();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!adminCheckCompleted) {
    return <div>Verifying admin status...</div>;
  }

  if (!isAdmin) {
    return <div>Access Denied</div>;
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#faf7f2", fontFamily: "'Georgia', serif" }}
    >
      {/* Admin Header */}
      <header
        className="bg-white shadow-sm"
        style={{ borderBottom: "1px solid #e8e0d0" }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="text-xl font-serif" style={{ color: "#1e3a20" }}>
            Admin Panel
          </h1>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-xs uppercase transition-colors duration-200 font-sans whitespace-nowrap"
              style={{ color: "#6b5c45", letterSpacing: "0.1em" }}
            >
              Back to Home
            </Link>
            <button
              onClick={() => supabase.auth.signOut()}
              className="text-xs uppercase transition-colors duration-200 font-sans whitespace-nowrap"
              style={{ color: "#6b5c45", letterSpacing: "0.1em" }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th scope="col" className="px-6 py-4">
                    Order
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Receipt
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.id.slice(0, 8)}...
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.ship_name}
                      </div>
                      <div className="text-sm text-gray-500">{order.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${(order.total_cents / 100).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(
                            order.id,
                            e.target.value as OrderStatus,
                          )
                        }
                        className={`text-xs font-semibold rounded-full border-none p-2 appearance-none ${statusColors[order.status]}`}
                        style={{ minWidth: "120px" }}
                      >
                        <option>New Order</option>
                        <option>Packed</option>
                        <option>Shipped</option>
                        <option>Completed</option>
                        <option>Refunded</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {order.square_receipt_url ? (
                        <a
                          href={order.square_receipt_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-900 font-sans font-medium"
                        >
                          View Receipt
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
