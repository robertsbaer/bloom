import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { useNavigate } from "react-router-dom";

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
  status: string;
  square_receipt_url: string | null;
}

export default function Admin() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCheckCompleted, setAdminCheckCompleted] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

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
      } else {
        setIsAdmin(true);
      }
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

  if (loading || !adminCheckCompleted) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return <div>Access Denied</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Order ID</th>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Customer</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Shipping Address</th>
              <th className="py-2 px-4 border-b">Total</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Receipt</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="py-2 px-4 border-b text-sm">
                  {order.id.slice(0, 8)}
                </td>
                <td className="py-2 px-4 border-b text-sm">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border-b text-sm">
                  {order.ship_name}
                </td>
                <td className="py-2 px-4 border-b text-sm">{order.email}</td>
                <td className="py-2 px-4 border-b text-sm">
                  {order.ship_address1}, {order.ship_city}, {order.ship_state}{" "}
                  {order.ship_postal_code}
                </td>
                <td className="py-2 px-4 border-b text-sm">
                  ${(order.total_cents / 100).toFixed(2)}
                </td>
                <td className="py-2 px-4 border-b text-sm">{order.status}</td>
                <td className="py-2 px-4 border-b text-sm">
                  {order.square_receipt_url ? (
                    <a
                      href={order.square_receipt_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
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
  );
}
