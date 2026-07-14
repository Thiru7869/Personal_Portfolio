"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@shared/types";
import { site } from "@/config/site";

/**
 * src/lib/use-chat.ts
 * ------------------------------------------------------------
 * Shared streaming chat hook — powers both the floating
 * assistant and the fullscreen AI Workspace mode. Consumes the
 * plain-text stream from /api/chat, appending deltas to the
 * last assistant message as they arrive. Handles 429/503/502
 * with honest, friendly fallbacks.
 */

export function useChat(greeting: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: greeting },
  ]);
  const [busy, setBusy] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const send = useCallback(
    async (text: string) => {
      const question = text.trim();
      if (!question || busy) return;

      const nextMessages: ChatMessage[] = [
        ...messages,
        { role: "user", content: question },
      ];
      setMessages(nextMessages);
      setBusy(true);

      const fail = (content: string) => {
        setMessages((prev) => [...prev, { role: "assistant", content }]);
      };

      try {
        const controller = new AbortController();
        abortRef.current = controller;

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // The greeting is UI-only; send real turns.
          body: JSON.stringify({ messages: nextMessages.slice(1) }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          fail(
            data?.error ??
              (res.status === 429
                ? "You're quick! I'm rate-limited for a moment — try again in a minute."
                : res.status === 503
                  ? `My AI providers aren't configured in this deployment yet. The human version of me answers at **${site.email}**.`
                  : "I hit a snag reaching my brain. Try once more, or use the contact form — the human never errors out.")
          );
          return;
        }

        const reader = res.body?.getReader();
        if (!reader) {
          fail("The stream didn't open — mind trying again?");
          return;
        }

        setStreaming(true);
        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
        const decoder = new TextDecoder();
        let received = false;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const delta = decoder.decode(value, { stream: true });
          if (!delta) continue;
          received = true;
          setMessages((prev) => {
            const next = [...prev];
            const lastMsg = next[next.length - 1];
            next[next.length - 1] = {
              ...lastMsg,
              content: lastMsg.content + delta,
            };
            return next;
          });
        }

        if (!received) {
          setMessages((prev) => {
            const next = [...prev];
            next[next.length - 1] = {
              role: "assistant",
              content:
                "That came back empty — the providers may be busy. Try once more?",
            };
            return next;
          });
        }
      } catch (err) {
        if ((err as Error)?.name !== "AbortError") {
          fail("Network hiccup — my reply got lost in transit. Mind trying again?");
        }
      } finally {
        setBusy(false);
        setStreaming(false);
        abortRef.current = null;
      }
    },
    [busy, messages]
  );

  return { messages, send, busy, streaming };
}
