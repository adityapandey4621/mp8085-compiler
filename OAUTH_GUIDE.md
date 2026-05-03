# Best Practice: Google OAuth Setup

## The Strategy: "One Project, Two Environments"
You do **not** need separate Google credentials for Local and Production. You can use the **same** Client ID for both.

### Step 1: Configure Google Cloud (Once)
1.  Go to **[Google Cloud Console > Credentials](https://console.cloud.google.com/apis/credentials)**.
2.  Open your **OAuth 2.0 Client ID**.
3.  Under **Authorized Redirect URIs**, you need to add **BOTH** of these links:

| Environment | URL to Add |
| :--- | :--- |
| **Local (Dev)** | `http://localhost:3000/api/auth/callback/google` |
| **Production** | `https://YOUR-VERCEL-APP.vercel.app/api/auth/callback/google` |

*Note: You can add the Production URL later once you deploy.*

### Step 2: Configure Environment Variables
You need to tell your code which database and credentials to use.

#### For Local Development (Simple & Fast)
We use **SQLite** (a local file) so you don't need internet or a database server.

**Action Required**: Copy `.env.example` to `.env` and fill in your values:
```env
# 1. Database (Local SQLite file - already set)
DATABASE_URL="file:./dev.db"

# 2. Google Credentials (Copy from Google Cloud)
GOOGLE_CLIENT_ID="[PASTE_YOUR_ID_HERE]"
GOOGLE_CLIENT_SECRET="[PASTE_YOUR_SECRET_HERE]"

# 3. NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="any-random-string-at-least-32-chars"

# 4. Gemini AI Key (from Google AI Studio)
GEMINI_API_KEY="[PASTE_YOUR_KEY_HERE]"
```

#### For Production (Vercel)
Set these same variables in your **Vercel Dashboard > Settings > Environment Variables**. For the database, switch to PostgreSQL (see `DEPLOYMENT.md`).

## Step 3: Run the App
1.  **Save** the `.env` file.
2.  **Start** the server:
    ```bash
    npx prisma generate
    npm run dev
    ```

## Why is this the "Best" way?
1.  **Simple**: You don't need to manage multiple API keys.
2.  **Structured**: `localhost` is explicitly defined for testing, and the production URL is just another entry in the same list.
3.  **Correct**: Yes, it is 100% correct to put the localhost link in Google Cloud. Without it, Google rejects the sign-in attempt for security reasons.
