"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import StatsCard from "@/components/admin/StatsCard";
import { DollarSign, ShoppingCart, AlertCircle, TrendingUp, BrainCircuit, Search, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get("/api/admin/analytics");
        setData(res.data);
      } catch (err) {
        console.error("Analytics fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const handleAiSearch = async () => {
    if (!aiQuery) return;
    setAiLoading(true);
    setAiResponse("");

    try {
      const res = await axios.post("/api/ai/chat", {
        prompt: `ADMIN QUERY: ${aiQuery}. 
        CONTEXT: Total Revenue is ₹${data.totalRevenue}, Total Orders: ${data.totalOrders}, Low Stock: ${data.lowStockCount}.
        Respond as an AI business analyst focus on data-driven insights.`,
        history: []
      });
      setAiResponse(res.data.content);
    } catch (error) {
      setAiResponse("Failed to analyze data.");
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading Analytics...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
            <div>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Operations Hub</h1>
                <p className="text-gray-500 font-medium">Monitoring ShopMind performance in real-time</p>
            </div>
            <div className="flex gap-4">
                <Button variant="outline" className="rounded-xl">Export Report</Button>
                <Button className="bg-purple-600 hover:bg-purple-700 rounded-xl px-6">Live View</Button>
            </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatsCard
            title="Total Revenue"
            value={`₹${data.totalRevenue.toLocaleString()}`}
            icon={<DollarSign className="w-5 h-5 text-gray-900" />}
            description="vs last month"
            trend={{ value: 12, isUp: true }}
          />
          <StatsCard
            title="Total Orders"
            value={data.totalOrders}
            icon={<ShoppingCart className="w-5 h-5 text-gray-900" />}
            description="completed shipments"
            trend={{ value: 8.2, isUp: true }}
          />
          <StatsCard
            title="Low Stock"
            value={data.lowStockCount}
            icon={<AlertCircle className="w-5 h-5 text-gray-900" />}
            description="requires attention"
            trend={{ value: 3, isUp: false }}
          />
          <StatsCard
            title="Conv. Rate"
            value={`${data.conversionRate}%`}
            icon={<TrendingUp className="w-5 h-5 text-gray-900" />}
            description="stable"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Sales Chart (Mock) */}
            <div className="lg:col-span-2">
                <Card className="h-full border-none shadow-sm rounded-3xl overflow-hidden">
                    <CardHeader className="p-8 pb-0">
                        <CardTitle className="text-xl font-bold">Revenue Trends</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[400px] p-8 flex items-end justify-between gap-2">
                        {/* Mock bar chart */}
                        {[40, 60, 45, 90, 65, 80, 55, 75, 50, 85].map((h, i) => (
                            <div key={i} className="flex-1 group relative">
                                <div 
                                    className="bg-purple-100 group-hover:bg-purple-600 transition-all rounded-t-lg" 
                                    style={{ height: `${h}%` }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        ₹{(h * 1000).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* AI Insights Panel */}
            <div className="lg:col-span-1">
                <Card className="h-full border-none shadow-xl rounded-3xl bg-slate-900 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <BrainCircuit className="w-32 h-32" />
                    </div>
                    <CardHeader className="p-8">
                        <div className="p-3 bg-purple-600 rounded-2xl w-fit mb-4">
                            <BrainCircuit className="w-6 h-6" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Ask ShopMind AI</CardTitle>
                        <p className="text-gray-400 text-sm">Real-time business analytics using Gemini AI</p>
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
                        <div className="relative mb-6">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Analyze sales for last 7 days..."
                                className="bg-white/10 border-white/10 text-white pl-10 h-12 rounded-xl focus:ring-purple-500"
                                value={aiQuery}
                                onChange={(e) => setAiQuery(e.target.value)}
                                onKeyUp={(e) => e.key === "Enter" && handleAiSearch()}
                            />
                            <Button size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 bg-purple-600 h-10 w-10 rounded-lg" onClick={handleAiSearch}>
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>

                        {aiLoading && <div className="text-sm text-gray-400 animate-pulse italic">Thinking...</div>}
                        
                        {aiResponse && (
                            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl animate-in fade-in slide-in-from-bottom-2">
                                <p className="text-sm text-gray-300 leading-relaxed font-medium">
                                    {aiResponse}
                                </p>
                            </div>
                        )}
                        
                        {!aiResponse && !aiLoading && (
                            <div className="space-y-3">
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Suggested Queries</p>
                                <button className="block text-sm text-gray-400 hover:text-white transition-colors" onClick={() => setAiQuery("What is our best category?")}>"What is our best category?"</button>
                                <button className="block text-sm text-gray-400 hover:text-white transition-colors" onClick={() => setAiQuery("How is stock management looking?")}>"How is stock management looking?"</button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </div>
  );
}
