import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, Send } from "lucide-react";
import { answerPortfolioQuestion } from "../lib/portfolioKnowledge";
import { INITIAL_PROFILE } from "../types";

interface PortfolioChatProps {
  accentTextClass?: string;
  btnClass?: string;
}

interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
}

const WELCOME: ChatMessage = {
  id: "welcome",
  role: "assistant",
  text: `Hi! I can answer questions about ${INITIAL_PROFILE.name}'s portfolio only — skills, projects, experience, and contact details. What would you like to know?`,
};

const QUICK_PROMPTS = [
  "What's your best AI project?",
  "Tell me about your backend experience",
  "Are you open to work?",
  "How can I contact you?",
];

export default function PortfolioChat({
  accentTextClass = "text-sky-400",
  btnClass = "bg-sky-500/90 text-slate-950 hover:bg-sky-400",
}: PortfolioChatProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [typing, setTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, typing, open]);

  const submitText = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    let reply = answerPortfolioQuestion(trimmed);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      if (res.ok) {
        const data = (await res.json()) as { reply?: string };
        if (data.reply?.trim()) reply = data.reply.trim();
      }
    } catch {
      /* use local portfolio knowledge */
    }

    setMessages((prev) => [
      ...prev,
      { id: `a-${Date.now()}`, role: "assistant", text: reply },
    ]);
    setTyping(false);
  }, [typing]);

  const sendMessage = () => submitText(input);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: "spring", damping: 24, stiffness: 320 }}
            className="fixed bottom-24 left-6 z-[55] w-[min(100vw-3rem,380px)] glass-panel border border-app rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-app-soft bg-app-surface/80">
              <div className="flex items-center gap-2">
                <MessageCircle className={`w-4 h-4 ${accentTextClass}`} />
                <span className="text-xs font-mono font-bold text-app-heading uppercase tracking-wider">
                  Portfolio Chat
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-app-surface-hover text-app-muted hover:text-app-heading transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div
              ref={listRef}
              className="flex-1 min-h-[280px] max-h-[min(420px,50vh)] overflow-y-auto p-3 space-y-2 bg-app-elevated/50"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`text-[11px] font-mono leading-relaxed px-3 py-2 rounded-xl max-w-[95%] whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "ml-auto bg-app-surface-hover text-app-heading border border-app"
                      : "mr-auto bg-app-input text-app-secondary border border-app-soft"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              {typing && (
                <div className="text-[10px] font-mono text-app-subtle px-3 py-1">
                  Typing…
                </div>
              )}
            </div>

            <div className="px-3 pt-2 pb-1 border-t border-app-soft bg-app-card flex flex-wrap gap-1.5">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  disabled={typing}
                  onClick={() => submitText(prompt)}
                  className={`text-[9px] font-mono px-2 py-1 rounded-lg border border-app-soft text-app-muted hover:text-app-heading hover:border-app transition-colors disabled:opacity-40`}
                >
                  {prompt}
                </button>
              ))}
            </div>

            <form
              className="p-3 border-t border-app-soft flex gap-2 bg-app-card"
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about skills, projects, contact…"
                maxLength={400}
                className="flex-1 bg-app-input border border-app rounded-xl px-3 py-2 text-[11px] text-app-heading placeholder:text-app-subtle font-mono focus:outline-none focus:border-sky-500/50"
              />
              <button
                type="submit"
                disabled={typing || !input.trim()}
                className={`p-2.5 rounded-xl ${btnClass} disabled:opacity-40 transition-opacity shrink-0`}
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        className={`fixed bottom-6 left-6 z-[56] w-14 h-14 rounded-full ${btnClass} shadow-xl flex items-center justify-center border border-white/10`}
        aria-label={open ? "Close portfolio chat" : "Open portfolio chat"}
        title="Ask about my portfolio"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>
    </>
  );
}
