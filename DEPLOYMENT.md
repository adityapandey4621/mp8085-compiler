# Deploying MP8085 Simulator

This application is built with **Next.js** (Full Stack), using **Prisma** with SQLite (for dev) and **NextAuth.js** for authentication.

## 1. Quickest Deployment (Vercel)

Vercel is the creators of Next.js and provides the easiest deployment flow.

1.  **Push your code to GitHub**.
2.  **Go to Vercel.com** and sign up/login.
3.  **Click "Add New Project"** and select your repository.
4.  **Configure Environment Variables**:
    Add the following variables in the Vercel dashboard:
    *   `NEXTAUTH_SECRET`: Generate a random string (e.g., using `openssl rand -base64 32`).
    *   `NEXTAUTH_URL`: Your Vercel URL (e.g., `https://your-project.vercel.app`).
    *   `GOOGLE_CLIENT_ID`: From Google Cloud Console.
    *   `GOOGLE_CLIENT_SECRET`: From Google Cloud Console.
    *   `GEMINI_API_KEY`: Your AI key.

    > **Important for Database**: Vercel does not support persistent SQLite files. You must switch to a cloud database like **PostgreSQL** (e.g., Vercel Postgres, Neon, or Supabase) for production.

### Switching to PostgreSQL for Production

1.  Update `prisma/schema.prisma`:
    ```prisma
    datasource db {
      provider = "postgresql"
      url      = env("DATABASE_URL")
    }
    ```
2.  Delete `prisma/migrations` folder locally.
3.  Run `npx prisma migrate dev --name init_postgres`.

## 2. Docker Deployment (Self-Hosted)

If you prefer to host it yourself (e.g., on a VPS like DigitalOcean, AWS EC2), use Docker.

### Dockerfile

Create a `Dockerfile` in the root:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Running with Docker

1.  Build the image:
    ```bash
    docker build -t mp8085 .
    ```
2.  Run the container:
    ```bash
    docker run -p 3000:3000 \
      -e DATABASE_URL="file:./dev.db" \
      -e NEXTAUTH_SECRET="your_secret" \
      -e NEXTAUTH_URL="http://localhost:3000" \
      mp8085
    ```

## 3. Separating Backend (Not Recommended)

Next.js API routes (`app/api/...`) **ARE** the backend. They run on the server (Node.js). Separating them into an Express app adds complexity without much benefit unless you have specific microservice needs.

**If you must verify separation:**
*   The `app/api` folder contains all backend logic.
*   You can copy the logic from `app/api/code/route.ts` into an Express route handler easily as it is standard JavaScript/TypeScript.

## Getting Google OAuth Keys

1.  Go to **Google Cloud Console** (console.cloud.google.com).
2.  Create a **New Project**.
3.  Go to **APIs & Services > OAuth consent screen**.
    *   Select **External**.
    *   Fill in App Name ("MP8085") and email.
4.  Go to **Credentials > Create Credentials > OAuth client ID**.
    *   Application type: **Web application**.
    *   Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google` (and your production URL later).
5.  Copy the **Client ID** and **Client Secret** into your `.env` file.
