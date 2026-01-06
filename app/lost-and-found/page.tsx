// app/lost-and-found/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getEntry } from "./entries";
import { ROUTES, routeWithQuery } from "../routes";

const COOKIE_NAME = "feverna_lostfound_tag";

export default async function LostAndFoundPage({
  searchParams,
}: {
  searchParams?: { err?: string };
}) {
  const cookieStore = await cookies();
  const tagCookie = cookieStore.get(COOKIE_NAME)?.value ?? "";
  const entry = tagCookie ? getEntry(tagCookie) : null;
  const showError = searchParams?.err === "1";

  async function submit(formData: FormData) {
    "use server";

    const raw = String(formData.get("tag") ?? "");
    const found = getEntry(raw);

    // Next can be strict about redirect() arg typing; this keeps TS happy.
    type RedirectArg = Parameters<typeof redirect>[0];

    if (!found) {
      redirect(
        routeWithQuery(ROUTES.lostFound, { err: 1 }) as unknown as RedirectArg
      );
    }

    const store = await cookies();
    store.set(COOKIE_NAME, found.tag, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 6, // 6 hours
    });

    redirect(ROUTES.lostFound as unknown as RedirectArg);
  }

  return (
    <main className="relative min-h-svh overflow-hidden">
      {/* Background image (no global darkening; panel handles readability) */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/lost.webp')" }}
      />

      <section className="relative z-10 mx-auto flex min-h-svh max-w-[760px] flex-col justify-center px-5">
        <header className="mb-6">
          <h1 className="text-2xl tracking-[0.22em] text-(--feverna-gold)">
            LOST &amp; FOUND
          </h1>
          <p className="mt-2 text-sm text-white/75">
            The Caretaker keeps a ledger for misplaced things—keys, names, and
            certain little hopes.
          </p>
        </header>

        {!entry ? (
          <div className="rounded-2xl border border-white/10 bg-black/55 p-5 backdrop-blur-sm">
            <p className="text-sm text-white/75">
              If you have your key tag number, enter it below.
            </p>

            <form action={submit} className="mt-4 flex flex-col gap-3">
              <label className="text-xs tracking-[0.18em] text-white/60">
                KEY TAG
              </label>

              <input
                name="tag"
                autoComplete="off"
                className="
                  rounded-xl border border-white/15 bg-black/55 px-4 py-3
                  text-white/90 outline-none
                  focus:border-(--feverna-gold)/60
                "
                placeholder="K-000"
              />

              {showError ? (
                <p className="text-sm text-white/70">
                  That tag doesn’t match the ledger. Try again—slowly.
                </p>
              ) : null}

              <button type="submit" className="feverna-btn mt-2">
                Check the Ledger
              </button>

              <p className="mt-2 text-xs text-white/45">
                If you don’t have a tag, return to the Desk. The bell is not for
                show.
              </p>
            </form>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-black/55 p-6 backdrop-blur-sm">
            <p className="text-xs tracking-[0.18em] text-white/55">
              ENTRY RETRIEVED —{" "}
              <span className="text-(--feverna-gold)">{entry.displayTag}</span>
            </p>

            <div className="mt-4 space-y-3 text-sm leading-relaxed text-white/80">
              {entry.letter.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <a href={entry.portalHref} className="feverna-btn text-center">
                Proceed Through the Door
              </a>

              <a
                href={ROUTES.desk}
                className="text-sm text-white/65 underline underline-offset-4"
              >
                Return to the Desk
              </a>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
