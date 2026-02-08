# 🚀 Quick Setup Guide - Make It Yours

## Step 1: Get It Running

```bash
# Install everything
npm install

# Create your environment file
# Copy this into .env.local:
OPENROUTER_API_KEY=your_api_key_here

# Run it locally
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Step 2: Get Your API Key

1. Go to [https://openrouter.ai/](https://openrouter.ai/)
2. Sign up (it's free)
3. Go to "Keys" section
4. Create a new key
5. Copy it into your `.env.local` file

**Note**: You get free credits to start. The AI features will generate personalized messages for Bhoomi.

## Step 3: Make It Personal (IMPORTANT!)

### Your Story Timeline

Open `app/page.tsx` and find `LOVE_STORY` (around line 8).

Replace with YOUR actual story:

```typescript
const LOVE_STORY = [
  {
    title: "The Day Everything Changed",
    date: "September 15, 2023", // Your actual date
    story: "I was at the coffee shop when you walked in. I remember thinking...",
    icon: "✨",
    color: "from-pink-500/20 to-purple-500/20"
  },
  {
    title: "Our First Real Conversation",
    date: "A week later",
    story: "We talked for hours about everything and nothing. I realized...",
    icon: "💭",
    color: "from-purple-500/20 to-blue-500/20"
  },
  // Add 2-4 chapters total
];
```

**Tips:**
- Be specific with dates and details
- Include how YOU felt, not just what happened
- 4 chapters is perfect - not too short, not overwhelming

### What You Love About Her

Find `WHAT_I_LOVE` (around line 30).

**Replace with REAL things about Bhoomi:**

```typescript
const WHAT_I_LOVE = [
  { 
    text: "How you scrunch your nose when you're concentrating on something", 
    emoji: "✨" 
  },
  { 
    text: "The way you remember tiny details about conversations we had months ago", 
    emoji: "💝" 
  },
  { 
    text: "Your terrible jokes that somehow always make me laugh anyway", 
    emoji: "😊" 
  },
  // Add 8-10 total
];
```

**Tips:**
- Mix big things and small things
- Include quirks and imperfections (they're endearing!)
- Be specific - "your laugh" is generic, "how you laugh at your own jokes before finishing them" is personal

### The Letter

Find the letter section (around line 250).

**Rewrite it in YOUR voice:**

```typescript
<p className="text-gray-200 leading-relaxed mb-6">
  Bhoomi,
</p>
<p className="text-gray-200 leading-relaxed mb-6">
  [Your actual words here. Be honest. Be vulnerable. Tell her what she means to you.]
</p>
```

**Tips:**
- Write like you're talking to her, not writing an essay
- It's okay to be nervous or imperfect in your words
- Share a fear or vulnerability - it shows trust
- End with hope for the future

## Step 4: Optional Enhancements

### Add Background Music

1. Find a song that's meaningful to you both
2. Convert it to MP3
3. Name it `love.mp3`
4. Put it in the `public/` folder

**Suggestions:**
- Your song (if you have one)
- A song from a meaningful moment
- Instrumental/acoustic versions are less distracting

### Add Photos (Optional)

You can add a photo gallery section. Add this to `app/page.tsx`:

```typescript
{/* Add after the "What I Love" section */}
<section className="py-20 px-6">
  <div className="max-w-6xl mx-auto">
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent"
    >
      Our Moments
    </motion.h2>
    
    <div className="grid md:grid-cols-3 gap-6">
      <motion.img 
        src="your-image-url.jpg" 
        alt="Us"
        className="rounded-2xl w-full h-64 object-cover"
        whileHover={{ scale: 1.05 }}
      />
      {/* Add more images */}
    </div>
  </div>
</section>
```

**For image hosting**, use:
- [imgbb.com](https://imgbb.com/) - Free, easy
- [imgur.com](https://imgur.com/) - Popular, reliable

## Step 5: Test Everything

1. **Read through it as if you're Bhoomi**
   - Does it feel genuine?
   - Are there any typos?
   - Does it flow well?

2. **Test on mobile**
   - Open on your phone
   - Check that everything is readable
   - Make sure scrolling is smooth

3. **Test the AI feature**
   - Click "Click for a special message"
   - Make sure it generates properly
   - Try it a few times to see variety

## Step 6: Deploy It

### Option 1: Vercel (Recommended - Free & Easy)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repo
5. Add environment variable: `OPENROUTER_API_KEY`
6. Click "Deploy"

**You'll get a URL like**: `your-site.vercel.app`

### Option 2: Custom Domain (Optional)

Buy a domain like `forbhoomi.com` or `harsh-and-bhoomi.com`:
- [Namecheap](https://www.namecheap.com/) - ~$10/year
- Connect it to Vercel in settings

## Step 7: Share It With Her

### Timing Matters
- **Good times**: Evening when she's relaxed, weekend morning
- **Bad times**: When she's stressed, busy, or distracted

### How to Share
- **Text**: "Hey, I made something for you. Take your time with it when you have a quiet moment: [link]"
- **In person**: "I want to show you something I made for you"

### After She Sees It
- **Be available** to talk about it
- **Don't pressure** her for an immediate reaction
- **Be open** to her response, whatever it is

## 🎯 Final Checklist

Before you share:

- [ ] All personal details are updated (names, dates, stories)
- [ ] Letter is rewritten in your own words
- [ ] "What I Love" list is specific to Bhoomi
- [ ] Tested on mobile and desktop
- [ ] AI feature works
- [ ] No typos or errors
- [ ] Music file added (optional)
- [ ] Deployed and link works
- [ ] You're ready to be vulnerable and honest

## 💡 Remember

**This is not about perfection.** It's about showing Bhoomi that you:
- Pay attention to who she is
- Value her enough to put in effort
- Are willing to be vulnerable
- See a future with her

The imperfections make it real. The effort makes it meaningful. The honesty makes it powerful.

## 🆘 Need Help?

**Common Issues:**

1. **"npm install" fails**
   - Delete `node_modules` folder
   - Delete `package-lock.json`
   - Run `npm install` again

2. **AI not generating**
   - Check `.env.local` exists in root folder
   - Verify API key has no extra spaces
   - Make sure you have credits on OpenRouter

3. **Deployment fails**
   - Make sure all files are committed to GitHub
   - Check that environment variables are set in Vercel
   - Look at the deployment logs for specific errors

4. **Styling looks broken**
   - Clear browser cache
   - Try incognito/private mode
   - Check that `app/globals.css` exists

---

**You've got this, Harsh.** 

Be genuine. Be yourself. Let her see your heart.

That's what will make the difference. ❤️
