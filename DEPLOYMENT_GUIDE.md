# SlotSwapper Deployment Guide

This guide will help you deploy your SlotSwapper application using:
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: Supabase (PostgreSQL)

## 🗄️ Step 1: Setup Supabase Database

1. **Create Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Sign up/login with GitHub

2. **Create New Project**
   - Click "New Project"
   - Choose organization
   - Name: `slotswapper-db`
   - Generate a strong password
   - Choose region closest to you
   - Click "Create new project"

3. **Get Database URL**
   - Go to Settings → Database
   - Copy the "Connection string" (URI format)
   - It looks like: `postgresql://postgres:[YOUR-PASSWORD]@[HOST]:5432/postgres`

4. **Run Migrations** (after backend deployment)
   - Your Django migrations will run automatically on Render

## 🚀 Step 2: Deploy Backend to Render

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your SlotSwapper repo

3. **Configure Service**
   - **Name**: `slotswapper-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `Backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn core.wsgi:application`

4. **Add Environment Variables**
   ```
   SECRET_KEY=your-super-secret-key-here-make-it-long-and-random
   DEBUG=False
   DATABASE_URL=your-supabase-connection-string-from-step-1
   ALLOWED_HOSTS=your-app-name.onrender.com
   CORS_ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
   CORS_ALLOW_ALL_ORIGINS=False
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Note your backend URL: `https://your-app-name.onrender.com`

## 🌐 Step 3: Deploy Frontend to Vercel

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "New Project"
   - Import your GitHub repository
   - Select the `frontend` folder as root directory

3. **Configure Build Settings**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Add Environment Variables**
   ```
   VITE_API_URL=https://your-render-backend-url.onrender.com
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment (2-3 minutes)
   - Note your frontend URL: `https://your-app.vercel.app`

## 🔄 Step 4: Update CORS Settings

1. **Update Backend Environment Variables on Render**
   - Go to your Render service dashboard
   - Environment → Edit
   - Update `CORS_ALLOWED_ORIGINS` with your actual Vercel URL:
     ```
     CORS_ALLOWED_ORIGINS=https://your-actual-vercel-app.vercel.app
     ```

2. **Redeploy Backend**
   - Click "Manual Deploy" → "Deploy latest commit"

## ✅ Step 5: Test Your Deployment

1. **Visit your frontend URL**
2. **Test user registration and login**
3. **Create some events**
4. **Test the marketplace and requests features**

## 🔧 Troubleshooting

### Backend Issues
- Check Render logs: Dashboard → Logs
- Ensure all environment variables are set
- Verify DATABASE_URL format

### Frontend Issues
- Check Vercel deployment logs
- Ensure VITE_API_URL is correct
- Check browser console for errors

### Database Issues
- Verify Supabase connection string
- Check if migrations ran successfully
- Ensure database is accessible

## 📝 Important Notes

1. **Free Tier Limitations**:
   - Render: Service sleeps after 15 minutes of inactivity
   - Vercel: 100GB bandwidth/month
   - Supabase: 500MB database storage

2. **Security**:
   - Never commit `.env` files
   - Use strong, unique passwords
   - Regularly rotate secret keys

3. **Monitoring**:
   - Check Render logs for backend issues
   - Use Vercel analytics for frontend monitoring
   - Monitor Supabase usage in dashboard

## 🎉 You're Done!

Your SlotSwapper application is now live and accessible worldwide!

- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-backend.onrender.com
- **Database**: Managed by Supabase

Remember to update the URLs in this guide with your actual deployment URLs.