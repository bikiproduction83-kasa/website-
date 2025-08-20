import React, { useEffect, useMemo, useRef, useState } from "react";
import { Mic2, PlayCircle, BookOpen, Mail, ExternalLink, Youtube, Twitter, Instagram, Sun, Moon } from "lucide-react";

// ====== CONFIG: Replace with your real links ======
const LINKS = {
  youtubeChannel: "https://youtube.com/@YOUR_CHANNEL", // e.g., https://youtube.com/@BikiProduction
  latestVideoId: "dQw4w9WgXcQ", // replace with your latest episode ID
  email: "hello@bikiproduction.com",
  instagram: "https://instagram.com/YOUR_HANDLE",
  twitter: "https://twitter.com/YOUR_HANDLE",
  newsletterAction: "#", // form action or service URL; '#' keeps it in demo mode
};

function AspectVideo({ children }) {
  return (
    <div style={{ position: "relative", paddingTop: "56.25%" }}>
      <div style={{ position: "absolute", inset: 0 }}>{children}</div>
    </div>
  );
}

// Theme helpers
const THEME_KEY = "biki-theme";
function getInitialTheme() {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") return stored;
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

export default function BikiProductionLanding() {
  const [theme, setTheme] = useState(getInitialTheme);
  const featuredSrc = useMemo(() => {
    const id = (LINKS.latestVideoId || "").trim();
    return id ? `https://www.youtube.com/embed/${id}` : undefined;
  }, []);

  const newsletterFormRef = useRef(null);
  const contactFormRef = useRef(null);

  // persist theme
  useEffect(() => {
    try { window.localStorage.setItem(THEME_KEY, theme); } catch {}
  }, [theme]);

  // Self-tests (log to console)
  useEffect(() => {
    const tests = [];
    const record = (name, pass, info = "") => tests.push({ name, pass, info });
    try {
      // Test 1: CTA href equals youtubeChannel
      const cta = document.querySelector('[data-testid="cta-youtube"]');
      record("CTA points to YouTube channel", !!cta && cta.getAttribute("href") === LINKS.youtubeChannel, cta ? cta.getAttribute("href") : "missing");
      // Test 2: Featured iframe contains latestVideoId (or blank if none)
      const iframe = document.querySelector('[data-testid="featured-iframe"]');
      const expectVid = (LINKS.latestVideoId || "").trim();
      const hasVid = expectVid ? iframe?.getAttribute("src")?.includes(expectVid) : !iframe?.getAttribute("src");
      record("Featured iframe uses latestVideoId (or blank)", Boolean(hasVid), iframe ? iframe.getAttribute("src") || "(empty)" : "missing");
      // Test 3: Theme toggle switches .dark class on wrapper
      const wrapper = document.querySelector('[data-testid="theme-wrapper"]');
      const beforeDark = wrapper?.classList.contains("dark");
      wrapper?.classList.toggle("dark");
      const afterDark = wrapper?.classList.contains("dark");
      // revert
      if (beforeDark !== undefined) wrapper.classList.toggle("dark");
      record("Theme wrapper toggles .dark class", beforeDark !== afterDark, `${beforeDark} -> ${afterDark}`);
      // Summary
      const passCount = tests.filter(t => t.pass).length;
      // eslint-disable-next-line no-console
      console.groupCollapsed(`BIKI self-tests: ${passCount}/${tests.length} passed`);
      tests.forEach(t => console[t.pass ? "log" : "error"](`${t.pass ? "✔" : "✖"} ${t.name} — ${t.info}`));
      console.groupEnd();
      window.__BIKI_TESTS__ = tests;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Self-tests error:", err);
    }
  }, []);

  return (
    <div data-testid="theme-wrapper" className={theme === "dark" ? "dark" : undefined}>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-emerald-50 to-teal-100 text-zinc-900 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-800 dark:text-zinc-100">
        {/* Header */}
        <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/60">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-amber-600 text-white shadow">
                <Mic2 className="h-5 w-5" />
              </div>
              <div>
                <div className="text-base font-extrabold tracking-tight">BIKI PRODUCTION</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">Politics • Culture • Sports — Horn of Africa</div>
              </div>
            </div>

            <nav className="hidden items-center gap-6 md:flex">
              <a href="#watch" className="text-sm text-zinc-700 hover:text-black dark:text-zinc-200 dark:hover:text-white">Watch</a>
              <a href="#about" className="text-sm text-zinc-700 hover:text-black dark:text-zinc-200 dark:hover:text-white">About</a>
              <a href="#subscribe" className="text-sm text-zinc-700 hover:text-black dark:text-zinc-200 dark:hover:text-white">Subscribe</a>
              <a href="#contact" className="text-sm text-zinc-700 hover:text-black dark:text-zinc-200 dark:hover:text-white">Contact</a>
            </nav>

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                aria-pressed={theme === "dark"}
                data-testid="theme-toggle"
                onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
                className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white/70 px-3 py-1.5 text-sm font-medium text-zinc-800 hover:bg-white dark:border-zinc-600 dark:bg-zinc-800/60 dark:text-zinc-100 dark:hover:bg-zinc-800"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {theme === "dark" ? "Light" : "Dark"}
              </button>

              <a
                data-testid="cta-youtube"
                href={LINKS.youtubeChannel}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-amber-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-amber-700"
              >
                <PlayCircle className="h-4 w-4" /> Watch on YouTube
              </a>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="relative">
          {/* Light gradient */}
          <div className="absolute inset-0 -z-10 block bg-[radial-gradient(70%_60%_at_50%_0%,rgba(16,185,129,0.15),transparent_70%),radial-gradient(70%_60%_at_80%_20%,rgba(245,158,11,0.15),transparent_70%)] dark:hidden" />
          {/* Dark gradient */}
          <div className="absolute inset-0 -z-10 hidden bg-[radial-gradient(70%_60%_at_50%_0%,rgba(34,197,94,0.08),transparent_70%),radial-gradient(70%_60%_at_80%_20%,rgba(251,191,36,0.08),transparent_70%)] dark:block" />

          <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-16 md:grid-cols-2">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Your hub for the Horn of Africa</h1>
              <p className="mt-4 text-lg text-zinc-700 dark:text-zinc-300">
                Insightful conversations on politics, culture, history, and sports —
                with context, analysis, and diverse viewpoints.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#watch" className="inline-flex items-center gap-2 rounded-md bg-emerald-700 px-4 py-2 text-white hover:bg-emerald-800">
                  <PlayCircle className="h-5 w-5" /> Watch / Listen
                </a>
                <a href="#subscribe" className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-zinc-800 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-800/50">
                  <BookOpen className="h-5 w-5" /> Subscribe for updates
                </a>
              </div>
              <div className="mt-6 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">New episodes • Join the community & stay informed</div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900/60">
              <AspectVideo>
                {featuredSrc ? (
                  <iframe
                    data-testid="featured-iframe"
                    className="h-full w-full"
                    src={featuredSrc}
                    title="Featured episode"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500 dark:text-zinc-400">
                    Set LINKS.latestVideoId to show a featured video
                  </div>
                )}
              </AspectVideo>
            </div>
          </div>
        </section>

        {/* Watch section */}
        <section id="watch" className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-bold">Watch the podcast</h2>
            <a
              data-testid="watch-youtube-link"
              href={LINKS.youtubeChannel}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
            >
              Go to YouTube <ExternalLink className="h-4 w-4" />
            </a>
          </div>
          <p className="mt-2 text-zinc-700 dark:text-zinc-300">Full episodes, highlight clips, and live conversations.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <a
                key={i}
                href={`${LINKS.youtubeChannel.replace(/\/$/, "")}/videos`}
                target="_blank"
                rel="noopener noreferrer"
                className="group overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900/60"
              >
                <AspectVideo>
                  <div className="h-full w-full bg-gradient-to-br from-emerald-100 to-amber-100 dark:from-zinc-800 dark:to-zinc-700" />
                </AspectVideo>
                <div className="p-3">
                  <div className="text-sm font-semibold group-hover:underline">Latest Episode {i}</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">Watch on YouTube</div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Social strip */}
        <section className="border-y border-zinc-200 bg-gradient-to-r from-emerald-50 to-amber-50 dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-6">
            <div className="text-sm font-semibold">Follow BIKI PRODUCTION</div>
            <div className="flex items-center gap-2">
              <a
                href={LINKS.youtubeChannel}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-3 py-1.5 text-sm hover:bg-white dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-100 dark:hover:bg-zinc-800"
              >
                <Youtube className="h-4 w-4" /> YouTube
              </a>
              <a
                data-testid="social-x"
                href={LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-3 py-1.5 text-sm hover:bg-white dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-100 dark:hover:bg-zinc-800"
              >
                <Twitter className="h-4 w-4" /> X
              </a>
              <a
                data-testid="social-instagram"
                href={LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-3 py-1.5 text-sm hover:bg-white dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-100 dark:hover:bg-zinc-800"
              >
                <Instagram className="h-4 w-4" /> Instagram
              </a>
            </div>
          </div>
        </section>

        {/* Subscribe */}
        <section id="subscribe" className="mx-auto max-w-6xl px-4 py-12">
          <div className="rounded-2xl border border-zinc-200 bg-gradient-to-r from-amber-100 to-emerald-100 p-6 dark:border-zinc-700 dark:from-zinc-800 dark:to-zinc-900">
            <h3 className="text-xl font-bold">Subscribe for new episodes</h3>
            <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">Monthly email with podcast drops and highlights.</p>
            <form
              ref={newsletterFormRef}
              method="post"
              className="mt-4 flex flex-col gap-3 sm:flex-row"
              onSubmit={(e) => {
                if (LINKS.newsletterAction === "#") {
                  e.preventDefault();
                  alert("Replace newsletterAction with your email service URL.");
                } else {
                  e.currentTarget.setAttribute("action", LINKS.newsletterAction);
                }
              }}
            >
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input id="newsletter-email" name="email" type="email" required placeholder="Your email address" className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm sm:max-w-xs dark:border-zinc-600 dark:bg-zinc-900/60" />
              <button type="submit" className="h-10 rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white hover:bg-emerald-800">Subscribe</button>
            </form>
          </div>
        </section>

        {/* About */}
        <section id="about" className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-2xl font-bold">About BIKI PRODUCTION</h2>
          <p className="mt-2 max-w-3xl text-zinc-700 dark:text-zinc-300">
            We spotlight the politics and rich cultural heritage of the Horn of Africa —
            exploring current affairs, historical perspectives, sports, and cultural narratives.
            Join us for meaningful conversations about the region's future.
          </p>
        </section>

        {/* Contact */}
        <section id="contact" className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-2xl font-bold">Contact</h2>
          <p className="mt-2 text-zinc-700 dark:text-zinc-300">For collaborations, press, and sponsorships.</p>
          <form
            ref={contactFormRef}
            className="mt-4 grid gap-3 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Hook this form to your email service or backend.");
            }}
          >
            <div className="sm:col-span-1">
              <label htmlFor="contact-name" className="mb-1 block text-sm font-medium">Name</label>
              <input id="contact-name" name="name" className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm dark:border-zinc-600 dark:bg-zinc-900/60" placeholder="Your name" required />
            </div>
            <div className="sm:col-span-1">
              <label htmlFor="contact-email" className="mb-1 block text-sm font-medium">Email</label>
              <input id="contact-email" name="email" type="email" className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm dark:border-zinc-600 dark:bg-zinc-900/60" placeholder="you@example.com" required />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="contact-message" className="mb-1 block text-sm font-medium">Message</label>
              <textarea id="contact-message" name="message" className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900/60" rows={5} placeholder="Your message..." required />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" className="inline-flex items-center gap-2 rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
                <Mail className="h-4 w-4" /> Send message
              </button>
            </div>
          </form>
        </section>

        {/* Footer */}
        <footer className="border-t border-zinc-200 bg-white/80 dark:border-zinc-700 dark:bg-zinc-900/60">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 py-8 sm:flex-row sm:items-center">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">© {new Date().getFullYear()} BIKI PRODUCTION</div>
            <div className="flex items-center gap-3 text-sm">
              <a href="#watch" className="hover:underline">Watch</a>
              <span>•</span>
              <a href="#subscribe" className="hover:underline">Subscribe</a>
              <span>•</span>
              <a href="#contact" className="hover:underline">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
