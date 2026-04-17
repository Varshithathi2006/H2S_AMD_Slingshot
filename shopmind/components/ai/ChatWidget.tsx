"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useTranslations } from "next-intl";
import { Mic, Send, BrainCircuit, X, Loader2, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import MessageBubble from "./MessageBubble";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "model";
  content: string;
}

export default function ChatWidget({ fullScreen = false }: { fullScreen?: boolean }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("chat");

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("shopmind_chat_history");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem("shopmind_chat_history", JSON.stringify(messages));
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("/api/ai/chat", {
        prompt: text,
        history: messages.map(m => ({
            role: m.role,
            parts: [{ text: m.content }]
        })),
      });

      const aiMsg: Message = { role: "model", content: res.data.content };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat error", error);
      setMessages((prev) => [...prev, { role: "model", content: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setLoading(false);
    }
  };

  const toggleVoice = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Voice recognition not supported in this browser.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US"; // Standardize for now, could be dynamic

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      sendMessage(text);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  return (
    <div className={cn(
      "flex flex-col bg-white overflow-hidden",
      fullScreen ? "h-[calc(100vh-64px)] w-full" : "h-[600px] w-[400px] rounded-3xl shadow-2xl border border-gray-100"
    )}>
      {/* Header */}
      <div className="bg-slate-900 border-b p-5 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-600 rounded-xl">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight">{t("title")}</h3>
            <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] uppercase font-bold text-gray-400">Agentic Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => { localStorage.removeItem("shopmind_chat_history"); setMessages([]); }}>
                <X className="w-5 h-5" />
            </Button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 bg-gray-50 no-scrollbar">
        {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <BrainCircuit className="w-10 h-10 text-purple-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900">How can I help you shop today?</h4>
                <div className="grid grid-cols-1 gap-2 w-full max-w-xs">
                    <Button variant="outline" className="rounded-xl border-gray-200 text-gray-600 text-sm hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700" onClick={() => sendMessage("What are your best electronics?")}>
                        "Best electronics under ₹50k"
                    </Button>
                    <Button variant="outline" className="rounded-xl border-gray-200 text-gray-600 text-sm hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700" onClick={() => sendMessage("Find me running shoes")}>
                        "Looking for running shoes"
                    </Button>
                    <Button variant="outline" className="rounded-xl border-gray-200 text-gray-600 text-sm hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700" onClick={() => sendMessage("Do you have any coupons?")}>
                        "Any active coupons?"
                    </Button>
                </div>
            </div>
        )}
        {messages.map((m, i) => (
          <MessageBubble key={i} message={m} />
        ))}
        {loading && (
          <div className="flex gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 flex items-center justify-center shadow-sm">
                <BrainCircuit className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div className="bg-white rounded-3xl rounded-tl-none px-6 py-4 shadow-sm border border-gray-100 flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
                <span className="text-sm text-gray-400 font-medium italic">Agent is thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 bg-white border-t">
        <div className="relative flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn("rounded-full flex-shrink-0 transition-all", isListening ? "bg-red-50 text-red-600 animate-pulse scale-110" : "bg-gray-100 hover:bg-purple-100 text-gray-500 hover:text-purple-600")}
            onClick={toggleVoice}
          >
            <Mic className="w-5 h-5" />
          </Button>
          <input
            className="flex-1 bg-gray-100 border-none rounded-2xl px-6 py-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
            placeholder={isListening ? "Listening..." : t("placeholder")}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyUp={(e) => e.key === "Enter" && sendMessage(input)}
          />
          <Button 
            className="rounded-full w-12 h-12 bg-slate-900 hover:bg-purple-600 transition-all shadow-lg"
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            <Volume2 className="w-3 h-3" /> Powered by ShopMind AI Engine
        </div>
      </div>
    </div>
  );
}
