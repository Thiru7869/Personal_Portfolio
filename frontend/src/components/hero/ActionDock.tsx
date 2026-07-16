"use client";

import { motion } from "framer-motion";
import {
  CalendarDays,
  Code2,
  Download,
  Github,
  Linkedin,
  Mail,
  Send,
  type LucideIcon,
} from "lucide-react";
import { site } from "@/config/site";
import { EASE_OUT } from "@/lib/motion";
import { scrollToSection } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { Magnetic } from "@/components/ui/Magnetic";

interface DockAction {
  label: string;
  icon: LucideIcon;
  href?: string;
  onClick?: () => void;
  primary?: boolean;
}

/**
 * ActionDock — the hero's glass action panel: appointment,
 * resume, contact, and profiles in one interactive strip
 * instead of a pile of buttons.
 */
export function ActionDock() {
  const actions: DockAction[] = [
    {
      label: "Book an Appointment",
      icon: CalendarDays,
      href: site.meetingUrl,
      primary: true,
    },
    {
      label: "Download Resume",
      icon: Download,
      href: site.resumeUrl,
      onClick: () => trackEvent({ type: "resume_download" }),
    },
    {
      label: "Contact",
      icon: Send,
      onClick: () => scrollToSection("contact"),
    },
    { label: "GitHub", icon: Github, href: site.github },
    {
      label: "LinkedIn",
      icon: Linkedin,
      href: "https://www.linkedin.com/in/poluru-thirumala-narasimha-23775926b/",
    },
    { label: "LeetCode", icon: Code2, href: `https://leetcode.com/u/${site.leetcodeUsername}/` },
    { label: "Email", icon: Mail, href: `mailto:${site.email}` },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.5, ease: EASE_OUT }}
      role="toolbar"
      aria-label="Quick actions"
      className="glass mx-auto flex w-fit max-w-full flex-wrap items-center justify-center gap-1 rounded-2xl border border-line/80 p-1.5 shadow-card"
    >
      {actions.map((action) => {
        const inner = (
          <>
            <action.icon size={16} aria-hidden="true" />
            <span
              className={
                action.primary
                  ? "text-xs font-semibold"
                  : "sr-only text-xs font-semibold md:not-sr-only"
              }
            >
              {action.label}
            </span>
          </>
        );
        const cls = action.primary
          ? "flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-bg transition-all duration-200 hover:shadow-glow hover:brightness-110 active:scale-[0.97]"
          : "flex items-center gap-2 rounded-xl px-3 py-2.5 text-mute transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface hover:text-brand active:scale-[0.97] active:translate-y-0";

        const element = action.href ? (
          <a
            href={action.href}
            target={action.href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            onClick={action.onClick}
            aria-label={action.label}
            className={cls}
          >
            {inner}
          </a>
        ) : (
          <button
            type="button"
            onClick={action.onClick}
            aria-label={action.label}
            className={cls}
          >
            {inner}
          </button>
        );

        return action.primary ? (
          <Magnetic key={action.label} strength={10}>
            {element}
          </Magnetic>
        ) : (
          <span key={action.label}>{element}</span>
        );
      })}
    </motion.div>
  );
}
