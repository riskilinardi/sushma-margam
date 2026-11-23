import { easeIn, easeOut, play, type RevealContext } from "./shared";

// Into or out of the pieces' black pages: the lights go down on the page
// being left, then come up on the next, as between items on a stage.
export async function dim({ incoming, layer }: RevealContext) {
  const dark = document.createElement("div");
  dark.className = "fx-fill";
  dark.style.background = "#000";
  layer.append(dark);

  incoming.style.opacity = "0";
  await play(0.5, (t) => {
    dark.style.opacity = String(easeIn(t));
  });
  incoming.style.opacity = "1";
  await play(0.6, (t) => {
    dark.style.opacity = String(1 - easeOut(t));
  });
  dark.remove();
}
