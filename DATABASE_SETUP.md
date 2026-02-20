# BJJ Training Log - Database Setup

## Supabase Configuration

### 1. Create Tables

Run the following SQL in the Supabase SQL Editor:

```sql
-- Create profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  display_name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create sessions table
create table public.sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date date not null,
  gym text not null,
  gi_type text not null check (gi_type in ('gi', 'nogi')),
  duration_min integer not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better query performance
create index sessions_user_id_idx on public.sessions(user_id);
create index sessions_created_at_idx on public.sessions(created_at desc);
create index sessions_date_idx on public.sessions(date desc);
```

### 2. Enable Row Level Security (RLS)

```sql
-- Enable RLS on both tables
alter table public.profiles enable row level security;
alter table public.sessions enable row level security;
```

### 3. Create RLS Policies

#### Profiles Policies

```sql
-- Allow users to read all profiles
create policy "Users can view all profiles"
  on public.profiles for select
  to authenticated
  using (true);

-- Allow users to insert their own profile
create policy "Users can insert own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

-- Allow users to update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);
```

#### Sessions Policies

```sql
-- Allow authenticated users to view all sessions
create policy "Authenticated users can view all sessions"
  on public.sessions for select
  to authenticated
  using (true);

-- Allow users to insert their own sessions
create policy "Users can insert own sessions"
  on public.sessions for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Allow users to update their own sessions
create policy "Users can update own sessions"
  on public.sessions for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Allow users to delete their own sessions
create policy "Users can delete own sessions"
  on public.sessions for delete
  to authenticated
  using (auth.uid() = user_id);
```

### 4. Create Profile Automatically On Signup (Optional)

This function creates a profile when a new user signs up:

```sql
-- Create function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

-- Create trigger for new user signup
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### 5. Configure Authentication

In your Supabase dashboard:

1. Go to **Authentication** > **Providers**
2. Enable **Email** provider
3. Disable **Confirm email** (or keep enabled for production)
4. Configure **Email Templates** for magic link (optional)

### 6. Get Your Credentials

From the Supabase dashboard:

1. Go to **Settings** > **API**
2. Copy your **Project URL** and **anon/public key**
3. Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Database Schema

### Tables

#### `profiles`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key, references auth.users.id |
| display_name | text | User's display name |
| created_at | timestamp | When the profile was created |

#### `sessions`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | Foreign key to auth.users.id |
| date | date | Date of the training session |
| gym | text | Name of the gym |
| gi_type | text | Either 'gi' or 'nogi' |
| duration_min | integer | Duration in minutes |
| notes | text | Optional notes about the session |
| created_at | timestamp | When the record was created |

## Testing Your Setup

Run this query to verify RLS is working:

```sql
-- This should return empty if not logged in
select * from sessions;

-- This should return empty if not logged in
select * from profiles;
```
