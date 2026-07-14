"use client";

import { useEffect, useRef } from "react";

/**
 * src/lib/use-focus-trap.ts
 * ------------------------------------------------------------
 * WCAG-compliant dialog focus management, shared by every modal:
 *   - moves focus into the dialog on open
 *   - traps Tab / Shift+Tab within it (background is unreachable)
 *   - closes on Escape
 *   - restores focus to the previously-focused element on close
 *   - locks body scroll while open
 *
 * Attach the returned ref to the dialog container and pass an
 * `onClose` handler. Pass `active` to gate it (e.g. modal open
 * state). Returns the container ref.
 */
export function useFocusTrap<T extends HTMLElement>(
  active: boolean,
  onClose: () => void
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!active) return;
    const node = ref.current;
    if (!node) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const selector =
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

    // Elements the browser reports as hidden are skipped; everything
    // else (including elements jsdom can't lay out) counts. `hidden`
    // and aria-hidden cover the realistic "invisible in dialog" cases.
    const focusables = () =>
      Array.from(node.querySelectorAll<HTMLElement>(selector)).filter(
        (el) => !el.hasAttribute("hidden") && el.getAttribute("aria-hidden") !== "true"
      );

    // Move focus in — first focusable, else the container itself.
    const first = focusables()[0];
    if (first) {
      first.focus();
    } else {
      node.setAttribute("tabindex", "-1");
      node.focus();
    }

    // Arrow (not a hoisted declaration) so TS keeps `node` narrowed.
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const items = focusables();
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      const activeEl = document.activeElement;

      if (e.shiftKey && activeEl === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && activeEl === lastEl) {
        e.preventDefault();
        firstEl.focus();
      } else if (activeEl && !node.contains(activeEl)) {
        // Focus escaped (e.g. programmatic) — pull it back in.
        e.preventDefault();
        firstEl.focus();
      }
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.body.style.overflow = prevOverflow;
      // Restore focus to where the user was before the dialog opened.
      previouslyFocused?.focus?.();
    };
  }, [active, onClose]);

  return ref;
}
