# BJJ Training Log

A private web application for tracking BJJ training sessions with your training group. Built with Next.js, TypeScript, TailwindCSS, and Supabase.

## Features

- 🔐 **Magic Link Authentication** - Passwordless login via email
- 📝 **Quick Session Logging** - Log sessions in under 60 seconds
- 👥 **Group Feed** - See what everyone's been training
- 📊 **Personal Log** - Track your progress with stats
- 🎨 **Dark Mode UI** - Mobile-first, responsive design
- 🔒 **Row Level Security** - Secure data with Supabase RLS

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, TailwindCSS
- **Backend**: Supabase (Auth, Postgres, RLS)
- **Hosting**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works great)

### 1. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once your project is ready, run the SQL commands from [DATABASE_SETUP.md](./DATABASE_SETUP.md) in the Supabase SQL Editor
3. Get your project credentials:
   - Go to **Settings** > **API**
   - Copy your **Project URL** and **anon/public key**

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace the values with your Supabase credentials from step 1.

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Create Your First User

1. Navigate to `/login`
2. Enter your email address
3. Check your email for the magic link
4. Click the link to sign in
5. You'll be automatically redirected to the feed

**Note**: The first time you sign in, a profile will be automatically created using your email address.

## Project Structure

```
/app
  /auth/callback     # Magic link callback handler
  /dashboard         # Redirects to /feed
  /feed              # Group feed page
  /login             # Login page
  /my-log            # Personal training log
  /sessions
    /new             # Log a new session
    /[id]            # Session detail page
  layout.tsx         # Root layout
  page.tsx           # Home (redirects to /feed)
  globals.css        # Global styles

/components
  Navigation.tsx     # Main navigation component
  SessionCard.tsx    # Session card component
  Toast.tsx          # Toast notification component

/lib
  /supabase
    client.ts        # Browser Supabase client
    server.ts        # Server Supabase client
    middleware.ts    # Session management
  database.types.ts  # TypeScript types from database

middleware.ts        # Route protection middleware
```

## Routes

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/login` | Login page | No |
| `/feed` | Group feed (all sessions) | Yes |
| `/my-log` | Your personal log | Yes |
| `/sessions/new` | Log a new session | Yes |
| `/sessions/[id]` | View session details | Yes |
| `/dashboard` | Redirects to `/feed` | Yes |

## Database Schema

### `profiles` Table
- `id` (uuid) - References auth.users.id
- `display_name` (text) - User's display name
- `created_at` (timestamp)

### `sessions` Table
- `id` (uuid) - Primary key
- `user_id` (uuid) - References auth.users.id
- `date` (date) - Training date
- `gym` (text) - Gym name
- `gi_type` (text) - Either 'gi' or 'nogi'
- `duration_min` (integer) - Duration in minutes
- `notes` (text, optional) - Session notes
- `created_at` (timestamp)

## Key Features Explained

### Authentication

- Magic link authentication via Supabase Auth
- No passwords required
- Protected routes via middleware
- Automatic session management

### Session Logging

Fast, intuitive form with:
- Date picker (defaults to today)
- Gym name input
- Gi/No-Gi toggle
- Duration in minutes
- Optional notes field

Target time: < 60 seconds from page load to submission

### Feed & Personal Log

- **Feed**: See all sessions from all users, newest first
- **My Log**: Your personal sessions with stats (total sessions, time, gi/nogi breakdown)
- Delete your own sessions
- View detailed session information

### Row Level Security (RLS)

All data is protected with Supabase RLS policies:
- Users can view all sessions and profiles
- Users can only create/edit/delete their own sessions
- Users can only edit their own profile

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [vercel.com](https://vercel.com)
3. Add your environment variables in the Vercel dashboard
4. Deploy!

Vercel will automatically:
- Build your Next.js app
- Set up continuous deployment
- Provide a production URL

### Environment Variables for Production

In your Vercel project settings, add:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Customization

### Changing the Theme

Edit colours in [tailwind.config.ts](./tailwind.config.ts) and [app/globals.css](./app/globals.css).

### Adding New Fields

1. Add column to database via Supabase SQL Editor
2. Update TypeScript types in [lib/database.types.ts](./lib/database.types.ts)
3. Update forms and components accordingly

### Email Templates

Customise magic link emails in Supabase:
- Go to **Authentication** > **Email Templates**
- Edit the "Magic Link" template

## Future Enhancements (Not in MVP)

Ideas for future development:
- Add rounds per session
- Link training partners (connected users)
- Weekly leaderboard
- Streak tracking
- Calendar view
- Technique tracking
- Training notes with rich text

## Troubleshooting

### Magic link not working

- Check your Supabase email settings
- Verify the redirect URL in Supabase is correct
- Check spam folder

### Sessions not showing in feed

- Verify RLS policies are set up correctly
- Check browser console for errors
- Ensure user is authenticated

### TypeScript errors

Run `npm install` to ensure all dependencies are installed.

## Support

For issues with:
- **Supabase**: Check [Supabase docs](https://supabase.com/docs)
- **Next.js**: Check [Next.js docs](https://nextjs.org/docs)
- **Deployment**: Check [Vercel docs](https://vercel.com/docs)

## License

This project is for private use by your training group.
