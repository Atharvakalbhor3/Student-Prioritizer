# Student Prioritizer

A Next.js application that helps teachers manage student assignment submissions by prioritizing them based on who submitted first.

## Features

- **Landing Page**: Welcome page with login/signup options
- **Student Portal**: Students can submit assignment details (name, roll number, subject, assignment name)
- **Teacher Portal**: Teachers can view submissions in priority order (first come, first served)
- **Priority System**: Automatic numbering (1, 2, 3...) based on submission order
- **Assignment Checking**: Teachers can mark assignments as checked with a green tick
- **Notes System**: Teachers can add notes for each student, visible to the student
- **Server Actions**: All CRUD operations use Next.js Server Actions (no API routes)

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Set up Supabase

**Detailed instructions are in `SUPABASE_SETUP.md`**

Quick steps:
1. Create a new project at [supabase.com](https://supabase.com)
2. Get your Supabase URL and anon key from Project Settings > API
3. Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Schema

Run the SQL from `database_schema.sql` file in your Supabase SQL Editor.

**Tables Created:**
- `users` - Stores student and teacher accounts
- `submissions` - Stores assignment submissions with priority numbers

**Key Fields:**
- `priority` - Auto-incremented number (1, 2, 3...) based on submission order
- `is_checked` - Boolean flag for teacher to mark as checked
- `note` - Text field for teacher's notes

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage Flow

1. **Landing Page**: Visit the home page to see welcome message
2. **Sign Up**: Create an account as either a student or teacher
3. **Student Flow**:
   - Login as student
   - Fill form with: Name, Roll No, Subject, Assignment Name
   - Submit assignment (gets priority number automatically)
   - View submissions and teacher notes
4. **Teacher Flow**:
   - Login as teacher
   - See all submissions in priority order (1, 2, 3...)
   - Click "Mark as Checked" to add green tick
   - Add notes for students
   - Notes are visible to students

## Project Structure

```
├── app/
│   ├── actions.js          # Server actions for CRUD operations
│   ├── layout.jsx          # Root layout
│   ├── page.jsx            # Landing page
│   ├── login/page.jsx      # Login page
│   ├── signup/page.jsx     # Signup page
│   ├── student/page.jsx    # Student dashboard
│   └── teacher/page.jsx    # Teacher dashboard
├── lib/
│   └── supabase.js         # Supabase client
├── database_schema.sql     # SQL schema file
└── SUPABASE_SETUP.md       # Detailed setup guide
```

## Technologies Used

- **Next.js 14** - React framework with App Router
- **React** - UI library
- **Supabase** - Database (use Table Editor UI, no SQL needed!)
- **Tailwind CSS** - Styling
- **Server Actions** - For all database operations (no API routes)

## Important Notes

⚠️ **This is a demo project for assessment purposes.**
- Passwords are stored in plain text (use proper authentication in production)
- No Row Level Security (RLS) policies implemented
- Suitable for demonstration and learning purposes
