# 🏋️ LIIFT MORE

A private **8-week LIIFT MORE tracker** (Joel Freeman · BODi) — your lifting
schedule, workout videos, and lifted weights in one cozy app. Reskinned from our
earlier tracker, same warm design.

> _lift heavy, burn more, repeat · consistency over perfection — you've got this!_

## 🔒 Password protected

The site is gated behind a password so the official-program videos aren't shared
publicly. It's a **static site** (GitHub Pages), so this is a client-side gate,
not server auth: only the **SHA-256 hash** of the password is stored in the code
(`src/lib/auth.ts`), never the plaintext. It keeps casual visitors and search
engines out; your Drive videos stay separately protected by Google's own sharing
settings.

**To change the password**, generate a new hash and paste it into
`src/lib/auth.ts`:

```bash
node -e "console.log(require('crypto').createHash('sha256').update('YOUR NEW PASSWORD').digest('hex'))"
```

## ✨ Features

- **Today** — greets you, shows today's workout front-and-center with a peek at
  yesterday and tomorrow, plus your streak and 8-week program progress.
- **Weekly** — the full week as soft cards, with week navigation, a progress
  ring, and the Sun–Thu / Mon–Fri toggle.
- **Monthly** — a calendar grid colored by muscle-group, a check per finished
  day, and tap-to-expand detail with a Watch link.
- **Progress** — every exercise you've logged, with a sparkline of your top set
  over time, your best ever, and a tap-to-expand session history.
- **Log lifts** — tap-first weight logging on any workout: one-tap weight chips,
  `↺ repeat` to copy last session, `+`/`−` steppers, and a "last 5 · 5 · 3 lb"
  hint so you always know what to beat.
- **Backup & restore** — download your log as JSON, or paste one back in
  (Progress tab). Handy when moving to a new phone.
- Installable PWA, smooth animations, mobile-first, reduced-motion friendly.

### Your data stays on your device

Completed workouts, logged weights, your unit (lb/kg) and week shape all live in
this browser's `localStorage`. Nothing is uploaded, nothing is shared, and
nothing goes into this repository — so everyone using the app keeps their own
private numbers.

## 📅 The schedule

LIIFT MORE is a fixed 8-week program: **5 lifting days + 2 rest days** per week,
across two phases. Each session alternates between a straight **LIFT + core** and
a **LIFT + HIIT + core**.

**Phase 1 · weeks 1–4 · strength & mass**

| Day | Workout |
| --- | --- |
| 1 | Chest & Biceps |
| 2 | Quads & Calves |
| 3 | Back & Triceps |
| 4 | Hamstrings & Glutes |
| 5 | Shoulders |
| 6–7 | Rest / recovery |

**Phase 2 · weeks 5–8 · lean & define**

| Day | Workout |
| --- | --- |
| 1 | Legs |
| 2 | Chest & Back |
| 3 | Shoulders |
| 4 | More Legs |
| 5 | Arms |
| 6–7 | Rest / recovery |

Both splits are confirmed against the Week 1–5 video filenames, not guessed.

### Sun–Thu or Mon–Fri

Everyone defaults to **Monday–Friday** (rest Sat & Sun). Anyone who trains
**Sunday–Thursday** (rest Fri & Sat) flips the **my week** toggle on the Weekly
tab once — the choice is remembered on that device (`src/lib/region.ts`).

Everything lives in **`src/data/schedule.ts`**:

- `PROGRAM_START_BY_WEEK_START` — the date of **Day 1** for each week shape.
- `PHASE1_PATTERN` / `PHASE2_PATTERN` — the recurring 7-day split per phase.
- `workoutFormat()` — the LIFT vs LIFT + HIIT alternation.
- `DAY_OVERRIDES` — per-day tweaks (rename a day, add a focus note, etc.).

The exercise lists behind **Log lifts** are in `src/data/exercises.ts`,
transcribed from the official Weight Progression sheet.

## 🎬 Videos (Google Drive)

Every "Watch" button opens your Drive. **Weeks 1–5 are mapped** to their exact
video; **weeks 6–8 aren't uploaded yet**, so those days fall back to opening the
whole folder (`DRIVE_FOLDER_URL`).

To wire up a new week, add its file IDs to `VIDEO_FILE_IDS` in
`src/data/schedule.ts`, keyed by program day (1–56):

```ts
export const VIDEO_FILE_IDS: Record<number, string> = {
  36: '1AbCdEf...', // Week 6 · Day 1 · Legs
  37: '1GhIjKl...', // Week 6 · Day 2 · Chest & Back
}
```

The lifting days waiting for links are **36–40** (week 6), **43–47** (week 7) and
**50–54** (week 8).

Get a file ID from Drive: open the video → **Share → Copy link** →
`https://drive.google.com/file/d/THE_FILE_ID/view` — paste just `THE_FILE_ID`.
Make sure the videos are shared so the people using the app can view them.

## 🛠 Tech

React 18 · TypeScript · Vite · Tailwind CSS · Framer Motion.

## 🚀 Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build
npm run preview  # preview the production build
```

## 🌐 Deploying to GitHub Pages

A workflow at `.github/workflows/deploy.yml` builds and deploys on push. Enable
it once under **Settings → Pages → Source → GitHub Actions**. The site publishes
at `https://<your-username>.github.io/<repo-name>/`.

---

Made with ♡ for lifting heavy, together.
