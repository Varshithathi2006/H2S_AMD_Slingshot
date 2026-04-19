"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/generated/client";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ShoppingCart, Star } from "lucide-react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations("product");
  const { data: session } = useSession();
  const router = useRouter();

  const addToCart = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    try {
      await axios.post("/api/cart", { productId: product.id, quantity: 1 });
      // Proactive hint: In a real app we'd use a toast here
      router.push("/cart");
    } catch (error) {
      console.error("Cart error", error);
    }
  };

  return (
    <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-gray-100">
      <Link href={`/products/${product.id}`}>
        <CardHeader className="p-0 relative aspect-square">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-bold text-gray-800 border border-white/20">
            {product.category}
          </div>
        </CardHeader>
      </Link>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Link href={`/products/${product.id}`}>
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-xs ml-1 text-gray-600">{product.rating}</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-black text-gray-900">
            ₹{product.price.toLocaleString()}
          </span>
          <div className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded">
             {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 gap-2">
        <Button 
            className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl"
            onClick={addToCart}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {t("addToCart")}
        </Button>
      </CardFooter>
    </Card>
  );
}
