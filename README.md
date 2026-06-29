# ☀ Sweaty Week

A cozy **weekly & monthly workout tracker** for Aviv & Inga — built to keep two
friends moving, sweating, and motivated together. Inspired by (and styled to
match) our warm, hand-made training plan PDFs.

> _move, sweat, repeat · consistency over perfection — you've got this!_

## ✨ Features

- **Today** — a day-aware home screen that greets you and shows today's workout
  front-and-center, plus a peek at what's _up next_ tomorrow and what you did
  _yesterday_. Tap to check off your session.
- **Weekly** — the full Sun→Sat plan as soft cards (the look from the PDF), with
  week navigation and a progress ring for the week.
- **Monthly** — a calendar grid with a colored dot per workout type, a check for
  finished days, and a tap-to-expand detail for any day.
- **Two profiles** — switch between **Inga** and **Aviv**; each person's
  completed workouts are tracked separately.
- **Saved locally** — progress is stored in your browser (`localStorage`), and
  stays in sync across open tabs. Nothing is sent anywhere.
- Smooth animations (Framer Motion), responsive mobile-first layout, and a
  `prefers-reduced-motion` friendly experience.

## 🎨 The look

Warm cream background, blush "blob" accents, two-tone rounded display headings,
and per-day colored badges — all tuned to match the training plan design.

- **Display font:** Fredoka · **Body font:** Quicksand
- **Methods:** `BELLE` (dusty rose) · `BUILD&BURN` (mocha) · `RUN` (terracotta)

## 🛠 Tech

React 18 · TypeScript · Vite · Tailwind CSS · Framer Motion.

## 🚀 Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build
npm run preview  # preview the production build
```

## ✏️ Customizing the plan

The entire schedule lives in one place — **`src/data/schedule.ts`**.
`WEEKLY_TEMPLATE` maps each weekday (`0` = Sunday … `6` = Saturday) to a
workout, and it repeats automatically across every week and month. Edit titles,
notes, methods, or rest days there and the whole app updates.

People are defined in **`src/data/people.ts`**.

## 🌐 Deploying to GitHub Pages

A workflow at `.github/workflows/deploy.yml` builds and deploys on every push to
`main`. To enable it:

1. Push this repo to GitHub.
2. Go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. The site publishes at `https://<your-username>.github.io/<repo-name>/`.

The build reads the repo name automatically for the base path. To build for a
different path locally: `VITE_BASE=/my-path/ npm run build`.

---

Made with ♡ for staying consistent, together.
