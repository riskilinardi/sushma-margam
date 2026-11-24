import Image from "next/image";
import type { CSSProperties } from "react";
import cutout from "@/assets/sushma-cover.webp";
import "./minimes.css";

type Spot = {
  place: CSSProperties;
  turn: number;
  flip?: boolean;
  className?: string;
};

// Sushmas hiding all over the plate, as share of its size.
const spots: Spot[] = [
  { place: { top: "3%", left: "3%", height: "12%" }, turn: -14 },
  { place: { top: "4%", right: "4%", height: "10%" }, turn: 12, flip: true },
  { place: { top: "38%", left: "-5%", height: "15%" }, turn: 24 },
  { place: { top: "24%", right: "-6%", height: "17%" }, turn: -22, flip: true },
  { place: { top: "16%", left: "27%", height: "6%" }, turn: -6 },
  { place: { top: "9%", right: "30%", height: "5%" }, turn: 10, flip: true },
  { place: { bottom: "2%", left: "3%", height: "11%" }, turn: 8 },
  { place: { bottom: "3%", right: "3%", height: "13%" }, turn: -8, flip: true },
  { place: { bottom: "1%", left: "44%", height: "8%" }, turn: 0 },
  // Behind the title, faintly.
  {
    place: { top: "46%", right: "5%", height: "17%", opacity: 0.35 },
    turn: 6,
    flip: true,
  },
  // Standing on top of the title.
  {
    place: { bottom: "calc(55% - 1.6rem)", left: "10.5rem", height: "4rem" },
    turn: 0,
    className: "lg:hidden",
  },
];

// Just for fun, and only for a while: mini Sushmas all over the last
// piece. Where's Sushma?
export function MiniMes() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {spots.map(({ place, turn, flip, className = "" }, i) => (
        <Image
          key={i}
          src={cutout}
          alt=""
          sizes="96px"
          className={`mini-me absolute w-auto max-w-none ${className}`}
          style={
            {
              ...place,
              "--turn": `${turn}deg`,
              "--flip": flip ? -1 : 1,
              "--i": i,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
