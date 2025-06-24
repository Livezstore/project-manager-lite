# Project Manager

A modern, full-stack project management dashboard for freelancers and small teams. Built with React, TypeScript, Supabase, and Tailwind CSS.

## Features

- 📋 **Project Tracking**: Create, update, and manage multiple projects.
- ✅ **Requirements Management**: Track requirements, priorities, and statuses for each project.
- 💸 **Payments**: Record, filter, and view payment history by project.
- 📅 **Meetings**: Schedule and document meetings, including participants and minutes.
- 🔒 **Authentication**: Secure login with Supabase Auth (no signup option for extra security).
- ⚡ **Real-time Data**: All CRUD operations are fully dynamic and synced with Supabase.
- 🪄 **Beautiful UI**: Responsive, modern interface with skeleton loading states and Taka (৳) currency support.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Supabase (Postgres, Auth, Realtime)
- **State Management**: React Context, React Query
- **Build Tooling**: Vite

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Naimur444/project-manager.git
cd project-manager
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Supabase

- Create a project at [Supabase](https://supabase.com/)
- Copy your Supabase URL and public anon key
- Create a `.env` file in your project root (see `.env.example` for format):

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

- Run the SQL in `supabase/migrations/` to set up your database schema and policies

### 4. Start the development server

```bash
npm run dev
```

Visit [http://localhost:8080](http://localhost:8080) to use the app.

## Folder Structure

- `src/components/` — UI and feature components
- `src/hooks/` — Custom React hooks for CRUD and data fetching
- `src/contexts/` — Auth context
- `src/integrations/supabase/` — Supabase client and types
- `supabase/migrations/` — Database schema and policies

## Customization

- Change the app name, logo, and branding in `index.html` and sidebar components.
- Update currency or localization as needed.

## License

MIT
