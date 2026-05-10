# Digital Closet Deployment Guide

This guide will help you deploy all three services (Frontend, Backend, AI) to production.

## 1. Prepare for GitHub
Before pushing to GitHub, ensure you have a `.gitignore` in each folder to avoid uploading sensitive keys.

### Step 1: Create a GitHub Repository
1. Go to [github.com/new](https://github.com/new).
2. Name it `digital-closet` and create it.

### Step 2: Push your code
Open your terminal in the root folder (`wadrobe`) and run:
```bash
git init
git add .
git commit -m "Initial commit: Digital Closet with Auth and AI"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/digital-closet.git
git push -u origin main
```

---

## 2. Deploy Frontend (Vercel)
**Vercel** is the best place for your Next.js frontend.

1. Go to [Vercel.com](https://vercel.com) and click **"Add New" -> "Project"**.
2. Import your `digital-closet` repository.
3. In **Root Directory**, select `client`.
4. Add these **Environment Variables**:
   - `NEXTAUTH_URL`: `https://your-app-name.vercel.app`
   - `NEXTAUTH_SECRET`: (Generate a random string)
   - `NEXT_PUBLIC_API_URL`: `https://your-backend-url.render.com/api`
   - `GOOGLE_ID`: (Your Google Client ID)
   - `GOOGLE_SECRET`: (Your Google Client Secret)
5. Click **Deploy**.

---

## 3. Deploy Backend (Render)
**Render** is great for the Node.js server and SQLite.

1. Go to [Render.com](https://render.com) and create a **"New Web Service"**.
2. Connect your GitHub and select the `digital-closet` repo.
3. **Root Directory**: `server`
4. **Build Command**: `npm install && npx prisma generate && npm run build`
5. **Start Command**: `node dist/index.js`
6. Add these **Environment Variables**:
   - `DATABASE_URL`: `file:./dev.db` (For SQLite)
   - `JWT_SECRET`: (Same as frontend)
   - `CLOUDINARY_CLOUD_NAME`: (Your Cloudinary Name)
   - `CLOUDINARY_API_KEY`: (Your Cloudinary Key)
   - `CLOUDINARY_API_SECRET`: (Your Cloudinary Secret)
   - `AI_SERVICE_URL`: `https://your-ai-service.render.com`

---

## 4. Deploy AI Service (Render)
1. Create a **"New Web Service"** on Render.
2. Select the same repo.
3. **Root Directory**: `ai-service`
4. **Runtime**: `Python 3`
5. **Build Command**: `pip install -r requirements.txt`
6. **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
7. Add these **Environment Variables**:
   - `OPENROUTER_API_KEY`: (Your OpenRouter Key)

---

## 5. Final Step: Connect them
Once your Backend and AI Service are live, copy their URLs:
1. Update the `NEXT_PUBLIC_API_URL` in **Vercel** settings.
2. Update the `AI_SERVICE_URL` in **Render (Backend)** settings.
3. Redeploy the services.

### ✅ Your app is now live!
