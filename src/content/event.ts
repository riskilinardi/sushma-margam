export const event = {
  title: "Margam",
  dancer: "Sushma Sekaran",
  presentedBy: "Nrityalaya Aesthetics Society",
  guru: "Sri Neewin Hershall",
  formerTeachers: ["Malini Bhaskar", "M. Dhanabharathi"],
  startsAt: new Date("2026-12-05T19:30:00+08:00"),
  // Estimate for calendar invites; confirm the real end time with Sushma.
  endsAt: new Date("2026-12-05T22:00:00+08:00"),
  arriveBy: "7:15 PM",
  venue: {
    name: "Black Box",
    host: "Nrityalaya Aesthetics Society",
    address: [
      "231 Bain Street",
      "#04-01 Bras Basah Complex",
      "Singapore 180231",
    ],
  },
} as const;
