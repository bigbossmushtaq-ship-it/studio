# TuneFlow - A Next.js Music Player

This is a complete music player application built with Next.js, Tailwind CSS, and Supabase.

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Set Up Environment Variables**:
    Create a `.env.local` file in the root of your project and add your Supabase project URL and anon key:

    ```
    NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
    ```

3.  **Run the Development Server**:
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

-   User authentication (Email/Password) via Supabase Auth.
-   Song and album art hosting via Supabase Storage.
-   A persistent mini-player that continues playback across pages.
-   A full-screen player with advanced controls and animations.
-   Dynamic background colors extracted from album art.
-   Swipe gestures for track navigation.
-   Global state management for audio playback.
