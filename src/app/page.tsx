import { Hero } from "@/components/hero/Hero";
import { IntroGate } from "@/components/intro/IntroGate";

export default function Home() {
  return (
    <IntroGate>
      <main>
        <Hero />
      </main>
    </IntroGate>
  );
}
