import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * /admin layout — deliberately outside the (site) group: no
 * navbar, footer, assistant, or popups. Never indexed.
 */
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <main className="min-h-screen">{children}</main>;
}
