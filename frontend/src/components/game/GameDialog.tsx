"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Gamepad2, X } from "lucide-react";
import { useFocusTrap } from "@/lib/use-focus-trap";
import { Game2048 } from "@/components/game/Game2048";

/**
 * GameDialog — the site-wide home for 2048. Opens on the
 * `open-game` event (command palette, footer, terminal command
 * outside desktop mode). Focus-trapped; Esc or backdrop closes.
 * In Terminal mode the game gets a real desktop window instead.
 */
export function GameDialog() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const dialogRef = useFocusTrap<HTMLDivElement>(open, close);

  useEffect(() => {
    function onOpen() {
      setOpen(true);
    }
    window.addEventListener("open-game", onOpen);
    return () => window.removeEventListener("open-game", onOpen);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[85] flex items-center justify-center bg-black/70 p-4"
          onClick={close}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="2048 — byte edition"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
            onClick={(e) => e.stopPropagation()}
            className="card-shell w-full max-w-md p-5 sm:p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-brand">
                <Gamepad2 size={14} aria-hidden="true" />
                2048 — byte edition
              </p>
              <button
                type="button"
                onClick={close}
                aria-label="Close game"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-mute transition-colors hover:border-brand/60 hover:text-brand"
              >
                <X size={14} aria-hidden="true" />
              </button>
            </div>
            <Game2048 />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
