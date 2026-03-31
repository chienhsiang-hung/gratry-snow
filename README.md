# Gratry Snow

This is a project built with Next.js, Supabase, and Tailwind CSS.

## ✨ Features

*   **User Authentication:** User registration and login using Supabase.
*   **Internationalization:** Implemented using `next-intl`.
*   **Video Upload & Processing:** Supports video uploads and processing with `ffmpeg`.
*   **User Profiles:** Users can view their profiles and uploaded content.

## 🚀 Getting Started

Follow these instructions to set up and run the project in your local environment.

### 📋 Prerequisites

*   [Node.js](https://nodejs.org/) (v18.x or later recommended)
*   [npm](https://www.npmjs.com/)

### 🔧 Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/gratry-snow.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd gratry-snow
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Set up environment variables:

    Copy the `.env.local.example` file to a new file named `.env.local` and fill in your Supabase URL and anonymous key.

    ```bash
    cp .env.local.example .env.local
    ```

    Your `.env.local` file should look like this:
    ```
    NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```

### 🏃‍♂️ Running the Application

*   **Development Mode:**
    ```bash
    npm run dev
    ```
*   **Production Mode:**
    ```bash
    npm run build
    npm run start
    ```

## 🛠️ Tech Stack

*   [Next.js](https://nextjs.org/) - The React Framework
*   [Supabase](https://supabase.io/) - Backend-as-a-Service
*   [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
*   [shadcn/ui](https://ui.shadcn.com/) - UI Components
*   [next-intl](https://next-intl-docs.vercel.app/) - Internationalization for Next.js
