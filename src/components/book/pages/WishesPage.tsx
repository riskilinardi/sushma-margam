"use client";

import { useState, type FormEvent } from "react";
import { buttonClass } from "@/components/ui/Button";
import { addWish, useGuestbook, type Wish } from "@/lib/guestbook";
import { useIsNearby } from "../Book";
import { labelClass, PageHeading } from "./PageHeading";

const fieldClass =
  "mt-1.5 block w-full rounded-sm border border-gold-500/30 bg-maroon-900/70 px-3 py-2.5 text-base text-ivory placeholder:text-ivory/40 focus:border-gold-200 focus:outline-none";

// The guestbook. Wishes arrive live; guests can write once it is opened
// from /admin on the day.
export function WishesPage() {
  const { wishes, open, show } = useGuestbook(useIsNearby());
  const [writing, setWriting] = useState(false);

  return (
    <div className="mx-auto flex h-full max-w-md flex-col text-center">
      <PageHeading eyebrow="Guestbook" title="Wishes" />
      <p data-settle className="mt-3 text-lg text-ivory/75 italic">
        Leave a few words for Sushma on her big night.
      </p>

      <div data-settle className="mt-4 shrink-0">
        {!open ? (
          <p className="text-sm text-ivory/70 italic">
            The guestbook opens on the day of the performance.
          </p>
        ) : writing ? (
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

      <ul className="page-scroll mt-4 min-h-0 flex-1 space-y-3 pb-4 text-left">
        {wishes?.map((wish) => (
          <li
            key={wish.id}
            className="animate-[settle-rise_0.6s_cubic-bezier(0.2,0.7,0.2,1)_both] border border-gold-500/20 bg-maroon-900/60 px-4 py-3"
          >
            <p className="leading-snug whitespace-pre-line">{wish.message}</p>
            <p className="mt-1 text-sm text-gold-200/85 italic">
              — {wish.name}
            </p>
          </li>
        ))}
        {wishes?.length === 0 && (
          <li className="pt-4 text-center text-ivory/70 italic">
            The first wishes will appear here.
          </li>
        )}
      </ul>
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
