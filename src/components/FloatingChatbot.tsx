"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Message = {
  role: "bot" | "user";
  content: string;
};

export function FloatingChatbot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Halo! Saya AI assistant Anda. Ada topik atau minat khusus yang ingin Anda pelajari hari ini?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, loading]);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/recommend/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", content: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "bot", content: "Maaf, sistem sedang sibuk." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen ? (
        <div className="w-[350px] max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden mb-4 animate-fade-in-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-white/90" />
              <h3 className="font-bold text-sm">AI Recommend</h3>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white/80 hover:bg-white/20 hover:text-white" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Chat Area */}
          <div className="h-[350px] overflow-y-auto p-4 flex flex-col gap-3 bg-slate-50" ref={scrollAreaRef}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 max-w-[85%] ${msg.role === "user" ? "self-end flex-row-reverse" : "self-start"}`}>
                <div className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center shadow-sm ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-white text-indigo-600 border border-slate-200"}`}>
                  {msg.role === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                </div>
                <div className={`p-3 rounded-2xl text-[13px] leading-relaxed shadow-sm ${msg.role === "user" ? "bg-blue-600 text-white rounded-tr-sm" : "bg-white text-slate-700 border border-slate-100 rounded-tl-sm"}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2 self-start">
                <div className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center shadow-sm bg-white text-indigo-600 border border-slate-200">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="p-3 bg-white border border-slate-100 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin text-slate-400" />
                  <span className="text-xs text-slate-400">Mengetik...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Saya suka tentang..."
              className="flex-1 border-slate-200 bg-slate-50 focus-visible:ring-blue-500 rounded-xl"
            />
            <Button size="icon" onClick={handleSend} disabled={!input.trim() || loading} className="shrink-0 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-md transition-all">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-xl shadow-blue-500/30 hover:scale-105 transition-all animate-bounce"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      )}
    </div>
  );
}
