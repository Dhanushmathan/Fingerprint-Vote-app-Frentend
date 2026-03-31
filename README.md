# 🗳️ VoteSecure — We Vote Fingerprint Voteing App

> **React 18 · Tailwind CSS · Vite · TanStack Query · React Router**

Modern, fully responsive digital voting portal with fingerprint biometric UI, OTP verification flow, live results, and party/voter registration.

---

## 📁 Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Layout.jsx               # Sidebar + topbar + mobile drawer + bottom nav
│   │   ├── FingerprintScanner.jsx   # Animated biometric scanner UI
│   │   ├── OtpInput.jsx             # 6-box OTP input with paste support
│   │   ├── CandidateCard.jsx        # Candidate card (selected/voted/locked states)
│   │   ├── VoteConfirmModal.jsx     # FP scan modal before vote submit
│   │   ├── AlreadyVotedModal.jsx    # Duplicate vote alert (red border modal)
│   │   └── SuccessOverlay.jsx       # Vote success screen with receipt
│   ├── pages/
│   │   ├── PartyRegistration.jsx    # Register parties + candidates
│   │   ├── VoterRegistration.jsx    # Register voters (standalone page)
│   │   ├── CastVote.jsx             # Full voting flow (inline registration too)
│   │   ├── LiveResults.jsx          # Animated real-time results
│   │   └── AdminPanel.jsx           # Voter log + election controls
│   ├── services/
│   │   └── api.js                   # Axios instance + all API calls
│   ├── utils/
│   │   └── helpers.js               # initials, colorMap, formatDateTime
│   ├── App.jsx                      # Routes
│   ├── main.jsx                     # Entry point
│   └── index.css                    # Tailwind + custom CSS
├── .env.example                     # Environment variable template
├── .env.production                  # Production env (Vercel)
├── vercel.json                      # SPA routing + security headers
├── tailwind.config.js               # Custom breakpoints + colors
├── vite.config.js                   # Vite + proxy config
└── package.json
```

---

## ⚙️ Prerequisites

| Tool    | Version | Download |
|---------|---------|----------|
| Node.js | 18+     | https://nodejs.org |
| Vite    | 8+      | https://vite.dev/  |
| npm     | 9+      | Included with Node |

---

## 🚀 Local Setup

### Step 1 — Install dependencies

```bash
cd frontend
npm install
```

### Step 2 — Environment setup

```bash
# Copy the example file
cp .env.example .env.local
```

Edit `.env.local`:
```env
# Local backend
VITE_API_URL=http://localhost:8080

# OR point to deployed backend
VITE_API_URL=https://fingerprint-vote-app-backend.onrender.com
```

### Step 3 — Run

```bash
npm run dev
```

✅ Frontend starts at: **http://localhost:5173**

---

## 📱 Responsive Breakpoints

| Breakpoint | Width   | Layout                                    |
|------------|---------|-------------------------------------------|
| `xs`       | 375px   | Mobile (small phones)                     |
| `sm`       | 640px   | Mobile (large phones) — bottom nav        |
| `md`       | 768px   | Tablet — hamburger menu                   |
| `lg`       | 1024px  | Laptop — full sidebar visible             |
| `xl`       | 1280px  | Desktop — full layout                     |
| `2xl`      | 1536px  | Large screens                             |

### Screen-wise behavior:
- **Mobile (< 640px):** Bottom navigation bar, sidebar as slide-in drawer
- **Tablet (640–1024px):** Hamburger menu, stacked layouts
- **Desktop (1024px+):** Full sidebar always visible, side-by-side layouts

---

## 🎨 Design System

### Party Color Themes
| Code  | Background | Text Color |
|-------|------------|------------|
| `sw1` | `#ede9fe`  | `#7c3aed`  |
| `sw2` | `#dbeafe`  | `#1d4ed8`  |
| `sw3` | `#dcfce7`  | `#15803d`  |
| `sw4` | `#fef3c7`  | `#b45309`  |
| `sw5` | `#fee2e2`  | `#b91c1c`  |
| `sw6` | `#e0f2fe`  | `#0369a1`  |
| `sw7` | `#f3e8ff`  | `#7e22ce`  |
| `sw8` | `#fce7f3`  | `#be185d`  |

---

## 🔄 Voting Flow (User Journey)

