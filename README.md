# Mehdi Nourzadeh — Portfolio

A recruiter-first portfolio built with Next.js App Router, TypeScript, Supabase PostgreSQL/Auth/Storage, and a private admin CMS. Includes light/dark theme switching and a downloadable resume.

## Included
- Responsive public homepage, projects index, project case-study pages, experience, about, and contact form.
- Theme toggle (preference saved in local storage).
- Resume PDF at `/files/mehdi-nourzadeh-resume.pdf`.
- Supabase-backed content queries with local fallback content for a usable preview before configuring Supabase.
- Admin sign-in and project create/edit/delete/publish workflows.
- Initial SQL migration with RLS and an admin allowlist table.

## Local setup
1. Install Node.js 20.9+ and run `npm install`.
2. Copy `.env.example` to `.env.local` and fill in Supabase project URL, publishable/anon key, and the server-only service-role key for contact submissions. Without these values, the public pages use the bundled seed content; admin/database operations require Supabase configuration.
3. In Supabase SQL Editor, run `supabase/migrations/0001_initial_schema.sql`.
4. Create your own Supabase Auth user in the Supabase dashboard, then insert that user UUID into `public.admin_users` using the SQL editor. Example: `insert into public.admin_users(user_id) values ('YOUR-AUTH-USER-UUID');` Do not enable public registration.
5. Run `npm run dev` and open `http://localhost:3000`.

## Important production checklist
- Configure Supabase Auth redirect URLs for local and deployed domains.
- Set `NEXT_PUBLIC_SITE_URL` to the real site URL.
- Review RLS policies and storage policies against your final schema before publishing.
- Set up the `portfolio-media` storage bucket as public for published project imagery; apply the migration's storage policy. Do not upload private files into a public bucket.
- Add rate limiting / CAPTCHA to the contact endpoint before promoting it widely. The contact endpoint validates input and stores messages using a server-only service-role key; add provider-level rate limiting and CAPTCHA before production.
- Run `npm run typecheck`, `npm run lint`, and `npm run build`.
- This bundle is not deployed and is not connected to your Supabase project yet.

## Content editing
After signing in at `/admin/login`, use `/admin/projects` to add, edit, publish, or delete projects. The profile, experience, skills, and education schema is ready; their admin CRUD screens can be added as a follow-up. Seed content is based on the resume and project details available in the conversation and can be revised from the CMS as it expands.
