import type { Metadata, Viewport } from "next";
import { Cinzel, EB_Garamond } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { event } from "@/content/event";
import { formatDate, formatTime } from "@/lib/date";
import { siteUrl } from "@/lib/site";
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

const title = `${event.title} · ${event.dancer}`;
const description = `A Bharatanatyam Margam by ${event.dancer}. ${formatDate(event.startsAt)}, ${formatTime(event.startsAt)} at ${event.venue.host}, Singapore.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: { title, description, type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#1a0507",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${cinzel.variable} ${garamond.variable}`}>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
