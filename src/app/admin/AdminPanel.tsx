"use client";

import Image from "next/image";
import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { buttonClass } from "@/components/ui/Button";
import { photoUrl, removePhoto, uploadPhoto, useGallery } from "@/lib/gallery";
import { removeWish, setGuestbookOpen, useGuestbook } from "@/lib/guestbook";
import { supabase } from "@/lib/supabase";

const fieldClass =
  "mt-1.5 block w-full rounded-sm border border-gold-500/30 bg-maroon-900/70 px-3 py-2.5 text-base text-ivory focus:border-gold-200 focus:outline-none";
const labelClass =
  "font-display text-[0.65rem] tracking-[0.3em] text-gold-200 uppercase";

// For running the evening from a phone: open the guestbook, remove a wish,
// add photos to the gallery. Only emails in public.admins can change anything.
export function AdminPanel() {
  const [session, setSession] = useState<Session | null | undefined>();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, next) =>
      setSession(next),
    );
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    supabase.rpc("is_admin").then(({ data }) => setIsAdmin(data === true));
  }, [session]);

  async function signOut() {
    await supabase.auth.signOut();
    setIsAdmin(null);
  }

  return (
    <main className="mx-auto min-h-svh max-w-xl px-5 py-10">
      <header className="text-center">
        <p className={labelClass}>Margam · Sushma Sekaran</p>
        <h1 className="mt-2 text-gilded font-display text-3xl uppercase">
          Admin
        </h1>
      </header>

      {session === undefined || (session && isAdmin === null) ? (
        <p className="mt-10 text-center text-ivory/70 italic">Loading…</p>
      ) : !session ? (
        <SignIn />
      ) : !isAdmin ? (
        <div className="mt-10 text-center">
          <p className="text-ivory/80">
            {session.user.email} isn&apos;t on the admin list.
          </p>
          <SignOut onClick={signOut} />
        </div>
      ) : (
        <>
          <p className="mt-3 text-center text-sm text-ivory/70">
            Signed in as {session.user.email}
          </p>
          <GuestbookControls />
          <GalleryControls />
          <SignOut onClick={signOut} />
        </>
      )}
    </main>
  );
}

function SignIn() {
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(form.get("email")),
      password: String(form.get("password")),
    });
    setFailed(Boolean(error));
    setBusy(false);
  }

  return (
    <form onSubmit={signIn} className="mt-10 space-y-4">
      <label className="block">
        <span className={labelClass}>Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className={fieldClass}
        />
      </label>
      <label className="block">
        <span className={labelClass}>Password</span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={fieldClass}
        />
      </label>
      {failed && (
        <p className="text-sm text-gold-200 italic">
          That email and password don&apos;t match.
        </p>
      )}
      <button
        type="submit"
        disabled={busy}
        className={`w-full ${buttonClass("solid")}`}
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

function GuestbookControls() {
  const { wishes, open } = useGuestbook(true);
  const [saving, setSaving] = useState(false);

  async function toggle() {
    setSaving(true);
    try {
      await setGuestbookOpen(!open);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Panel title="Guestbook">
      <div className="flex items-center justify-between gap-4">
        <p>
          {open ? "Open: guests can write wishes." : "Closed to new wishes."}
        </p>
        <button
          type="button"
          role="switch"
          aria-checked={open}
          aria-label="Guests can write wishes"
          disabled={saving}
          onClick={toggle}
          className="relative h-8 w-14 shrink-0 rounded-full border border-gold-500/50 transition-colors disabled:opacity-50 aria-checked:bg-gold-500"
        >
          <span
            className={`absolute top-1 left-1 size-5.5 rounded-full transition-transform ${open ? "translate-x-6 bg-maroon-950" : "bg-gold-200"}`}
          />
        </button>
      </div>

      <ul className="mt-5 space-y-2">
        {wishes?.map((wish) => (
          <li
            key={wish.id}
            className="flex items-start gap-3 border border-gold-500/20 bg-maroon-900/60 px-3 py-2.5"
          >
            <div className="min-w-0 flex-1">
              <p className="leading-snug whitespace-pre-line">{wish.message}</p>
              <p className="mt-1 text-sm text-gold-200/85 italic">
                — {wish.name}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (confirm(`Remove the wish from ${wish.name}?`)) {
                  removeWish(wish.id);
                }
              }}
              className="shrink-0 py-1 font-display text-[0.6rem] tracking-[0.2em] text-gold-200 uppercase"
            >
              Remove
            </button>
          </li>
        ))}
        {wishes?.length === 0 && (
          <li className="text-ivory/70 italic">No wishes yet.</li>
        )}
      </ul>
    </Panel>
  );
}

function GalleryControls() {
  const photos = useGallery(true);
  const [progress, setProgress] = useState<string | null>(null);
  const [failures, setFailures] = useState(0);

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const files = [...(event.target.files ?? [])];
    event.target.value = "";
    setFailures(0);
    for (const [i, file] of files.entries()) {
      setProgress(`Uploading ${i + 1} of ${files.length}…`);
      try {
        await uploadPhoto(file);
      } catch {
        setFailures((count) => count + 1);
      }
    }
    setProgress(null);
  }

  return (
    <Panel title="Gallery">
      <label
        className={`w-full cursor-pointer ${buttonClass("solid")} ${progress ? "pointer-events-none opacity-60" : ""}`}
      >
        {progress ?? "Add photos"}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={upload}
          className="sr-only"
        />
      </label>
      {failures > 0 && (
        <p className="mt-2 text-sm text-gold-200 italic">
          {failures === 1 ? "One photo" : `${failures} photos`} couldn&apos;t be
          uploaded. Please try again.
        </p>
      )}

      <ul className="mt-5 grid grid-cols-3 gap-2">
        {photos?.map((photo) => (
          <li key={photo.id} className="relative">
            <Image
              src={photoUrl(photo.path)}
              alt=""
              width={photo.width}
              height={photo.height}
              sizes="30vw"
              className="aspect-square w-full object-cover"
            />
            <button
              type="button"
              onClick={() => {
                if (confirm("Remove this photo from the gallery?")) {
                  removePhoto(photo);
                }
              }}
              className="absolute inset-x-0 bottom-0 bg-maroon-950/85 py-1.5 font-display text-[0.55rem] tracking-[0.2em] text-gold-200 uppercase"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      {photos?.length === 0 && (
        <p className="mt-2 text-ivory/70 italic">No photos yet.</p>
      )}
    </Panel>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8 border border-gold-500/25 bg-maroon-900/40 p-5">
      <h2 className="mb-4 font-display text-lg tracking-[0.15em] text-gold-200 uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}

function SignOut({ onClick }: { onClick: () => void }) {
  return (
    <div className="mt-8 text-center">
      <button type="button" onClick={onClick} className={buttonClass()}>
        Sign out
      </button>
    </div>
  );
}
