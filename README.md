# 🧡💜 Job Hunt Tracker — Frontend

> **Your job hunt, finally organised.**
> Track every application, every follow-up, and every LinkedIn win — in one beautiful, private dashboard.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![React](https://img.shields.io/badge/React-18-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38BDF8)
![License](https://img.shields.io/badge/Private-Personal_Use-orange)

This folder is the **frontend app only** (Next.js App Router).
The backend lives in a separate repo/folder: `job-hunt-tracker-server`
(Express + MongoDB + better-auth). The full setup guide, backend steps,
admin steps and demo-data import steps are in that server folder's
`README.md` — **start from there** if you are setting up the whole project.

---

## ✨ What you get

| Page | What it does |
| --- | --- |
| 🏠 `/` — Landing page | Public home page. No login forced. Explains the app, shows features, and links to Login / Dashboard. |
| 🔐 `/login` | Google-only sign-in. One button: **Continue with Google**. |
| 📊 `/dashboard` | Stat cards, next follow-up, LinkedIn totals (live SUM), pie chart (Applied / Lead / Closed), bar chart (LinkedIn comments per day). |
| 📝 `/applications` | Add, edit, filter and track every application. |
| ⏰ `/follow-ups` | Follow-ups due, mark done. See the rule below. |
| 💼 `/linkedin` | Log LinkedIn activity per day, watch the chart grow. |
| 🚀 `/projects` | Projects, links and notes for interviews. |
| 🛡️ `/admin` | Admin / moderator view. Roles, keywords and sources — **without** private tracker data. |

### ⏰ The follow-up rule (built in, exact)

```
Applied
  → Follow-up #1 = applied date + 10 days
  → Follow-up #2 = Follow-up #1 + 14 days
  → Maximum 2 per application, never more
```

Change the applied date and both follow-ups are recalculated automatically.

### 🔒 Privacy, by design

- **One user = one private tracker.** Every API query is filtered by your user id.
- **No session = no data.** Unauthenticated API calls return `401`.
- **No scraping, no auto-login, no auto-apply, no fake data.** New users start empty.
- **Admins never see private tracker data.** Moderators can view users and
  manage keywords/sources, but cannot change roles, disable users, or see
  private tracker data. This is enforced on the backend, not just in the UI.

---

## 🛠️ Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 14 (App Router) + React 18 + TypeScript |
| Styling | Tailwind CSS 3, shadcn-style UI components, orange `#EA580C` / `#F97316` + purple `#7C3AED` / `#8B5CF6` on `#F9FAFB` |
| Charts | Recharts (pie + bar, client-only) |
| Toasts | react-toastify, top-right, auto-close in 3 seconds |
| Auth (client) | better-auth React client, Google social sign-in |
| API calls | `lib/api.ts` — every backend call goes through here, never directly to MongoDB |

## 📁 Project structure

```
job-hunt-tracker/            ← this folder (frontend repo root on Vercel)
├── app/
│   ├── page.tsx             ← 🏠 Landing page (public, no redirect)
│   ├── (auth)/login/        ← 🔐 Google login page
│   ├── dashboard/           ← 📊 Protected
│   ├── applications/        ← 📝 Protected
│   ├── follow-ups/          ← ⏰ Protected
│   ├── linkedin/            ← 💼 Protected
│   ├── projects/            ← 🚀 Protected
│   ├── admin/               ← 🛡️ Protected
│   ├── layout.tsx           ← Root layout + toasts
│   └── globals.css          ← Tailwind + light theme
├── components/
│   ├── ui/                  ← button, card, dialog, input, select, table, badge
│   ├── Navbar.tsx           ← Top navigation (logged-in pages)
│   ├── Protected.tsx        ← Session guard → redirects to /login
│   ├── DashboardCards.tsx
│   ├── ApplicationForm.tsx
│   ├── ApplicationTable.tsx
│   ├── StatusBadge.tsx
│   └── Charts.tsx
├── lib/
│   ├── api.ts               ← Backend API base URL + all calls
│   ├── auth-client.ts       ← better-auth client (falls back to deployed server)
│   └── types.ts
├── .env.example             ← Copy to .env, fill NEXT_PUBLIC_API_URL
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 🚀 Quick start (local)

> Full guide (MongoDB, Google keys, first admin, demo data) is in the
> **server** `README.md`. Do that first, then come back here.

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

## ☁️ Deploy on Vercel (frontend project)

| Setting | Value |
| --- | --- |
| Framework Preset | **Next.js** (not Other) |
| Root Directory | `./` — app files are at this repo's root |
| Build Command | Default (`next build`) — Override **OFF** |
| Output Directory | Default (`.next`) — Override **OFF** |
| Install Command | Default (`npm install`) |
| Environment Variable | `NEXT_PUBLIC_API_URL=https://job-hunt-tracker-server.vercel.app` |

Then **Redeploy**. Because `NEXT_PUBLIC_API_URL` is inlined at build time,
changing it always needs a new deployment — a plain env change alone is not enough.

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

## 🧰 Troubleshooting

| Problem | Fix |
| --- | --- |
| Frontend shows Vercel `404 NOT_FOUND` but deployment is Ready | Framework Preset must be **Next.js**, not Other. Build Command Override must be **OFF**. Then Redeploy. |
| Login button does nothing / stays on login | Backend is down, or `NEXT_PUBLIC_API_URL` points to the wrong server. Check `/api/health` on the backend first. |
| `Cannot find module 'next'` in VS Code | `node_modules` is missing in this folder. Run `npm install` here, then Restart TS Server. This does not affect Vercel (Vercel installs itself). |
| CSS import errors in VS Code only (`./globals.css`, `ReactToastify.css`) | Editor-only. Do **not** delete those imports. Run `npm run dev` once, use Workspace TypeScript version. `npm run build` still passes. |
| Changed env but site still calls old backend | Redeploy. `NEXT_PUBLIC_*` is baked in at build time. |

---

## 🤝 Contributing / notes

- Frontend **never** talks to MongoDB directly — only to the backend API via `lib/api.ts`.
- Secrets live only in `.env` (git-ignored). `.env.example` contains placeholders only — never real keys.
- To add a page: create `app/<name>/page.tsx` (wrapped in `<Protected>` with `<Navbar>`), add its API calls to `lib/api.ts`, and add a link in `Navbar.tsx` if it belongs in the menu.
