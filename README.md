# Franks Angels

A modern web application built with Next.js, React, TypeScript, TailwindCSS, and Supabase.

## Tech Stack

- **Frontend:** Next.js 14 + React + TypeScript
- **Styling:** TailwindCSS
- **Backend:** Supabase (Auth, Database, Storage)
- **Deployment:** Vercel

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   ```
   Then add your Supabase credentials to `.env.local`

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This app is configured for deployment on Vercel. Connect your GitHub repository to Vercel for automatic deployments.

## Project Structure

- `/app` - Next.js app router pages
- `/components` - React components
- `/lib` - Utility functions and configurations
- `/.env.local` - Environment variables (not committed)