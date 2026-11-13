import { Book } from "@/components/book/Book";
import { CoverPage } from "@/components/book/pages/CoverPage";
import { EveningPage } from "@/components/book/pages/EveningPage";
import { GalleryPage } from "@/components/book/pages/GalleryPage";
import { LyricsPage } from "@/components/book/pages/LyricsPage";
import { ProgrammePage } from "@/components/book/pages/ProgrammePage";
import { StoryPage } from "@/components/book/pages/StoryPage";
import { TeachersPage } from "@/components/book/pages/TeachersPage";
import { ThanksPage } from "@/components/book/pages/ThanksPage";
import { WishesPage } from "@/components/book/pages/WishesPage";

export default function Home() {
  return (
    <Book
      // "her" (Sushma's silhouette) replaces the ring once there is a
      // standing-pose photo to trace.
      moments={{ "Cover>The Evening": "ring", "Wishes>Lyrics": "fan" }}
      pages={[
        { name: "Cover", content: <CoverPage /> },
        { name: "The Evening", content: <EveningPage /> },
        { name: "Her Story", content: <StoryPage /> },
        { name: "Her Teachers", content: <TeachersPage /> },
        { name: "Programme", content: <ProgrammePage /> },
        { name: "Gallery", content: <GalleryPage /> },
        { name: "Wishes", content: <WishesPage /> },
        { name: "Lyrics", content: <LyricsPage /> },
        { name: "Thank You", content: <ThanksPage /> },
      ]}
    />
  );
}
