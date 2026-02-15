# Smart Bookmark App

Smart Bookmark App is a simple bookmark manager where users log in using Google and manage their personal bookmarks. Each user can only see and manage their own bookmarks, and updates appear in real-time.

## Live Application

https://smart-bookmark-app-nu-two.vercel.app

## GitHub Repository

https://github.com/Madan-dotcom/smart-bookmark-app

---

## Features

- Google OAuth login (no email/password)
- Add bookmarks using title and URL
- Bookmarks are private per user
- Delete bookmarks with confirmation popup
- Real-time updates across multiple tabs
- Logout functionality
- Responsive UI for desktop, tablet, and mobile
- Deployed on Vercel with live URL

---

## Tech Stack

- Next.js (App Router)
- Supabase (Authentication, Database, Realtime)
- Tailwind CSS
- Google OAuth
- Vercel Deployment

---

## Database Structure

Table: **bookmarks**

Fields:

- id
- title
- url
- user_id
- created_at

Row Level Security policies ensure each user accesses only their own bookmarks.

---

## Setup Instructions

### 1. Clone repository

```bash
git clone https://github.com/Madan-dotcom/smart-bookmark-app.git
```

## Setup Instructions

### 1. Install dependencies

```bash
npm install

2. Create .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

3.Run locally
npm run dev

Challenges Faced & Solutions

OAuth redirect issue after deployment was fixed by updating Supabase redirect URLs.

Real-time sync issues were solved by enabling Supabase realtime subscriptions.

SQL database setup and Row Level Security policies were challenging, and it was solved by correctly configuring Supabase policies to ensure each user accesses only their own bookmarks.


Future Improvements

Bookmark editing feature

Bookmark search and filtering

Bookmark categories

User profile customization

Author

Madan H
```
