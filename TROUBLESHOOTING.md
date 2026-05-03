# Troubleshooting Sign-In Issues

The sign-in is failing because your `.env` file is missing required credentials and has a database configuration mismatch.

## 1. Missing Google Credentials
In your `.env` file, `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are currently empty.

**Fix:**
1.  Go to [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a Project and configure the **OAuth Consent Screen**.
3.  Create **Credentials** -> **OAuth Client ID** (Web Application).
4.  Add `http://localhost:3000/api/auth/callback/google` to **Authorized Redirect URIs**.
5.  Copy the Client ID and Client Secret.
6.  Paste them into your `.env` file:
    ```env
    GOOGLE_CLIENT_ID="your-client-id-here"
    GOOGLE_CLIENT_SECRET="your-client-secret-here"
    ```

## 2. Database Mismatch
You requested to host the project, so the database schema was updated to **PostgreSQL** (Supabase).
However, your `.env` still points to a local SQLite file (`file:./dev.db`).

**Fix:**
 - **Option A (Use Supabase - Recommended for Hosting):**
   - Create a project on [Supabase](https://supabase.com/).
   - Copy the "Transaction Pooler" connection string.
   - Update `.env`:
     ```env
     DATABASE_URL="postgres://..."
     ```
   - Run `npx prisma db push` to sync the schema.

 - **Option B (Revert to Local SQLite):**
   - If you only want to test locally for now, update `prisma/schema.prisma` to use `provider = "sqlite"`.
   - Update `.env`:
     ```env
     DATABASE_URL="file:./dev.db"
     ```
   - Run `npx prisma db push`.

## 3. Restart Server
After updating `.env`, stop the running server (`Ctrl+C`) and run:
```bash
npm start
```
