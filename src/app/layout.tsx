import type { Metadata, Viewport } from "next";
import { Cinzel, EB_Garamond } from "next/font/google";
import { event } from "@/content/event";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
});

const garamond = EB_Garamond({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-garamond",
});

export const metadata: Metadata = {
  title: `${event.title} · ${event.dancer}`,
  description: `A Bharatanatyam Margam by ${event.dancer}, presented by ${event.presentedBy}, Singapore.`,
};

export const viewport: Viewport = {
  themeColor: "#1a0507",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${cinzel.variable} ${garamond.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
