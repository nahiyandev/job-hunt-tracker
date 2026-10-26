# 🧡💜 Job Hunt Tracker — Frontend

> **Your job hunt, finally organised.**
> A FREE job-hunt app for everyone — any job category, any level. It
> combines a multi-source Job Feed, a private Application Tracker, AI
> matching and document tools, follow-up and recruiter CRM, and analytics.
> Tracking alone is not the selling point — the Feed + AI + shareable
> tools are.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![React](https://img.shields.io/badge/React-18-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Express.js](https://img.shields.io/badge/Express.js-4-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![better-auth](https://img.shields.io/badge/better--auth-Google-orange)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-UI-black)
![Recharts](https://img.shields.io/badge/Recharts-Charts-purple)

This folder is the **frontend app only** (Next.js App Router).
The backend is a separate project (Express + MongoDB + better-auth).
The backend is a REST API: it serves the frontend, checks the Google
session on every request, and returns data only for the logged-in user.
The full API endpoint list is intentionally not written here — the API
is described in words only, as requested. For how to merge this v3
upgrade into the existing repos, read `MERGE_GUIDE.md` first.

**Pricing: FREE for all users for now.** No paid plan, no paywall, no
Premium badge in v3.

---

## 🎯 Who is this for?

This app is for **job seekers who apply to many places and lose track**.

- Students and fresh graduates applying to their first jobs
- Experienced professionals switching jobs or companies
- Anyone, any category, junior or senior — filtering is per-user, from
  their own profile, never a global junior-only filter
- Anyone who used to track applications in a spreadsheet, notebook, or
  memory, and forgot a follow-up and lost an opportunity because of it

It is a **personal** tracker. One user = one private tracker. It is not
a job board, not a recruitment portal, and not a shared team tool.

## ✨ What benefits does it give you?

- **You never miss a follow-up.** Follow-ups are created automatically
  (+10 days, then +14 days, max 2), with Snooze, Mark Done and Mark Undone.
- **Real jobs, in one feed.** Multi-source jobs with source name and
  original link, sorted by how well they match *your* profile, with the
  reason shown (which keywords matched).
- **You see your progress.** Dashboard charts with legends, conversion
  Application → Interview → Offer, ghosted count, weekly target and
  streak, and a plain-words Funnel Coach report.
- **Free tools, even without login.** Resume–JD Matcher (ATS score ring
  + section bars) and Cover Letter Generator (live preview + download).
- **Interview preparation becomes easy.** Interview Copilot questions
  with STAR structure, projects with tech stack and repo links sitting
  next to your applications, and a thank-you email draft after interviews.
- **Your data stays yours.** No fake data, no scraping, no auto-apply.
  Admins can manage roles and keywords, but they cannot see your private
  tracker data, profile, notes or documents.
- **You start empty and honest.** A new user sees no demo applications,
  no invented jobs, no invented numbers — only honest empty states.

---

## ✨ Features

| Page | What it does |
| --- | --- |
| 🏠 `/` — Landing page | Public home page. No login forced. Bold orange-purple hero, feature cards, 3-step how-it-works, links to Feed and free tools. |
| 📰 `/feed` — Job Feed | Public: browsable **without login**; login only to Save. Filters (role, location, remote/hybrid/onsite, salary, level, visa, date, category), saved searches + alerts, AI Match % badge + reason, Save to private tracker, report a job (Applied / Interview / Closed / Fake), ready search links for LinkedIn / Bdjobs (you browse there yourself), BDT salary display, Bangla/English toggle, "Remote jobs for Bangladeshis" filter. |
| 📊 `/dashboard` | Stat cards (Total, Wishlist, Applied, Interviewing, Offered, Ghosted), next follow-up, LinkedIn totals (live SUM), status donut **with legend**, applied-per-day bar chart (last 12 days), conversion, response by source, weekly target + streak, Funnel Coach, Delete All DEMO Data. |
| 📝 `/applications` | Kanban drag-and-drop + table + calendar, all showing the same data. Click a card/row for the full detail view. Statuses: Saved, Applied, Assessment, Interview, Offer, Rejected, Ghosted (plus old Lead/Closed, still valid). Recruiter (name, profile URL, notes), CV version, documents, interview history, apply-helper with matching projects suggested from the JD stack. Review-before-send, always. |
| ⏰ `/follow-ups` | Follow-up list + calendar + reminder popup with Snooze and Mark Done / Mark Undone. Overdue items highlighted, with filter. |
| 💼 `/linkedin` | LinkedIn Daily activity log: date, comments, posts, notes, LIVE total sum. Its own page, not just a dashboard chart. |
| 🚀 `/projects` | Projects with tech stack, repo link and live link, for interviews. |
| 👤 `/profile` | Editable profile (bio, headline, skills, level, location, keywords, LinkedIn/GitHub/portfolio links). Auto-created from Google on signup. Header avatar opens Profile / Settings / Logout — never a dead click. GitHub autofill via the official public API; portfolio fetch with manual fallback. LinkedIn is a link only, never scraped. |
| 🛠️ `/tools/resume-matcher` | FREE, no login: Resume–JD Matcher + ATS analysis (score ring out of 100 + section bars: Contact, Summary, Experience, Skills, Education, Keywords, Formatting, Achievements, Readability, Action Verbs), skill-gap analysis, resume tailoring suggestions from your *real* experience only. |
| ✉️ `/tools/cover-letter` | FREE, no login: CV upload (.txt) + JD editor + live preview + download. Logged-in users can save it to an application. |
| 🔍 `/jobs/[slug]` | Public SEO job pages, e.g. "React Developer Jobs in Dhaka", "Remote Junior Frontend Jobs" — real feed results or an honest empty state. |
| 🛡️ `/admin` | Admin panel, ADMIN ONLY (plus existing moderators, see Roles below). User list (name, email, photo, join date only), role changes, enable/disable, keywords and sources. **Never** private tracker data. |
| 🌙 Dark mode | Day/Night toggle in the header, next to the avatar, saved per user, plus system-preference auto-detect. Theme tokens, so text, cards, borders, charts and badges all adapt. |
| 📱 Mobile | Mobile-installable (PWA-ready structure) + mobile bottom navigation on small screens. |

### ⏰ The follow-up rule (built in, exact)

```
Applied
  → Follow-up #1 = applied date + 10 days
  → Follow-up #2 = Follow-up #1 + 14 days
  → Maximum 2 per application, never more
```

Change the applied date and both follow-ups are recalculated automatically.
Dates use ONE format everywhere: e.g. "26 Oct 2026".

### 🔒 Privacy, by design

- **One user = one private tracker.** Every API query is filtered by your user id, server-side.
- **No session = no data.** Unauthenticated API calls return `401`.
- **No scraping, no auto-login, no auto-apply, no fake data.** New users start empty.
- **Admins never see private tracker data.** This is enforced on the backend, not just in the UI.

### 🛡️ Roles (v3, with one honest note)

- **Admin:** full access — user list, role changes, enable/disable, keywords/sources.
- **Member:** only their own data. The Admin link is **not rendered at all**
  for members (not hidden with CSS, not greyed out), and the server
  rejects any member request to `/admin` and to every admin API route.
- **Note:** the v3 prompt text says "admin and member only", but the
  MERGE RULES say keep every existing behaviour — and the live app
  already has moderators (view users + manage keywords/sources, no role
  changes, no disable, no private data). So moderators are kept in v3.
  If you want them removed later, it is a next-update change, not a
  silent hand-edit now.

---

## 🛠️ Technologies used

### Frontend

| Layer | Technology |
| --- | --- |
| Framework | Next.js 14 (App Router) + React 18 + TypeScript 5 |
| Styling | Tailwind CSS 3, shadcn-style UI components, orange `#EA580C` / `#F97316` + purple `#7C3AED` / `#8B5CF6` on `#F9FAFB`, bold orange-to-purple gradients inside pages too |
| Fonts (premium) | English: **Plus Jakarta Sans** · Bengali body: **Hind Siliguri** · Bengali headings: **Noto Serif Bengali** — via `next/font/google`, with Bengali fallback in the font stack. No generic-only fonts. |
| Charts | Recharts (donut + bar, client-only, every chart has a legend) |
| Toasts | react-toastify, top-right, auto-close in 3 seconds |
| Auth (client) | better-auth React client, Google social sign-in |
| API calls | `lib/api.ts` — every backend call goes through here, never directly to MongoDB |
| Hosting | Vercel (Frontend project, Framework Preset: Next.js, Root `./`) |

### Backend

| Layer | Technology |
| --- | --- |
| Runtime / language | Node.js 22 + TypeScript, **ESM only** (`"type": "module"`, `moduleResolution: NodeNext`, imports end in `.js`) |
| Framework | Express, running serverless on Vercel (no `listen()` in the Vercel entry, `api/index.ts` hands requests to the shared Express app) |
| Database | MongoDB Atlas + Mongoose (existing database and connection, unchanged) |
| Auth (server) | better-auth, Google OAuth only, secure cookies (`SameSite=None; Secure` on https, `Lax` on localhost) |
| Validation | zod (direct dependency, because better-auth needs it as a peer) |
| API style | REST API, JSON in `{ success: true, data }` / `{ success: false, message }` format. Every route is session-checked and filtered by user id. Full endpoint code is not listed here on purpose. |
| Feed sources | Keyless public APIs: Remotive, RemoteOK, Arbeitnow. Key-only sources (Adzuna, JSearch, Jooble, The Muse, Himalayas, We Work Remotely, Jobicy) are skipped when their key is absent — never faked, never scraped. LinkedIn has no public job API and is never scraped. |
| AI | Template/keyword mode when no AI key is set (no external AI call, no key in the browser). Match scores are explainable keyword overlap, never a hiring probability. |
| Hosting | Vercel (Backend project, serverless function) + GitHub (source + auto-deploy) + Google Cloud Console (OAuth client) |

---

## 📁 Project structure (frontend repo root)

```
app/
├── page.tsx             ← 🏠 Landing page (public, no redirect)
├── feed/                ← 📰 Job Feed (public)
├── (auth)/login/        ← 🔐 Google login page
├── dashboard/           ← 📊 Protected
├── applications/        ← 📝 Protected (Kanban | Table | Calendar)
├── follow-ups/          ← ⏰ Protected
├── linkedin/            ← 💼 Protected
├── projects/            ← 🚀 Protected
├── profile/             ← 👤 Protected
├── tools/
│   ├── resume-matcher/  ← 🛠️ Public free tool
│   └── cover-letter/    ← ✉️ Public free tool
├── jobs/[slug]/         ← 🔍 Public SEO pages
├── admin/               ← 🛡️ Protected, admin/moderator only
├── layout.tsx           ← Root layout + toasts + premium fonts + theme
└── globals.css          ← Tailwind + theme tokens + dark mode
components/
├── ui/                  ← button, card, dialog, input, select, table, badge
├── Navbar.tsx           ← Top navigation + avatar menu + dark toggle + EN/BN
├── Footer.tsx           ← Brand + Developed by Nahian Dev (no LinkedIn link)
├── Protected.tsx        ← Session guard → redirects to /login (skeleton)
├── BottomNav.tsx        ← Mobile bottom navigation
├── ThemeToggle.tsx      ← Dark mode toggle + theme init
├── KanbanBoard.tsx      ← Native drag-and-drop board
├── CalendarView.tsx     ← Month view of deadlines/interviews
├── DashboardCards.tsx
├── ApplicationForm.tsx
├── ApplicationTable.tsx
├── StatusBadge.tsx
├── Charts.tsx
└── Skeleton.tsx
lib/
├── api.ts               ← Backend API base URL + all calls
├── auth-client.ts       ← better-auth client (falls back to deployed server)
├── types.ts
├── date.ts              ← One date format: "26 Oct 2026"
├── theme.ts             ← Dark mode persistence
└── i18n.ts              ← EN/BN labels for nav, footer and Feed
├── .env.example         ← Copy to .env, fill NEXT_PUBLIC_API_URL
├── next.config.js
├── tailwind.config.js   ← darkMode: 'class' + font families
├── tsconfig.json
└── package.json         ← v3 adds NO new dependency
```

---

## 🚀 Quick start (local)

> Full guide (MongoDB, Google keys, first admin, demo data) is in the
> **server** README. Do that first, then come back here.

```bash
# 1. Copy env and set the backend URL
cp .env.example .env
# In .env, set:
#   NEXT_PUBLIC_API_URL=http://localhost:5000   (local)
#   NEXT_PUBLIC_API_URL=https://job-hunt-tracker-server.vercel.app   (deployed)

# 2. Install
npm install

# 3. Run
npm run dev
# Open http://localhost:3000  → landing page
# Click "Continue with Google" → sign in → Dashboard
```

```bash
# Production build check (what Vercel runs)
npm run build
npm run start
```

> ⚠️ After changing `.env`, **restart** the dev server — Next.js reads
> `NEXT_PUBLIC_*` variables at build/start time, not on every request.

---

## ☁️ Deploy on Vercel (frontend project — existing setup, no change)

| Setting | Value |
| --- | --- |
| Framework Preset | **Next.js** (not Other) |
| Root Directory | `./` — app files are at this repo's root |
| Build Command | Default (`next build`) — Override **OFF** |
| Output Directory | Default (`.next`) — Override **OFF** |
| Install Command | Default (`npm install`) |
| Environment Variable | `NEXT_PUBLIC_API_URL=https://job-hunt-tracker-server.vercel.app` |

Then **Redeploy**. Because `NEXT_PUBLIC_API_URL` is inlined at build time,
changing it always needs a new deployment.

> ❌ Do **not** copy the server's Build Command
> (`mkdir -p public && echo ... > public/placeholder.txt`) into this
> frontend project. That command is for the Express serverless project only.
> On the frontend it stops Next.js from building and the site returns 404.

### Live URLs

| | URL |
| --- | --- |
| 🌐 Frontend (this app) | https://job-hunt-tracker-kohl-eta.vercel.app/ |
| 🔌 Backend API | https://job-hunt-tracker-server.vercel.app/ |
| 🩺 Backend health | https://job-hunt-tracker-server.vercel.app/api/health |

---

## 🔑 Google login checklist (deployed)

If Google shows `Error 400: redirect_uri_mismatch`, the OAuth client in
Google Cloud Console is missing the exact deployed redirect:

- **Authorized JavaScript origins:**
  `https://job-hunt-tracker-kohl-eta.vercel.app`
- **Authorized redirect URIs:**
  `https://job-hunt-tracker-server.vercel.app/api/auth/callback/google`

No trailing slash, `https` (not `http`), origin = frontend, redirect = backend.
Save in Google Cloud Console, wait a few minutes for propagation, then try again.
Local values are `http://localhost:3000` (origin) and
`http://localhost:5000/api/auth/callback/google` (redirect).

---

## ⚠️ Errors we faced during this project (and how they were fixed)

Real errors from building and deploying this project, written down so
the next person does not repeat them.

### Frontend errors

| Error / symptom | Cause | Fix |
| --- | --- | --- |
| Vercel deployment is Ready, but site shows `404 NOT_FOUND`, build took only ~11s | Framework Preset was **Other** and the Build Command Override was the **server's** command, so Next.js never built | Framework Preset → **Next.js**, Build Command Override → **OFF** (default `next build`), then Redeploy |
| Login button did nothing, `/api/auth/sign-in/social` and `get-session` returned 404 | Frontend folder had only `.env.example`, no `.env`, so `NEXT_PUBLIC_API_URL` was empty and the auth client called the Next server itself | Set `NEXT_PUBLIC_API_URL` (local: `http://localhost:5000`, deployed: `https://job-hunt-tracker-server.vercel.app`) and redeploy — Next inlines it at build time |
| A false "Logged in successfully" toast on the login page | The login page toasted success before the Google redirect finished | Login page no longer toasts success on `signIn.social`; it shows the real error if sign-in fails |
| Google: `Error 400: redirect_uri_mismatch` | Google Cloud Console had the wrong / placeholder redirect URI, or frontend origin and backend redirect were mixed up | Origin = frontend, redirect = backend, no trailing slash, and `BETTER_AUTH_URL` on the server must also have no trailing slash |
| VS Code: `Cannot find module 'next' / 'react-toastify' / 'React / JSX'` | `node_modules` was missing in the new folder | Run `npm install` in the folder that has `package.json`, then Restart TS Server / reopen VS Code. Vercel is not affected — it installs itself |
| VS Code only: CSS import errors (`./globals.css`, `ReactToastify.css`) | Editor-only type errors for CSS side-effect imports | Do **not** delete those imports. Run `npm run dev` once; `npm run build` still passes |
| Changed env but site still calls the old backend | `NEXT_PUBLIC_*` is baked in at build time | Redeploy after every env change |
| v3: Feed/Profile/Tools pages called backend routes the backend did not have | Frontend and backend were built separately with different route names and response shapes | The v3 `lib/api.ts` maps backend shapes to frontend types, and the backend patch uses the exact contract in `MERGE_GUIDE.md`. Deploy **both** repos for v3 pages to work. |

### Backend errors

| Error / symptom | Cause | Fix |
| --- | --- | --- |
| `Cannot find module 'zod'` from better-auth, and `localhost:5000 refused to connect` | better-auth needs `zod` as a peer dependency, but it was not listed directly | Added `zod ^3.24.1` as a direct dependency in backend **and** frontend `package.json` |
| Vercel: `npm run build exited with 2`, then `STATIC_BUILD_NO_OUT_DIR` / `STATIC_BUILD_EMPTY_OUT_DIR` | The server is an API function, not a static site, but Vercel's default build expected a static output folder | Build Command (server project only): `mkdir -p public && echo "Job Hunt Tracker API" > public/placeholder.txt`. Do **not** use `index.html` in `public/` — it would hijack `/` away from the API function |
| Vercel live site: `500 FUNCTION_INVOCATION_FAILED` on every route, logs show `ERR_REQUIRE_ESM: require() of ES Module rou3/dist/index.mjs from better-call` | better-auth 1.2.12 → better-call 1.4.4 does `require("rou3")`, but rou3 is ESM-only. Local Node 24 supports `require(esm)`, so local tests passed while Vercel's older runtime failed | Converted the server to **ESM only** and never reverted to CommonJS: `package.json` `"type": "module"` + `"engines": { "node": "22.x" }`, `tsconfig` `module`/`moduleResolution` → `NodeNext`, every relative import ends with `.js`, local dev via `tsx watch src/index.ts` |
| Node 22 alone did **not** fix the ESM error | Vercel's CJS function runtime still could not `require()` the ESM module, even on Node 22 | The ESM-only conversion above was the real fix — do not try another Node version first |
| Server returns "MongoDB is NOT configured" / health shows `mongodbConnected: false` | `MONGODB_URI` (or another env var) was missing, or Vercel was reading `.env.example` | Vercel does **not** read `.env.example`. Set all 6 server env vars in the Vercel dashboard, no `PORT`: `MONGODB_URI`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `FRONTEND_URL`. MongoDB Atlas must allow `0.0.0.0/0` because Vercel has no fixed IP |
| PowerShell showed `>>` and nothing ran | Two commands were pasted at once, so PowerShell waited for more input | Press Ctrl+C, then run **one command at a time** |

### Known limits (not bugs)

- Vercel Hobby: cold start and a 10-second function timeout are possible.
- Safari / strict privacy settings may block third-party cookies even with `SameSite=None; Secure`.
- v3 Bangla/English toggle covers navigation, footer and Feed; other pages stay English in this patch.
- v3 Company Watch is a manual list; it does not automatically check career pages.
- v3 has no Team / Career Coach Workspace, no Chrome Extension, and no paid plan — by design, per the prompt.

---

## 🧰 Troubleshooting

| Problem | Fix |
| --- | --- |
| Frontend shows Vercel `404 NOT_FOUND` but deployment is Ready | Framework Preset must be **Next.js**, not Other. Build Command Override must be **OFF**. Then Redeploy. |
| Login button does nothing / stays on login | Backend is down, or `NEXT_PUBLIC_API_URL` points to the wrong server. Check `/api/health` on the backend first. |
| A v3 page (Feed/Profile/Tools) shows an error toast | The v3 backend may not be deployed yet. Deploy the server repo too, then retry. |
| `Cannot find module 'next'` in VS Code | `node_modules` is missing in this folder. Run `npm install` here, then Restart TS Server. This does not affect Vercel. |
| CSS import errors in VS Code only | Editor-only. Do **not** delete those imports. Run `npm run dev` once, use Workspace TypeScript version. |
| Changed env but site still calls old backend | Redeploy. `NEXT_PUBLIC_*` is baked in at build time. |
| Dark mode text looks invisible | The v3 theme tokens in `globals.css` + `darkMode: 'class'` in `tailwind.config.js` must both be copied. If only one was copied, copy the other and redeploy. |

---

## 🤝 Contributing / notes

- Frontend **never** talks to MongoDB directly — only to the backend API via `lib/api.ts`.
- Secrets live only in `.env` (git-ignored). `.env.example` contains placeholders only — never real keys.
- To add a page: create `app/<name>/page.tsx` (wrapped in `<Protected>` with `<Navbar>` for signed-in pages, plus `<Footer />` and `<BottomNav />`), add its API calls to `lib/api.ts`, and add a link in `Navbar.tsx` if it belongs in the menu.
- To add a backend route: create it in the server repo under `src/routes/`, mount it in `src/app.ts`, check the session with `requireAuth`, and filter **every** query by `userId`.

---

Developed by Nahian Dev — https://nahiyandev.vercel.app
