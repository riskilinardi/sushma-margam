import type { ReactNode } from "react";

// The filled points: eyes, a flute's holes, the ends of a drum's cord.
function Dot({ x, y, r }: { x: number; y: number; r: number }) {
  return <circle cx={x} cy={y} r={r} fill="currentColor" stroke="none" />;
}

// A small gold mark for each piece, drawn in the same fine line as the page
// ornaments. A settling page draws its lines in like ink (see book.css).
const emblems = {
  // Pushpanjali: a lotus, the flower offered.
  lotus: (
    <>
      <path d="M24 9C29.5 15 29.5 25 24 32 18.5 25 18.5 15 24 9Z" />
      <path d="M24 32C17.5 30.5 13 24.5 13 16.5 19 18.5 23 24 24 32Z" />
      <path d="M24 32C30.5 30.5 35 24.5 35 16.5 29 18.5 25 24 24 32Z" />
      <path d="M24 32C16.5 33.5 9.5 30 6 23.5 13.5 22.5 20 26 24 32Z" />
      <path d="M24 32C31.5 33.5 38.5 30 42 23.5 34.5 22.5 28 26 24 32Z" />
      <path d="M12 37.5C18 35.5 30 35.5 36 37.5" />
      <path d="M17 41.5H31" />
    </>
  ),
  // Ganesha Shlokam: his face, the trunk curling to one side.
  ganesha: (
    <>
      <path d="M19.5 12.5C19.5 9 21.5 6.5 24 5 26.5 6.5 28.5 9 28.5 12.5" />
      <path d="M18 12.5H30" />
      <Dot x={24} y={3.2} r={0.8} />
      <path d="M19 13C17.5 19 18.5 24 21.5 26.5" />
      <path d="M29 13C30.5 19 29.5 24 26.5 26.5" />
      <path d="M18.5 15C11 11.5 5 16 6.5 23 8 29 14 29.5 19.5 25" />
      <path d="M29.5 15C37 11.5 43 16 41.5 23 40 29 34 29.5 28.5 25" />
      <path d="M24 17.5C24 25 24.5 31 28 35 31 38.5 31 42.5 27.5 42.5 25.5 42.5 24.8 40.6 26 39.6" />
      <path d="M21.5 26.5C20.5 29 19 30 17 30" />
      <Dot x={21} y={19} r={0.9} />
      <Dot x={27} y={19} r={0.9} />
    </>
  ),
  // Jathiswaram: a coil of ankle bells, the ghungroo, keeping the rhythm.
  bells: (
    <>
      {Array.from({ length: 11 }, (_, i) => {
        const a = ((i + 0.5) / 12) * Math.PI * 2 + Math.PI / 2;
        const x = 24 + Math.cos(a) * 12;
        const y = 21 + Math.sin(a) * 12;
        return (
          <g key={i}>
            <circle cx={x.toFixed(2)} cy={y.toFixed(2)} r="2.7" />
            <Dot x={Number(x.toFixed(2))} y={Number(y.toFixed(2))} r={0.7} />
          </g>
        );
      })}
      <path d="M22.5 33C21.5 37 20 40 17.5 43" />
      <path d="M25.5 33C26.5 37 28 40 30.5 43" />
      <Dot x={17.2} y={43.6} r={1} />
      <Dot x={30.8} y={43.6} r={1} />
    </>
  ),
  // Kannanai Paadu Maname: a peacock feather, as Krishna wears.
  feather: (
    <>
      <path d="M24 5C31 9.5 32 20 24 25 16 20 17 9.5 24 5Z" />
      <path d="M24 10.5C27.5 13 27.5 18.5 24 21 20.5 18.5 20.5 13 24 10.5Z" />
      <Dot x={24} y={16.5} r={1.4} />
      <path d="M24 25C24 32 23 37.5 19.5 43.5" />
      <path d="M23.9 28.5 18 25.5M23.6 32 17.5 29.5M23 35.5 17 33.5" />
      <path d="M24 28.5 30 25.5M23.8 32 29.5 29.5M23.2 35.5 28.5 33.5" />
    </>
  ),
  // Unnai Ninaindhu: Krishna's flute, the sound she longs for.
  flute: (
    <>
      <path d="M8.2 37.3 37.3 8.2C38.5 7 40.4 7 41.4 8.2 42.6 9.4 42.6 11.2 41.4 12.4L12.4 41.4C11.2 42.6 9.4 42.6 8.2 41.4 7 40.2 7 38.5 8.2 37.3Z" />
      <path d="M33.5 12 37.6 16.1" />
      <path d="M13.2 32.3 17.3 36.4" />
      {[17, 20.5, 24, 27.5, 31].map((at) => (
        <Dot key={at} x={at + 0.6} y={46.4 - at - 0.6} r={0.8} />
      ))}
      <path d="M15.2 34.4C13 38 13.5 41 15.5 44" />
      <path d="M15.2 34.4C17.5 37.5 19.5 39.5 22.5 40.5" />
    </>
  ),
  // Nagendra Haraya: the serpent Shiva wears as a garland, hood raised.
  serpent: (
    <>
      <path d="M24 4.5C26.4 4.5 27.4 6.5 27.2 8.8 33 10 35.5 14 33.2 18.2 31 22.2 27.2 24.6 25.4 29H22.6C20.8 24.6 17 22.2 14.8 18.2 12.5 14 15 10 20.8 8.8 20.6 6.5 21.6 4.5 24 4.5Z" />
      <path d="M20.5 14C21.5 15.5 22.8 16 24 16 25.2 16 26.5 15.5 27.5 14" />
      <path d="M24 16V24" />
      <Dot x={22.8} y={7.4} r={0.65} />
      <Dot x={25.2} y={7.4} r={0.65} />
      <path d="M22.4 29C21 33.5 24 35.5 29.5 35.5 36 35.5 39 38 36.5 40.8 34 43.5 16.5 44 11.8 41.2 8.8 39.2 10.2 35.8 14.8 35.6" />
      <path d="M25.6 29C26.2 31 27.5 32 29.5 32.3" />
    </>
  ),
  // Bala Gopala: Krishna's discus, the protector's weapon.
  discus: (
    <>
      <circle cx="24" cy="24" r="12" />
      <circle cx="24" cy="24" r="3.5" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        const [c, s] = [Math.cos(a), Math.sin(a)];
        return (
          <path
            key={`s${i}`}
            d={`M${(24 + c * 3.5).toFixed(2)} ${(24 + s * 3.5).toFixed(2)}L${(24 + c * 12).toFixed(2)} ${(24 + s * 12).toFixed(2)}`}
          />
        );
      })}
      {Array.from({ length: 16 }, (_, i) => {
        const a = ((i + 0.5) / 16) * Math.PI * 2;
        const b = a + (Math.PI * 2) / 32;
        const p = (r: number, angle: number) =>
          `${(24 + Math.cos(angle) * r).toFixed(2)} ${(24 + Math.sin(angle) * r).toFixed(2)}`;
        return (
          <path
            key={`f${i}`}
            d={`M${p(12, a - 0.12)}Q${p(17, a)} ${p(19, b)}Q${p(15.5, b)} ${p(12, a + 0.25)}`}
          />
        );
      })}
    </>
  ),
  // Bho Shambho: Shiva's trident with his drum, the damaru, tied to it.
  trident: (
    <>
      <path d="M24 5V44" />
      <path d="M24 5 21.8 9M24 5 26.2 9" />
      <path d="M24 19C18 19 14.5 15 14.5 8.5 16 11.5 18 13 20 13" />
      <path d="M24 19C30 19 33.5 15 33.5 8.5 32 11.5 30 13 28 13" />
      <path d="M17 23.5H31L26 28.5 31 33.5H17L22 28.5Z" />
      <path d="M31 28.5C34 28.5 36 30.5 36.5 33M17 28.5C14 28.5 12 26.5 11.5 24" />
      <Dot x={36.8} y={34.3} r={0.9} />
      <Dot x={11.2} y={22.7} r={0.9} />
    </>
  ),
  // Thillana: Rama's bow and arrow.
  bow: (
    <>
      <path d="M13.5 6.5C29 12 35 30 30.5 42.5" />
      <path d="M13.5 6.5 30.5 42.5" />
      <path d="M8.5 31 39 15.5" />
      <path d="M34.8 15 39 15.5 36.7 19" />
      <path d="M8.5 31 6.5 28.5M8.5 31 7.5 34M11.3 29.6 9.3 27.1M11.3 29.6 10.3 32.6" />
    </>
  ),
  // Mangalam: a small oil lamp, for the closing aarti.
  diya: (
    <>
      <path d="M7 27H33C32.5 33 28 36.5 20.5 36.5 13 36.5 7.5 33 7 27Z" />
      <path d="M33 27C36 27 39 25.5 41.5 23 39.5 28.5 36.5 30.5 32.2 31.2" />
      <path d="M40 21.5C43 18 43 14.5 40 9.5 37 14.5 37 18 40 21.5Z" />
      <path d="M40 19C41.3 17.5 41.3 16 40 14 38.7 16 38.7 17.5 40 19Z" />
      <path d="M13 40.5H28" />
    </>
  ),
} satisfies Record<string, ReactNode>;

export type EmblemName = keyof typeof emblems;

export function Emblem({
  name,
  className = "",
}: {
  name: EmblemName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      className={`emblem ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {emblems[name]}
    </svg>
  );
}
