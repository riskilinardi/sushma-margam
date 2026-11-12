import { Gallery } from "@/components/gallery/Gallery";
import { Gratitude } from "@/components/gratitude/Gratitude";
import { Hero } from "@/components/hero/Hero";
import { IntroGate } from "@/components/intro/IntroGate";
import { Invitation } from "@/components/invitation/Invitation";
import { Lyrics } from "@/components/lyrics/Lyrics";
import { SiteNav } from "@/components/nav/SiteNav";
import { Programme } from "@/components/programme/Programme";
import { Story } from "@/components/story/Story";
import { Wishes } from "@/components/wishes/Wishes";

export default function Home() {
  return (
    <IntroGate>
      <SiteNav />
      <main>
        <Hero />
        <Invitation />
        <Story />
        <Programme />
        <Gallery />
        <Wishes />
        <Lyrics />
        <Gratitude />
      </main>
    </IntroGate>
  );
}
