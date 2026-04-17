"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Package, Truck, CheckCircle2, Search, BrainCircuit } from "lucide-react";
import Link from "next/link";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    imageUrl: string;
  };
}

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const t = useTranslations("nav");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/orders");
        setOrders(res.data);
      } catch (error) {
        console.error("Orders fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    if (session) fetchOrders();
  }, [session]);

  if (loading) return <div className="container mx-auto px-4 py-20 text-center">Loading orders...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10 tracking-tight">Your History</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-4">No orders yet</h2>
            <Link href="/products">
                <Button className="bg-purple-600 rounded-xl">Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <Card key={order.id} className="border-none shadow-sm rounded-3xl overflow-hidden group">
                <CardHeader className="bg-white border-b px-8 py-6 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase mb-1">Order Placed</p>
                      <p className="font-bold text-gray-800">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase mb-1">Total Amount</p>
                      <p className="font-bold text-purple-600">₹{order.total.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100">
                    {order.status === "PENDING" && <Package className="w-4 h-4 text-orange-500" />}
                    {order.status === "DELIVERED" && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    <span className="text-sm font-bold uppercase tracking-wide">{order.status}</span>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-6">
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                          <img src={item.product.imageUrl} alt={item.product.name} className="object-cover w-full h-full" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 mb-1">{item.product.name}</h4>
                          <p className="text-sm text-gray-500">Qty: {item.quantity} · Price: ₹{item.price.toLocaleString()}</p>
                        </div>
                        <Link href={`/chat?q=Where is my ${item.product.name}?`}>
                            <Button variant="ghost" size="sm" className="text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-full">
                                <Search className="w-4 h-4 mr-2" /> Track with AI
                            </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 pt-8 border-t flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Truck className="w-4 h-4" />
                          <span>Estimated delivery within 2-3 business days</span>
                      </div>
                      <Link href="/chat">
                          <Button size="sm" className="bg-slate-900 h-10 rounded-xl px-6">
                            <BrainCircuit className="w-4 h-4 mr-2" /> Ask AI about Order
                          </Button>
                      </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
