// Page order. `inTabBar` picks the four shown in the phone navigation.
export const sections = [
  { id: "top", label: "Margam", inTabBar: false },
  { id: "invitation", label: "Invite", inTabBar: true },
  { id: "story", label: "Her Story", inTabBar: false },
  { id: "programme", label: "Programme", inTabBar: true },
  { id: "gallery", label: "Gallery", inTabBar: false },
  { id: "wishes", label: "Wishes", inTabBar: true },
  { id: "lyrics", label: "Lyrics", inTabBar: true },
  { id: "gratitude", label: "Gratitude", inTabBar: false },
] as const;

export type SectionId = (typeof sections)[number]["id"];
