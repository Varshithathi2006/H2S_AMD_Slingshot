"use client";

import { BrainCircuit, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "model";
  content: string;
}

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300", isUser ? "flex-row-reverse" : "flex-row")}>
      <div className={cn(
        "w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm",
        isUser ? "bg-slate-900 border border-slate-800" : "bg-purple-600"
      )}>
        {isUser ? <User className="w-5 h-5 text-white" /> : <BrainCircuit className="w-5 h-5 text-white" />}
      </div>
      
      <div className={cn(
        "max-w-[80%] rounded-3xl px-6 py-4 shadow-sm",
        isUser 
          ? "bg-white border border-gray-100 rounded-tr-none text-gray-800" 
          : "bg-gradient-to-br from-purple-600 to-indigo-700 rounded-tl-none text-white font-medium"
      )}>
        <p className="whitespace-pre-wrap leading-relaxed">
          {message.content}
        </p>
      </div>
    </div>
  );
}
