"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, Sparkles, TerminalSquare, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { suggestedQuestions } from "@/content/ai-knowledge";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";
import { useChat } from "@/lib/use-chat";
import { trackEvent } from "@/lib/analytics";

const GREETING = `[*] \`thiru-assistant\` online. I know ${site.shortName}'s projects, research, experience, and availability inside out — ask me anything about his work, or how to hire him.`;

/**
 * AiAssistant — the floating chat bubble (bottom right).
 * Streaming markdown answers via the shared useChat hook;
 * the fullscreen version lives in AI Workspace mode.
 */
export function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [openedOnce, setOpenedOnce] = useState(false);
  const { messages, send, busy, streaming } = useChat(GREETING);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, busy, open]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    if (!openedOnce) {
      setOpenedOnce(true);
      trackEvent({ type: "chat_opened" });
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, openedOnce]);

  useEffect(() => {
    function onOpen() {
      setOpen(true);
    }
    window.addEventListener("open-ai-assistant", onOpen);
    return () => window.removeEventListener("open-ai-assistant", onOpen);
  }, []);

  function submit(text: string) {
    setInput("");
    void send(text);
  }

  return (
    <>
      {/* Launcher bubble */}
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        aria-label={open ? "Close Thiru Assistant" : "Open Thiru Assistant"}
        className="exec-hide fixed bottom-6 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-2xl border border-brand/40 bg-card text-brand shadow-glow sm:right-6"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "close" : "open"}
            initial={{ opacity: 0, rotate: -40 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 40 }}
            transition={{ duration: 0.15 }}
          >
            {open ? <X size={22} aria-hidden="true" /> : <Bot size={24} aria-hidden="true" />}
          </motion.span>
        </AnimatePresence>
        {!open && (
          <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3" aria-hidden="true">
            <span className="absolute h-full w-full animate-ping rounded-full bg-brand2 opacity-60" />
            <span className="relative h-3 w-3 rounded-full bg-brand2" />
          </span>
        )}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Thiru Assistant chat"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="fixed bottom-24 right-4 z-50 flex h-[540px] max-h-[calc(100dvh-8rem)] w-[calc(100vw-2rem)] max-w-md flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-card sm:right-6"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-line/60 bg-surface/80 px-4 py-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/15 text-brand">
                <TerminalSquare size={17} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">Thiru Assistant</p>
                <p className="flex items-center gap-1.5 text-[11px] text-mute">
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      streaming ? "animate-pulse bg-brand" : "bg-brand2"
                    )}
                    aria-hidden="true"
                  />
                  {streaming ? "streaming live" : "grounded in the real portfolio"}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-4 overflow-y-auto p-4"
              aria-live="polite"
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "max-w-[88%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "ml-auto rounded-br-md bg-brand text-bg"
                      : "rounded-bl-md border border-line/60 bg-surface/80"
                  )}
                >
                  {msg.role === "assistant" ? (
                    <div className="chat-markdown">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content ||
                          (streaming && i === messages.length - 1 ? "…" : msg.content)}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              ))}

              {busy && !streaming && (
                <div
                  className="flex w-fit items-center gap-1.5 rounded-2xl rounded-bl-md border border-line/60 bg-surface/80 px-4 py-3"
                  aria-label="Assistant is thinking"
                >
                  {[0, 1, 2].map((d) => (
                    <motion.span
                      key={d}
                      className="h-1.5 w-1.5 rounded-full bg-brand"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1, delay: d * 0.18 }}
                    />
                  ))}
                </div>
              )}

              {/* Suggested questions (fresh conversations only) */}
              {messages.length <= 2 && !busy && (
                <div className="space-y-1.5 pt-1">
                  <p className="flex items-center gap-1 text-[11px] text-mute">
                    <Sparkles size={11} aria-hidden="true" /> good starting points
                  </p>
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => submit(q)}
                      className="block w-full rounded-xl border border-line/60 bg-surface/50 px-3 py-2 text-left text-xs text-mute transition-colors hover:border-brand/50 hover:text-brand"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit(input);
              }}
              className="flex items-center gap-2 border-t border-line/60 bg-surface/60 p-3"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={800}
                placeholder="Ask about projects, research, hiring…"
                aria-label="Message Thiru Assistant"
                className="flex-1 rounded-xl border border-line bg-card px-3.5 py-2.5 text-sm text-ink placeholder:text-mute/60 focus:border-brand/60 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || busy}
                aria-label="Send message"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-bg transition-all hover:brightness-110 disabled:opacity-40"
              >
                <Send size={16} aria-hidden="true" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
