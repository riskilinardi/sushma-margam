export type Teacher = {
  name: string;
  // A profile or social page; the name becomes a link once this is set.
  link?: string;
};

export const guru: Teacher = { name: "Sri Neewin Hershall" };

export const formerTeachers: Teacher[] = [
  { name: "M. Dhana Bharathi" },
  { name: "Malini Bhaskar" },
];
