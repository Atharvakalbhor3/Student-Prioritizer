# Supabase Setup Guide - Simple Steps

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in (it's free!)
3. Click "New Project"
4. Fill in project name and password
5. Wait 2-3 minutes for project to be ready

## Step 2: Get Your API Keys

1. In your project dashboard, click the **Settings** icon (gear) on the left
2. Click **API** in the settings menu
3. Copy these two things:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public key** (long string starting with `eyJ...`)

## Step 3: Create Environment File

Create a file named `.env.local` in your project root folder:

```env
NEXT_PUBLIC_SUPABASE_URL=paste_your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste_your_anon_key_here
```

## Step 4: Create Tables Using Supabase UI (No SQL Needed!)

### IMPORTANT (Login/Signup)

You **do not** create a `users` table for login.

Supabase already has a built-in table for authentication called **Auth → Users** (it’s managed automatically when you sign up with email/password).

So we only create:
- `profiles` (to store role: student/teacher)
- `submissions` (assignment queue)

### Create First Table: `profiles`

1. In Supabase dashboard, click **Table Editor** on the left sidebar
2. Click **New Table**
3. Name it: `profiles`
4. Click **Add Column** and add these columns one by one:

   **Column 1:**
   - Name: `id`
   - Type: `uuid`
   - ✅ Check: **Is Primary Key**
   - ❌ Do NOT set `gen_random_uuid()` here (we will store the Auth user id)

   **Column 2:**
   - Name: `role`
   - Type: `text`
   - Check: **Is Nullable** (uncheck this - make it required)

   **Column 3:**
   - Name: `created_at`
   - Type: `timestamptz`
   - Default value: `now()`

5. Click **Save** button

### Create Second Table: `submissions`

1. Click **New Table** again
2. Name it: `submissions`
3. Add these columns:

   **Column 1:**
   - Name: `id`
   - Type: `uuid`
   - Default value: `gen_random_uuid()`
   - Check: **Is Primary Key**

   **Column 2:**
   - Name: `student_id`
   - Type: `uuid`
   - (Optional) Foreign Key: you can skip FK in UI. We store the Auth user id here.

   **Column 3:**
   - Name: `student_name`
   - Type: `text`
   - Required (uncheck nullable)

   **Column 4:**
   - Name: `roll_no`
   - Type: `text`
   - Required

   **Column 5:**
   - Name: `subject`
   - Type: `text`
   - Required

   **Column 6:**
   - Name: `assignment_name`
   - Type: `text`
   - Required

   **Column 7:**
   - Name: `priority`
   - Type: `int4` (integer)
   - Can be nullable (leave it checked)

   **Column 8:**
   - Name: `is_checked`
   - Type: `bool` (boolean)
   - Default value: `false`

   **Column 9:**
   - Name: `note`
   - Type: `text`
   - Can be nullable (leave it checked)

   **Column 10:**
   - Name: `submitted_at`
   - Type: `timestamptz`
   - Default value: `now()`

   **Column 11:**
   - Name: `created_at`
   - Type: `timestamptz`
   - Default value: `now()`

4. Click **Save** button

## That's It! 🎉

Your database is ready! Now you can:
1. Run `npm install` in your project
2. Run `npm run dev`
3. Open `http://localhost:3000`
4. Start using the app!

## Quick Test

After creating tables, you can test by:
1. Start the app and use **Sign Up** (student/teacher)
2. Supabase will create the Auth user automatically
3. The app will also create a `profiles` row with your role
