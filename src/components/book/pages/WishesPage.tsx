"use client";

import { useState, type FormEvent } from "react";
import { buttonClass } from "@/components/ui/Button";
import { addWish, useGuestbook, type Wish } from "@/lib/guestbook";
import { useIsNearby } from "../Book";
import { labelClass, PageHeading } from "./PageHeading";

const fieldClass =
  "mt-1.5 block w-full rounded-sm border border-gold-500/30 bg-maroon-900/70 px-3 py-2.5 text-base text-ivory placeholder:text-ivory/40 focus:border-gold-200 focus:outline-none";

// The guestbook. Wishes arrive live; guests can write once it is opened
// from /admin on the day, and the wishes stay after it closes.
export function WishesPage() {
  const { wishes, open, show } = useGuestbook(useIsNearby());
  const [writing, setWriting] = useState(false);

  return (
    <div className="mx-auto flex h-full max-w-md flex-col text-center">
      <PageHeading eyebrow="Guestbook" title="Wishes" />
      <p data-settle className="mt-3 text-lg text-ivory/75 italic">
        Leave a few words for Sushma on her big night.
      </p>

      {open && (
        <div data-settle className="mt-5 shrink-0">
          {writing ? (
            <WishForm
              onSent={(wish) => {
                show(wish);
                setWriting(false);
              }}
              onCancel={() => setWriting(false)}
            />
          ) : (
            <button
              type="button"
              onClick={() => setWriting(true)}
              className={buttonClass("solid")}
            >
              Write a wish
            </button>
          )}
        </div>
      )}

      {!open && wishes?.length === 0 ? (
        <Closed />
      ) : (
        <ul className="page-scroll mt-2 min-h-0 flex-1 pb-4">
          {wishes?.map((wish, index) => (
            <li
              key={wish.id}
              className="animate-[settle-rise_0.6s_cubic-bezier(0.2,0.7,0.2,1)_both] pt-5"
            >
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className="mx-auto mb-5 block size-1.5 rotate-45 bg-gold-500/60"
                />
              )}
              <p className="text-lg leading-snug whitespace-pre-line">
                {wish.message}
              </p>
              <p className="mt-2 font-display text-[0.65rem] tracking-[0.25em] text-gold-200 uppercase">
                {wish.name}
              </p>
            </li>
          ))}
          {open && wishes?.length === 0 && (
            <li className="pt-6 text-ivory/70 italic">
              The first wishes will appear here.
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

// Before the guestbook opens: a blank page with its ruled lines, waiting.
function Closed() {
  return (
    <div
      data-settle
      className="flex flex-1 flex-col items-center justify-center pb-[8cqh]"
    >
      <svg
        viewBox="0 0 32 32"
        aria-hidden="true"
        className="size-9 text-gold-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      >
        <path d="M28 3C17 5 9 13 6 27" />
        <path d="M28 3C29 13 22 21 8.5 21.5" />
        <path d="M24 8 14 18" />
        <path d="M4 30h9" />
      </svg>
      <p className="mt-4 text-lg text-balance text-ivory/80 italic">
        The guestbook opens on the evening of the performance.
      </p>
      <div
        aria-hidden="true"
        className="mt-6 w-full max-w-60 space-y-5 [mask-image:linear-gradient(#000,transparent)]"
      >
        {[0, 1, 2, 3].map((line) => (
          <span
            key={line}
            className="block border-b border-dotted border-gold-500/50"
          />
        ))}
      </div>
    </div>
  );
}

type WishFormProps = {
  onSent: (wish: Wish) => void;
  onCancel: () => void;
};

function WishForm({ onSent, onCancel }: WishFormProps) {
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    // Left empty by people; bots fill in every field.
    if (form.get("website")) return onCancel();

    setSending(true);
    setFailed(false);
    try {
      onSent(
        await addWish(String(form.get("name")), String(form.get("message"))),
      );
    } catch {
      setFailed(true);
      setSending(false);
    }
  }

  return (
    <form onSubmit={send} className="space-y-3 text-left">
      <label className="block">
        <span className={labelClass}>Your name</span>
        <input
          name="name"
          required
          maxLength={60}
          autoComplete="name"
          className={fieldClass}
        />
      </label>
      <label className="block">
        <span className={labelClass}>Your wish</span>
        <textarea
          name="message"
          required
          maxLength={500}
          rows={3}
          className={`${fieldClass} resize-none`}
        />
      </label>
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      {failed && (
        <p className="text-sm text-gold-200 italic">
          Your wish couldn&apos;t be sent. Please try again.
        </p>
      )}
      <div className="flex justify-center gap-2.5">
        <button
          type="button"
          onClick={onCancel}
          className={`px-4 ${buttonClass()}`}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={sending}
          className={`px-4 ${buttonClass("solid")}`}
        >
          {sending ? "Sending…" : "Offer your wish"}
        </button>
      </div>
    </form>
  );
}
