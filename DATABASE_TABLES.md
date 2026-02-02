# Database Tables - Simple Guide

## Login / Signup (Supabase Auth)

You do **not** create a custom `users` table.

Supabase Auth manages users automatically in **Auth → Users** when someone signs up with email + password.

## Table 1: `profiles`

**What it stores:** Only the user role (student/teacher) linked to the Supabase Auth user id.

**Columns to create:**

| Column Name | Type | Settings |
|-------------|------|----------|
| id | uuid | Primary Key (this will be the Auth user id) |
| role | text | Required ('student' or 'teacher') |
| created_at | timestamptz | Default: now() |

## Table 2: `submissions`

**What it stores:** Student assignment submissions

**Columns to create:**

| Column Name | Type | Settings |
|-------------|------|----------|
| id | uuid | Primary Key, Default: gen_random_uuid() |
| student_id | uuid | Stores Auth user id (you can skip FK in UI) |
| student_name | text | Required |
| roll_no | text | Required |
| subject | text | Required |
| assignment_name | text | Required |
| priority | int4 (integer) | Optional (auto-filled by app) |
| is_checked | bool | Default: false |
| note | text | Optional |
| submitted_at | timestamptz | Default: now() |
| created_at | timestamptz | Default: now() |

## How to Create in Supabase

1. Go to **Table Editor** in Supabase dashboard
2. Click **New Table**
3. Add columns one by one using the UI
4. No SQL needed - just use the visual interface!

## What Each Field Does

- **priority**: Gets number 1, 2, 3... based on who submitted first
- **is_checked**: Teacher clicks button → becomes true → green tick shows
- **note**: Teacher can write notes here, student can see them
