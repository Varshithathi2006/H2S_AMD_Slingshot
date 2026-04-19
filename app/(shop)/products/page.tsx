"use client";

import { useState } from "react";
import ProductGrid from "@/components/shop/ProductGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, X } from "lucide-react";

const CATEGORIES = ["All", "Electronics", "Clothing", "Books", "Home", "Sports"];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentQuery, setCurrentQuery] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              className="pl-10 h-11 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyUp={(e) => e.key === "Enter" && setCurrentQuery(searchQuery)}
            />
            {searchQuery && (
              <button 
                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                onClick={() => { setSearchQuery(""); setCurrentQuery(""); }}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 w-full no-scrollbar">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                className="rounded-full whitespace-nowrap"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
                {selectedCategory === "All" ? "All Products" : selectedCategory}
                {currentQuery && <span className="text-gray-500 font-normal"> / Results for "{currentQuery}"</span>}
            </h1>
            <Button variant="ghost" size="sm" className="md:hidden">
                <Filter className="w-4 h-4 mr-2" /> Filters
            </Button>
        </div>

        <ProductGrid 
            category={selectedCategory === "All" ? undefined : selectedCategory} 
            query={currentQuery || undefined} 
        />
      </main>
    </div>
  );
}
