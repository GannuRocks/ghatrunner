# GhatRunner — Trek Booking (Next.js + Tailwind)

✅ Compatible with laptop/desktop/mobile  
✅ WhatsApp booking + UPI payment (QR + link)  
✅ Auto booking reference ID included in WhatsApp + UPI note

## Run locally
```bash
npm i
cp .env.example .env.local  # edit values
npm run dev                 # http://localhost:3000
```

## Build
```bash
npm run build && npm start
```

## Deploy to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/ghatrunner.git
git push -u origin main
```

## Deploy to Vercel (UI)
1) In Vercel, **Add New Project** → Import your GitHub repo.  
2) Set these env vars (same as `.env.local` below).  
3) Deploy.

## Deploy to Vercel (CLI)
```bash
npm i -g vercel
vercel login
vercel               # first deploy (link project)
vercel env add NEXT_PUBLIC_BRAND GhatRunner
vercel env add NEXT_PUBLIC_WHATSAPP_NUMBER 918261963374
vercel env add NEXT_PUBLIC_UPI_ID 8605657016-2@ybl
vercel env add NEXT_PUBLIC_UPI_NAME GhatRunner
vercel env add NEXT_PUBLIC_INSTAGRAM https://instagram.com/ghatrunner
vercel env add NEXT_PUBLIC_FACEBOOK https://facebook.com/ghatrunner
vercel env add NEXT_PUBLIC_YOUTUBE https://youtube.com/@ghatrunner
vercel env add NEXT_PUBLIC_WEBSITE https://ghatrunner.in
vercel --prod
```

## ENV
```
NEXT_PUBLIC_BRAND=GhatRunner
NEXT_PUBLIC_WHATSAPP_NUMBER=918261963374
NEXT_PUBLIC_UPI_ID=8605657016-2@ybl
NEXT_PUBLIC_UPI_NAME=GhatRunner
NEXT_PUBLIC_INSTAGRAM=https://instagram.com/ghatrunner
NEXT_PUBLIC_FACEBOOK=https://facebook.com/ghatrunner
NEXT_PUBLIC_YOUTUBE=https://youtube.com/@ghatrunner
NEXT_PUBLIC_WEBSITE=https://ghatrunner.in
```

## Where to edit
- Trek data: `lib/data.js`
- UI: `components/TrekApp.jsx`
- Branding/socials: `.env.local`
