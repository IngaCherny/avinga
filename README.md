# 🏋️ LIIFT MORE

A private **8-week LIIFT MORE tracker** (Joel Freeman · BODi) for Inga, Aviv &
Yael — your lifting schedule, workout videos, and progress in one cozy app.
Reskinned from our earlier tracker, same warm design.

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
- **Weekly** — the full Sun→Sat plan as soft cards, with week navigation and a
  progress ring.
- **Monthly** — a calendar grid colored by muscle-group, a check per finished
  day, and tap-to-expand detail with a Watch link.
- **Three profiles** — Inga, Aviv & Yael; each tracks their own completed
  workouts, saved locally in the browser.
- Installable PWA, smooth animations, mobile-first, reduced-motion friendly.

## 📅 The schedule

LIIFT MORE is a fixed 8-week program: **5 lifting days + 2 rest days** per week,
across two phases (weeks 1–4 strength & mass, weeks 5–8 lean & define). The
weekly split:

| Day | Workout |
| --- | --- |
| 1 | Chest & Triceps |
| 2 | Legs |
| 3 | Back & Biceps |
| 4 | Legs |
| 5 | Shoulders |
| 6–7 | Rest / recovery |

### Sun–Thu or Mon–Fri

The training week adapts to where you are. An Israel timezone lifts **Sunday to
Thursday** (rest Fri & Sat); everywhere else lifts **Monday to Friday** (rest Sat
& Sun). It's auto-detected from the device timezone (`src/lib/region.ts`) and
there's a **my week** toggle on the Weekly tab to override it — the choice is
remembered on that device.

Everything lives in **`src/data/schedule.ts`**:

- `PROGRAM_START_BY_WEEK_START` — the date of **Day 1** for each week shape.
- `WEEK_PATTERN` — the recurring 7-day split.
- `DAY_OVERRIDES` — per-day tweaks (rename a day, change a Phase-2 workout, etc.).

## 🎬 Videos (Google Drive)

Every "Watch" button opens your Drive. By default it opens the whole folder
(`DRIVE_FOLDER_URL` in `src/data/schedule.ts`). To make each day open its **exact
video**, fill in `VIDEO_FILE_IDS` — map a program day (1–56) to its Drive file
ID:

```ts
export const VIDEO_FILE_IDS: Record<number, string> = {
  1: '1AbCdEf...', // Week 1 · Day 1 · Chest & Triceps
  2: '1GhIjKl...', // Week 1 · Day 2 · Legs
}
```

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
