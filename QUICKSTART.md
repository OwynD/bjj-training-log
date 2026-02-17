# Quick Start Guide

## Setup Instructions

### 1. Set Up Supabase Database

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for your project to be ready (this may take a few minutes)
3. Go to the **SQL Editor** in your Supabase dashboard
4. Copy and run all the SQL commands from [`DATABASE_SETUP.md`](./DATABASE_SETUP.md)
5. Verify the tables were created by going to **Table Editor**

### 2. Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy your **Project URL** (looks like `https://xxxxx.supabase.co`)
3. Copy your **anon/public key** (long string starting with `eyJ...`)

### 3. Configure Your App

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important**: Replace the values above with your actual Supabase credentials!

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### 6. Create Your First Account

1. Open [http://localhost:3000](http://localhost:3000) in your browser
2. You'll be redirected to the login page
3. Enter your email address
4. Check your email for the magic link
5. Click the link to sign in
6. You're in! Start logging sessions

## Common Issues

### "Invalid login credentials" or "No user found"

- Make sure you've run all the SQL commands from DATABASE_SETUP.md
- Check that the RLS policies are enabled
- Verify the trigger for creating profiles was created

### Magic link not working

- Check your spam folder
- Verify email settings in Supabase **Authentication** > **Email**
- Make sure the redirect URL is correct (should be `http://localhost:3000/auth/callback`)

### "Missing Supabase environment variables"

- Make sure `.env.local` file exists in the project root
- Verify the environment variable names match exactly
- Restart the development server after creating/updating `.env.local`

### Build errors

- Run `npm install` to ensure all dependencies are installed
- Delete `.next` folder and rebuild: `rm -rf .next && npm run build`

## Next Steps

Once you have the app running:

1. **Invite your team**: Share the login link with your training partners
2. **Log sessions**: Click "Log Session" in the navigation
3. **View the feed**: See what everyone's been training
4. **Track progress**: Check "My Log" for your personal stats

## Deployment to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project" and import your GitHub repository
4. Add your environment variables in the Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click "Deploy"

Your app will be live in minutes!

## Need Help?

Check the full [README.md](./README.md) for more detailed information and troubleshooting.
