"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Product } from "@/lib/generated/client";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ShoppingCart, BrainCircuit, Star, ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const t = useTranslations("product");
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error("Fetch product error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    try {
      await axios.post("/api/cart", { productId: id, quantity: 1 });
      router.push("/cart");
    } catch (error) {
      console.error("Cart error", error);
    }
  };

  if (loading) return <div className="container mx-auto px-4 py-20 text-center">Loading...</div>;
  if (!product) return <div className="container mx-auto px-4 py-20 text-center">Product not found.</div>;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <Button 
            variant="ghost" 
            className="mb-8"
            onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-100 border shadow-sm">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <div className="mb-2">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full uppercase tracking-wider">
                    {product.category}
                </span>
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center text-yellow-500 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100">
                <Star className="w-5 h-5 fill-current" />
                <span className="ml-1 font-bold">{product.rating}</span>
              </div>
              <span className="text-gray-400">|</span>
              <span className="text-green-600 font-semibold">{product.stock} items in stock</span>
            </div>

            <div className="text-4xl font-black text-gray-900 mb-8">
              ₹{product.price.toLocaleString()}
            </div>

            <div className="prose prose-slate mb-10 max-w-none">
              <h3 className="text-lg font-bold">About this product</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {product.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <Button 
                size="lg" 
                className="flex-1 h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-lg font-bold"
                onClick={addToCart}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {t("addToCart")}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="flex-1 h-14 border-2 border-purple-200 text-purple-700 hover:bg-purple-50 rounded-2xl text-lg font-bold"
                onClick={() => router.push(`/chat?q=Tell me more about ${product.name}`)}
              >
                <BrainCircuit className="w-5 h-5 mr-2 text-purple-600" />
                Ask AI
              </Button>
            </div>

            {/* AI Highlight */}
            <div className="mt-12 p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl border border-purple-100 flex items-start gap-4">
                <div className="p-2 bg-white rounded-xl border border-purple-100 shadow-sm">
                    <BrainCircuit className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 mb-1">AI Shopping Insight</h4>
                    <p className="text-sm text-gray-600">This product is trending in {product.category}. AI analysis suggests it's a "Best Value" choice based on recent customer sentiment.</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
