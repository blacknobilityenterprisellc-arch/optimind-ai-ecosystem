# Deployment Guide: Connect to GitHub and Vercel

## Prerequisites
- GitHub account
- Vercel account
- Your phone with internet access

## Step 1: Connect to GitHub

### Option A: Using GitHub Mobile App
1. Open the GitHub mobile app on your phone
2. Tap the "+" button to create a new repository
3. Repository name: `nextjs-tailwind-shadcn-ts`
4. Make it Public or Private (your choice)
5. Don't initialize with README (we already have one)
6. Tap "Create repository"

### Option B: Using GitHub Website
1. Go to github.com on your phone's browser
2. Log in to your account
3. Tap "+" → "New repository"
4. Repository name: `nextjs-tailwind-shadcn-ts`
5. Choose Public/Private
6. Click "Create repository"

## Step 2: Push Your Code to GitHub

After creating the repository, GitHub will show you a page with commands. You'll need to run these commands in your project directory:

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/nextjs-tailwind-shadcn-ts.git

# Push to GitHub
git push -u origin master
```

## Step 3: Connect to Vercel

### Option A: Using Vercel Mobile App
1. Download the Vercel mobile app if you haven't already
2. Log in to your Vercel account
3. Tap "Import Project"
4. Choose "Import from GitHub"
5. Select your `nextjs-tailwind-shadcn-ts` repository
6. Configure the project settings (see below)
7. Tap "Deploy"

### Option B: Using Vercel Website
1. Go to vercel.com on your phone's browser
2. Log in to your account
3. Click "New Project"
4. Select "Import Git Repository"
5. Find and select your `nextjs-tailwind-shadcn-ts` repository
6. Configure the project settings

## Step 4: Configure Environment Variables

In Vercel, you'll need to set up environment variables:

1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add the following variables:

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | Your Vercel app URL |
| `NEXTAUTH_SECRET` | `generate-a-random-secret` | Generate a random string |
| `DATABASE_URL` | `file:./dev.db` | Database connection string |

**Note:** For `NEXTAUTH_SECRET`, you can generate a random string using:
```bash
openssl rand -base64 32
```

## Step 5: Deploy

1. After configuring environment variables, click "Deploy"
2. Vercel will automatically build and deploy your application
3. Once deployed, you'll get a URL like `https://your-app.vercel.app`

## Step 6: Set Up Custom Domain (Optional)

If you want to use a custom domain:

1. In Vercel project settings, go to "Domains"
2. Add your custom domain
3. Follow the DNS configuration instructions provided by Vercel

## Troubleshooting

### Common Issues:

1. **Build Failures**: Make sure all dependencies are properly installed
2. **Database Issues**: Ensure your database configuration is correct for production
3. **Environment Variables**: Double-check that all required variables are set

### Getting Help:

- Vercel Documentation: https://vercel.com/docs
- GitHub Documentation: https://docs.github.com
- Next.js Deployment Guide: https://nextjs.org/docs/deployment

## Automatic Deploys

Once set up, Vercel will automatically deploy new changes when you push to your GitHub repository:

1. Make changes to your code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin master
   ```
3. Vercel will automatically detect the changes and deploy

## Production Considerations

- For production use, consider using a production database instead of SQLite
- Set up proper error monitoring and logging
- Configure analytics if needed
- Set up backup strategies for your data

Your project is now ready for deployment! 🚀