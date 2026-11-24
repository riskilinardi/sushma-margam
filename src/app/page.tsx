import { Book, type BookPage } from "@/components/book/Book";
import { CoverPage } from "@/components/book/pages/CoverPage";
import { GalleryPage } from "@/components/book/pages/GalleryPage";
import { ItemPage } from "@/components/book/pages/ItemPage";
import { LyricsPage } from "@/components/book/pages/LyricsPage";
import { Petals } from "@/components/book/pages/Petals";
import { ProgrammePage } from "@/components/book/pages/ProgrammePage";
import { StoryPage } from "@/components/book/pages/StoryPage";
import { TeachersPage } from "@/components/book/pages/TeachersPage";
import { ThanksPage } from "@/components/book/pages/ThanksPage";
import { WishesPage } from "@/components/book/pages/WishesPage";
import { programme } from "@/content/programme";

const pages: BookPage[] = [
  { name: "Cover", content: <CoverPage />, fill: true },
  { name: "Wishes", content: <WishesPage />, fill: true },
  { name: "Her Story", content: <StoryPage /> },
  { name: "Her Teachers", content: <TeachersPage /> },
  { name: "Programme", content: <ProgrammePage /> },
  ...programme.map((item, index) => ({
    name: item.name,
    content: <ItemPage item={item} number={index + 1} />,
    fill: true,
    dark: true,
    under: "Programme",
  })),
  { name: "Gallery", content: <GalleryPage />, fill: true },
  { name: "Lyrics", content: <LyricsPage />, fill: true },
  { name: "Thank You", content: <ThanksPage />, over: <Petals /> },
];

export default function Home() {
  return (
    <Book
      pages={pages}
      moments={{
        "Cover>Wishes": "ring",
        "Wishes>Her Story": "her",
        "*>Lyrics": "fan",
      }}
    />
  );
}
