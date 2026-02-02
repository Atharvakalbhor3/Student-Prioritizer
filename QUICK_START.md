# Quick Start Guide - Create Tables in Supabase

Follow these simple steps to set up your database:

## Step 1: Create Supabase Account & Project

1. Go to https://supabase.com
2. Sign up (it's free!)
3. Click **"New Project"**
4. Enter project name (e.g., "student-prioritizer")
5. Enter a database password (save it somewhere!)
6. Click **"Create new project"**
7. Wait 2-3 minutes for setup

## Step 2: Get Your API Keys

1. In your project dashboard, click **Settings** (gear icon) on left sidebar
2. Click **API** in the settings menu
3. Copy these two values:
   - **Project URL** (starts with `https://`)
   - **anon public key** (long string starting with `eyJ...`)

## Step 3: Add Keys to Your Project

1. In your project folder, create a file named `.env.local`
2. Add these lines (replace with your actual values):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 4: IMPORTANT (Use Supabase Auth)

You do **not** create a `users` table.

Supabase already provides **Auth → Users** automatically for login/signup.

So we only create:
- `profiles` (stores role)
- `submissions` (stores assignment queue)

## Step 5: Create Table 1 - `profiles`

1. In Supabase dashboard, click **"Table Editor"** on left sidebar
2. Click **"New Table"** button
3. Table name: `profiles` (lowercase, exactly like this)
4. Click **"Add Column"** and create these columns:

### Column 1: `id`
- Name: `id`
- Type: Select **`uuid`**
- ✅ Check **"Is Primary Key"**
- ❌ Uncheck **"Is Nullable"** (make it required)
- ⚠️ Do NOT set `gen_random_uuid()` because we will store the Auth user id here

### Column 2: `role`
- Name: `role`
- Type: Select **`text`**
- ❌ Uncheck **"Is Nullable"** (make it required)

### Column 3: `created_at`
- Name: `created_at`
- Type: Select **`timestamptz`**
- Default value: Type `now()`
- ✅ Leave **"Is Nullable"** checked (it's okay)

5. Click **"Save"** button at the top

## Step 6: Create Table 2 - `submissions`

1. Click **"New Table"** again
2. Table name: `submissions` (lowercase, exactly like this)
3. Click **"Add Column"** and create these columns:

### Column 1: `id`
- Name: `id`
- Type: **`uuid`**
- Default value: `gen_random_uuid()`
- ✅ Check **"Is Primary Key"**
- ❌ Uncheck **"Is Nullable"**

### Column 2: `student_id`
- Name: `student_id`
- Type: **`uuid`**
- Foreign Key: optional (you can skip FK in UI)
- ❌ Uncheck **"Is Nullable"**

### Column 3: `student_name`
- Name: `student_name`
- Type: **`text`**
- ❌ Uncheck **"Is Nullable"**

### Column 4: `roll_no`
- Name: `roll_no`
- Type: **`text`**
- ❌ Uncheck **"Is Nullable"**

### Column 5: `subject`
- Name: `subject`
- Type: **`text`**
- ❌ Uncheck **"Is Nullable"**

### Column 6: `assignment_name`
- Name: `assignment_name`
- Type: **`text`**
- ❌ Uncheck **"Is Nullable"**

### Column 7: `priority`
- Name: `priority`
- Type: **`int4`** (or **`integer`**)
- ✅ Leave **"Is Nullable"** checked (optional)

### Column 8: `is_checked`
- Name: `is_checked`
- Type: **`bool`** (or **`boolean`**)
- Default value: `false`
- ✅ Leave **"Is Nullable"** checked

### Column 9: `note`
- Name: `note`
- Type: **`text`**
- ✅ Leave **"Is Nullable"** checked (optional)

### Column 10: `submitted_at`
- Name: `submitted_at`
- Type: **`timestamptz`**
- Default value: `now()`
- ✅ Leave **"Is Nullable"** checked

### Column 11: `created_at`
- Name: `created_at`
- Type: **`timestamptz`**
- Default value: `now()`
- ✅ Leave **"Is Nullable"** checked

4. Click **"Save"** button

## Step 7: Test Your Setup

1. Go back to your project folder
2. Run: `npm install`
3. Run: `npm run dev`
4. Open: http://localhost:3000
5. Try signing up as a student or teacher!

In Supabase Dashboard you can verify:
- **Auth → Users**: shows created users
- **Table Editor → profiles**: shows their role

## ✅ You're Done!

Your database is ready! The app will automatically:
- Assign priority numbers (1, 2, 3...) when students submit
- Store all submissions
- Let teachers check assignments and add notes

## Troubleshooting

**Problem:** Can't find "Table Editor"?
- Look on the left sidebar, it's usually near the top

**Problem:** Can't find "New Table" button?
- Make sure you're in the Table Editor section
- It's usually a big button at the top or bottom

**Problem:** Foreign Key option not showing?
- Make sure you created the `users` table first
- Refresh the page and try again

**Problem:** App not connecting to database?
- Check your `.env.local` file has correct values
- Make sure you copied the keys correctly (no extra spaces)
- Restart your dev server after creating `.env.local`
