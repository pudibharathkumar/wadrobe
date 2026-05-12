# 🚀 Digital Closet: Bold & Simple Deployment Guide

Follow these exact steps to get your app live. **You must deploy the AI Service first, then Backend, and finally the Frontend.**

---

## **PHASE 1: Deploying Your AI Service (Render)**
We deploy this first so your Backend can use it.

**Step 1:** Go to [Render.com](https://render.com) and click **"New" -> "Web Service"**.
**Step 2:** Connect your GitHub account and select your `wadrobe` repository.
**Step 3:** Change the **Root Directory** to: `ai-service`
**Step 4:** Change the **Runtime** to: `Python 3`
**Step 5:** Set the **Build Command** to: `pip install -r requirements.txt`
**Step 6:** Set the **Start Command** to: `uvicorn main:app --host 0.0.0.0 --port $PORT`
**Step 7:** Scroll down to **Environment Variables** and add:
*   **`OPENROUTER_API_KEY`** = *(Your OpenRouter API Key)*

**Step 8:** Click **Deploy Web Service**! Once live, **copy the URL** Render gives you (e.g., `https://wadrobe-ai.onrender.com`).

---

## **PHASE 2: Deploying Your Backend Server (Render)**
Now we deploy the backend and connect it to your AI Service and Neon Database!

**Step 1:** On Render, click **"New" -> "Web Service"** again.
**Step 2:** Select the `wadrobe` repository.
**Step 3:** Change the **Root Directory** to: `server`
**Step 4:** Set the **Build Command** to: `npm install && npx prisma generate && npm run build`
**Step 5:** Set the **Start Command** to: `npm run start`
**Step 6:** Under **Environment Variables**, add these exactly:
*   **`DATABASE_URL`** = `postgresql://neondb_owner:npg_JMf63LhZgKqH@ep-young-band-ap5o25ww-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
*   **`AI_SERVICE_URL`** = *(Paste the AI Service URL you copied from Phase 1)*
*   **`PORT`** = `4000`
*   **`JWT_SECRET`** = `fitplan_super_secret_key_123_456_789`
*   **`CLOUDINARY_CLOUD_NAME`** = `dggtmb420`
*   **`CLOUDINARY_API_KEY`** = `259176147375763`
*   **`CLOUDINARY_API_SECRET`** = `-qcSNHhPNG_lQIGBJH-zPY9ksGk`

**Step 7:** Click **Deploy Web Service**! Once live, **copy the URL** Render gives you (e.g., `https://wadrobe-server.onrender.com`).

---

## **PHASE 3: Deploying Your Frontend Client (Vercel)**
Finally, the website your users will see!

**Step 1:** Delete any old Vercel project to start fresh.
**Step 2:** Go to [Vercel.com](https://vercel.com) and click **"Add New" -> "Project"**.
**Step 3:** Import your `wadrobe` repository.
**Step 4:** Change the **Root Directory** to: `client`
**Step 5:** Open the **Environment Variables** section and add these:
*   **`NEXT_PUBLIC_API_URL`** = *(Paste the Backend URL from Phase 2)*`/api` *(Make sure it ends in `/api`, e.g., `https://wadrobe-server.onrender.com/api`)*
*   **`NEXTAUTH_SECRET`** = `fitplan_super_secret_key_123_456_789`
*   **`GOOGLE_ID`** = *(You need to provide your Google Client ID here)*
*   **`GOOGLE_SECRET`** = *(You need to provide your Google Client Secret here)*

**Step 6:** Click **Deploy**! 

🎉 **You are DONE!** The app is fully live!
