"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, BrainCircuit, ArrowRight, ShoppingBag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
  };
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const t = useTranslations("cart");
  const router = useRouter();

  const fetchCart = async () => {
    try {
      const res = await axios.get("/api/cart");
      setItems(res.data);
    } catch (error) {
      console.error("Cart fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchCart();
  }, [session]);

  const updateQuantity = async (productId: string, delta: number) => {
    try {
      await axios.post("/api/cart", { productId, quantity: delta });
      fetchCart();
    } catch (error) {
      console.error("Update quantity error", error);
    }
  };

  const removeItem = async (productId: string) => {
    try {
      await axios.delete("/api/cart", { data: { productId } });
      fetchCart();
    } catch (error) {
      console.error("Remove item error", error);
    }
  };

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  if (loading) return <div className="container mx-auto px-4 py-20 text-center">Loading cart...</div>;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <div className="bg-gray-50 p-12 rounded-3xl max-w-md mx-auto border-2 border-dashed border-gray-200">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">{t("empty")}</h2>
            <Link href="/products">
                <Button className="bg-purple-600 hover:bg-purple-700 rounded-xl px-8 py-6 h-auto text-lg">
                    Go Shopping
                </Button>
            </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10 tracking-tight">{t("title")}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <Card key={item.id} className="p-6 border-none shadow-sm rounded-2xl overflow-hidden flex flex-col sm:flex-row gap-6 items-center">
                <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-cover" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{item.product.name}</h3>
                  <div className="text-2xl font-black text-purple-600 mb-4">₹{item.product.price.toLocaleString()}</div>
                  <div className="flex items-center justify-center sm:justify-start gap-4">
                    <div className="flex items-center bg-gray-100 rounded-full p-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => updateQuantity(item.productId, -1)} disabled={item.quantity <= 1}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-bold">{item.quantity}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => updateQuantity(item.productId, 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-500 hover:bg-red-50" onClick={() => removeItem(item.productId)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-medium text-gray-400 mb-1">Total</div>
                  <div className="text-xl font-bold">₹{(item.product.price * item.quantity).toLocaleString()}</div>
                </div>
              </Card>
            ))}
          </div>

          {/* Checkout Summary */}
          <div className="lg:col-span-1">
            <Card className="p-8 border-none shadow-lg rounded-3xl sticky top-24 bg-white">
              <h2 className="text-2xl font-bold mb-6">Summary</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-bold uppercase text-xs bg-green-50 px-2 py-1 rounded">Free</span>
                </div>
                <div className="border-t pt-4 flex justify-between">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-3xl font-black text-purple-600">₹{subtotal.toLocaleString()}</span>
                </div>
              </div>

              <Link href="/checkout">
                <Button className="w-full h-16 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-lg font-bold shadow-xl shadow-slate-200">
                  {t("checkout")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              {/* AI Suggestion */}
              <div className="mt-8 p-6 bg-purple-50 rounded-2xl border border-purple-100 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-110 transition-transform">
                      <BrainCircuit className="w-12 h-12 text-purple-600" />
                  </div>
                  <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                      <BrainCircuit className="w-4 h-4" /> AI Savings Guide
                  </h4>
                  <p className="text-sm text-purple-800 leading-relaxed mb-4">
                      Applying coupon <strong>WELCOME20</strong> could save you ₹{(subtotal * 0.2).toLocaleString()}. Want me to apply it?
                  </p>
                  <Button variant="link" className="p-0 text-purple-600 font-bold h-auto border-b border-purple-600 rounded-none">
                      Apply automatically
                  </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
