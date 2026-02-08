# ⚡ Quick Start - 5 Minutes to Launch

## 1️⃣ Install (30 seconds)
```bash
npm install
```

## 2️⃣ Add API Key (1 minute)
Create `.env.local` file:
```
OPENROUTER_API_KEY=sk-or-v1-your-key-here
```
Get key at: https://openrouter.ai/

## 3️⃣ Customize Content (2 minutes minimum, but take your time!)

### Open `app/page.tsx`

**Line ~8 - Your Story:**
```typescript
const LOVE_STORY = [
  {
    title: "Your Title",
    date: "Your Date",
    story: "Your actual story here...",
    // Keep icon and color as is
  },
  // 4 chapters total
];
```

**Line ~30 - What You Love:**
```typescript
const WHAT_I_LOVE = [
  { text: "Specific thing about Bhoomi...", emoji: "✨" },
  // 10 reasons total
];
```

**Line ~250 - The Letter:**
Replace the entire letter with YOUR words to Bhoomi.

## 4️⃣ Test (1 minute)
```bash
npm run dev
```
Open: http://localhost:3000

## 5️⃣ Deploy (2 minutes)

1. Push to GitHub
2. Go to vercel.com
3. Import your repo
4. Add `OPENROUTER_API_KEY` in settings
5. Deploy!

---

## ⚠️ CRITICAL

**Don't skip customization!** Generic content = no impact.

She needs to feel this is REALLY about her.

---

## 📖 Need More Help?

- **Detailed setup**: Read `SETUP.md`
- **What changed**: Read `WHAT_CHANGED.md`
- **Personal advice**: Read `HARSH_READ_THIS.md`

---

**You've got this! 💪**
