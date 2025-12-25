# Deploy Nightclub App Directly with Vercel CLI

## Install Vercel CLI

```powershell
npm install -g vercel
```

## Login to Vercel

```powershell
vercel login
```

## Deploy Backend

```powershell
cd backend
vercel
# Follow prompts:
# - Project name: nightclub-backend
# - Want to override settings? N
```

## Deploy User Webapp

```powershell
cd ../user-webapp
vercel
# Project name: nightclub-user-app
```

## Deploy Admin Dashboard

```powershell
cd ../admin-dashboard
vercel
# Project name: nightclub-admin-dashboard
```

## Add Environment Variables

After each deployment, go to:
- Vercel Dashboard → Your Project → Settings → Environment Variables

Add the variables as described in the deployment guide.
