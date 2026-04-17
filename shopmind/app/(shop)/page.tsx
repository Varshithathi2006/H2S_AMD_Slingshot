"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag, BrainCircuit, Mic, Search } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80')] opacity-20 bg-cover bg-center" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <BrainCircuit className="w-12 h-12 text-purple-400" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
            Shop with <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Mind</span>
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            The world's first agentic AI shopping experience. No more infinite scrolling. Just ask for what you need.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/chat">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 h-14 rounded-full text-lg shadow-lg shadow-purple-500/20">
                <Mic className="mr-2 h-5 w-5" /> Ask AI to Shop
              </Button>
            </Link>
            <Link href="/products">
              <Button size="lg" variant="outline" className="text-white border-white/20 hover:bg-white/10 px-8 h-14 rounded-full text-lg backdrop-blur-sm">
                <ShoppingBag className="mr-2 h-5 w-5" /> Browse Collection
              </Button>
            </Link>
          </div>

          <div className="mt-12 relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-4 bg-white/10 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-md transition-all sm:text-lg"
              placeholder="Find me a gaming laptop under ₹70,000..."
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  window.location.href = `/chat?q=${encodeURIComponent((e.target as HTMLInputElement).value)}`;
                }
              }}
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-12">Experience Shopping Reposessed</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="space-y-4">
                    <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto">
                        <BrainCircuit className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold">Intelligent Agents</h3>
                    <p className="text-gray-600">Our AI agents don't just search; they understand your needs and find the perfect match.</p>
                </div>
                <div className="space-y-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                        <Mic className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold">Voice Commerce</h3>
                    <p className="text-gray-600">Shop hands-free. From searching to placing orders, use your voice for everything.</p>
                </div>
                <div className="space-y-4">
                    <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto">
                        <ShoppingBag className="w-8 h-8 text-pink-600" />
                    </div>
                    <h3 className="text-xl font-bold">Instant Checkout</h3>
                    <p className="text-gray-600">No more complex forms. Our AI handles the details so you can shop in seconds.</p>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}
