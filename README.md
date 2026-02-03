# Student Prioritizer

Student Prioritizer is a small full-stack web application I built using **Next.js, Tailwind CSS and Supabase** for my college assessment.
The idea came from a real problem I personally noticed in engineering college — during assignment or practical submissions there is always a huge crowd near the teacher and it becomes difficult to track who came first. Sometimes students who arrive later get their work checked earlier.

This project solves that issue by creating a simple **priority-based submission system** where students submit details online and teachers can check assignments in the exact order they were received.

---

## What this project does

* Students can submit assignment details from their dashboard.
* Each submission automatically gets a **priority number** based on time.
* Teachers can see a clear ordered list (first come, first served).
* Teachers can mark assignments as **checked** and add notes.
* Students can see real-time status and notes without repeatedly asking the teacher.

---

## 🛠️ Tech Stack

* Next.js (App Router)
* React
* Tailwind CSS
* Supabase (Database + Backend)
* Vercel (Deployment)

---

## ⚙️ How to run locally

1. Install dependencies

```
npm install
```

2. Create `.env.local` file and add your Supabase keys:

```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

3. Run development server

```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📂 Project Structure (Important Files)

* `app/actions.js` → Server actions for database operations
* `app/student/page.jsx` → Student dashboard
* `app/teacher/page.jsx` → Teacher dashboard
* `lib/supabase.js` → Supabase client setup

---

## 💡 Why I built this

In real college submissions:

* Teachers cannot manage crowd order.
* Students keep asking "Sir/Ma'am, is my assignment checked?"
* No transparency in checking process.

This project tries to make that workflow more organized, fair and less stressful for both teachers and students.
