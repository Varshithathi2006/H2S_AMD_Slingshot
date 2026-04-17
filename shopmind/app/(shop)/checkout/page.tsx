"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Loader2, ArrowLeft, CreditCard } from "lucide-react";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get("/api/cart");
        if (res.data.length === 0) router.push("/cart");
        setItems(res.data);
      } catch (err) {
        router.push("/cart");
      }
    };
    fetchCart();
  }, [router]);

  const total = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/api/orders");
      setSuccess(true);
      setTimeout(() => {
        router.push("/orders");
      }, 3000);
    } catch (err) {
      console.error("Order error", err);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-md w-full scale-110 transition-transform">
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6 animate-bounce" />
          <h2 className="text-3xl font-black text-gray-900 mb-2">Order Confirmed!</h2>
          <p className="text-gray-500 mb-8">Thank you for shopping with ShopMind. Your AI agent is now handling the logistics.</p>
          <div className="flex flex-col gap-4">
              <Button onClick={() => router.push("/orders")} className="bg-slate-900 h-14 rounded-2xl font-bold">
                  View My Orders
              </Button>
              <p className="text-xs text-gray-400">Redirecting in 3 seconds...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <Button variant="ghost" onClick={() => router.back()} className="mb-8 p-0 hover:bg-transparent text-gray-500">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Cart
        </Button>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10 tracking-tight">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Shipping Form */}
          <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-8">
            <Card className="p-8 border-none shadow-sm rounded-3xl">
              <CardTitle className="text-xl font-bold mb-6">1. Shipping Information</CardTitle>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="Jane" required className="h-12 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Doe" required className="h-12 rounded-xl" />
                    </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="123 AI Lane, Tech City" required className="h-12 rounded-xl" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" placeholder="Bangalore" required className="h-12 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="zip">ZIP Code</Label>
                        <Input id="zip" placeholder="560001" required className="h-12 rounded-xl" />
                    </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-none shadow-sm rounded-3xl">
              <CardTitle className="text-xl font-bold mb-6 flex items-center justify-between">
                  <span>2. Payment Method</span>
                  <div className="flex gap-2">
                      <div className="w-8 h-5 bg-gray-200 rounded"></div>
                      <div className="w-8 h-5 bg-gray-200 rounded"></div>
                  </div>
              </CardTitle>
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-4">
                  <CreditCard className="w-6 h-6 text-slate-400" />
                  <div className="text-sm font-medium text-slate-600">Secure Payment Gateway (Mock)</div>
              </div>
            </Card>
          </form>

          {/* Order Summary */}
          <div>
            <Card className="p-8 border-none shadow-xl rounded-3xl sticky top-24 bg-white">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2 no-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-400 w-4">{item.quantity}x</span>
                        <span className="text-gray-700 truncate w-40">{item.product.name}</span>
                    </div>
                    <span className="font-semibold">₹{(item.product.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 space-y-3 mb-8">
                  <div className="flex justify-between text-gray-500 text-sm">
                      <span>Subtotal</span>
                      <span>₹{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-sm">
                      <span>AI Discount</span>
                      <span className="text-pink-600 font-bold">- ₹0</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-xl font-bold">Total</span>
                    <span className="text-3xl font-black text-purple-600">₹{total.toLocaleString()}</span>
                  </div>
              </div>

              <Button 
                form="checkout-form"
                type="submit"
                disabled={loading}
                className="w-full h-16 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-lg font-bold shadow-xl shadow-purple-200 transition-all active:scale-95"
              >
                {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</> : "Confirm & Pay"}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
