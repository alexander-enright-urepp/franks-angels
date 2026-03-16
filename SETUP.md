# Franks Angels Setup Instructions

## 1. Create GitHub Repository

Go to https://github.com/new and create a new repository called:
**`franks-angels`**

Make it public or private (your choice).

## 2. Connect and Push

After creating the repo, run these commands in your terminal:

```bash
cd /Users/alexenright/.openclaw/workspace/franks-angels
git remote add origin https://github.com/YOUR_USERNAME/franks-angels.git
git branch -M main
git push -u origin main
```

## 3. Set Up Supabase

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Name it: `franks-angels`
4. Choose a region close to you
5. Wait for the project to be created
6. Go to Project Settings → API
7. Copy the `URL` and `anon public` key

## 4. Configure Environment Variables

Create a `.env.local` file:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` and add your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 5. Deploy to Vercel

1. Go to https://vercel.com/new
2. Import your `franks-angels` GitHub repository
3. Add your environment variables from step 4
4. Click Deploy

Your app will be live at `https://franks-angels.vercel.app`

## Project Structure

```
franks-angels/
├── app/              # Next.js pages
├── components/       # React components
├── lib/             # Utilities (Supabase, etc.)
├── .env.local       # Environment variables (not committed)
└── README.md        # Documentation
```

## Next Steps

- [ ] Create GitHub repo
- [ ] Push code
- [ ] Set up Supabase project
- [ ] Deploy to Vercel
- [ ] Start building features!