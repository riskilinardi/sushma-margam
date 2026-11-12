import type { Metadata } from "next";
import { Gratitude } from "@/components/gratitude/Gratitude";
import { Hero } from "@/components/hero/Hero";
import { Invitation } from "@/components/invitation/Invitation";
import { Lyrics } from "@/components/lyrics/Lyrics";
import { Programme } from "@/components/programme/Programme";
import { Wishes } from "@/components/wishes/Wishes";
import { TransitionsDemo } from "./TransitionsDemo";

export const metadata: Metadata = {
  title: "Page transitions · demo",
  robots: { index: false },
};

export default function DemoPage() {
  return (
    <TransitionsDemo
      pages={[
        { name: "Cover", content: <Hero /> },
        { name: "The Evening", content: <Invitation /> },
        { name: "Programme", content: <Programme /> },
        { name: "Wishes", content: <Wishes /> },
        { name: "Lyrics", content: <Lyrics /> },
        { name: "Thank You", content: <Gratitude /> },
      ]}
    />
  );
}
