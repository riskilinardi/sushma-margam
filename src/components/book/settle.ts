// A page's parts (marked with data-settle) are held back while it turns,
// then rise into place in document order once it lands. See book.css.

export function holdBack(leaf: HTMLElement) {
  leaf.dataset.settle = "pending";
}

export function settleIn(leaf: HTMLElement) {
  leaf
    .querySelectorAll<HTMLElement>(".leaf-front [data-settle]")
    .forEach((part, index) => {
      part.style.setProperty("--settle-index", String(index));
    });
  leaf.dataset.settle = "play";
}

// For a turn that was abandoned half way: the page shows as it is.
export function release(leaf: HTMLElement) {
  delete leaf.dataset.settle;
}