```
1. Party Registration    → Admin registers parties + candidates
                                    ↓
2. Voter Registration    → Admin registers voters with FP enrollment
                                    ↓
3. Cast Vote Page
   ├── New Voter?        → "Register & Vote" inline accordion
   │   └── Fill form → FP scan → auto-fill Voter ID → proceed
   │
   ├── Enter Voter ID + Mobile
   ├── Send OTP → OTP auto-filled (dev mode) → Verify
   ├── Fingerprint Scan → identity confirmed
   ├── Select Candidate
   ├── FP Confirm Modal → vote cast
   └── Success Screen + Blockchain Receipt
                                    ↓
4. Live Results          → Animated bars, rankings, biometric stats
```

---

## 🛡️ One-Vote Enforcement (Frontend)

```
OTP Verify        → DO NOT check hasVoted here
                        ↓
FP Scan Success   → Fetch voter from backend
                        ↓
                  hasVoted = true?
                  ├── YES → Show AlreadyVotedModal 🚫
                  │         (who voted, when, party)
                  └── NO  → Show candidates, enable voting ✅

Candidate click   → hasVoted = true? → Show AlreadyVotedModal
Cast Vote button  → FP Confirm Modal → backend validates again
```

---

## 🌐 Environment Variables

| Variable       | Required | Description                        |
|----------------|----------|------------------------------------|
| `VITE_API_URL` | ✅ Yes   | Backend base URL (no trailing `/`) |

### For different environments:

```bash
# .env.local (local dev — gitignored)
VITE_API_URL=http://localhost:8080

# .env.production (Vercel auto-uses this on build)
VITE_API_URL=https://fingerprint-vote-app-backend.onrender.com
```

> ⚠️ All Vite env variables must start with `VITE_` to be accessible in browser.

---

## ☁️ Deploy on Vercel (Free)

### Step 1 — Push to GitHub
```bash
git add .
git commit -m "VoteSecure frontend"
git push origin main
```

### Step 2 — Vercel Setup
1. Go to **https://vercel.com** → New Project
2. Import your GitHub repo
3. Set **Root Directory** = `frontend`
4. Framework preset = **Vite** (auto-detected ✅)
5. Add Environment Variable:

```
Name:  VITE_API_URL
Value: https://your-backend.onrender.com
```

### Step 3 — Deploy
Click **Deploy** → ~1 min → Frontend live! ✅

Frontend URL: `https://fingerprint-vote-app-frentend.vercel.app`

### Step 4 — Update Backend CORS
Add your Vercel URL to backend `CORS_ORIGINS` env var:
```
CORS_ORIGINS=https://fingerprint-vote-app-frentend.vercel.app,http://localhost:5173
```
> ⚠️ No spaces after comma!

---

## 📦 Build for Production

```bash
npm run build
```

Output in `/dist` folder — ready to deploy anywhere.

```bash
# Preview production build locally
npm run preview
```

---

## 🛠️ Common Errors & Fixes

### CORS Error in Browser
```
Access to XMLHttpRequest blocked by CORS policy
```
**Fix:** Make sure `VITE_API_URL` is set correctly in Vercel env vars.
And backend `CORS_ORIGINS` includes your Vercel URL without spaces.

### Blank Page after Deploy
```
Cannot GET /vote
```
**Fix:** `vercel.json` already handles this with SPA rewrite:
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```
If still blank — check if `vercel.json` is in the `frontend/` folder.

### OTP Not Auto-filling
Auto-fill works only in dev mode — backend response includes OTP in message:
```
"OTP sent to ****3210 (dev: 483920)"
```
In production, OTP is sent via SMS — manual entry required.

### API calls going to wrong URL
Check browser Network tab → Request URL should be:
```
✅ https://fingerprint-vote-app-backend.onrender.com/api/parties
❌ /api/parties  (missing VITE_API_URL)
```
If wrong → check `.env.production` or Vercel env variable.

---

## 📜 Available Scripts

| Command           | Description                    |
|-------------------|--------------------------------|
| `npm run dev`     | Start dev server (port 5173)   |
| `npm run build`   | Production build → `/dist`     |
| `npm run preview` | Preview production build       |

---

## 📦 Key Dependencies

| Package              | Version | Purpose                         |
|----------------------|---------|---------------------------------|
| `react`              | 18.2    | UI library                      |
| `react-router-dom`   | 6.x     | Client-side routing             |
| `axios`              | 1.6     | HTTP client                     |
| `@tanstack/react-query` | 5.x  | Server state + caching          |
| `react-hot-toast`    | 2.4     | Toast notifications             |
| `lucide-react`       | 0.344   | Icons                           |
| `tailwindcss`        | 4.1     | Utility-first CSS               |
| `vite`               | 8.0.2     | Build tool                      |

---

*VoteSecure Frontend — Built with React 18 + Tailwind CSS* 💜