#!/bin/bash

# GITHUB REMOTE CONFIGURATION UPDATE SCRIPT
# Replace YOUR_USERNAME with your actual GitHub username

echo "🚀 UPDATING GITHUB REMOTE CONFIGURATION"
echo "========================================"

# Step 1: Remove the old, invalid remote
echo "📋 Step 1: Removing old remote..."
git remote remove origin

# Step 2: Add your real GitHub repository (REPLACE YOUR_USERNAME)
echo "📋 Step 2: Adding new remote..."
# ⚠️  IMPORTANT: Replace "YOUR_USERNAME" with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/optimind-ai-ecosystem.git

# Step 3: Verify the new remote
echo "📋 Step 3: Verifying remote configuration..."
git remote -v

# Step 4: Push all content to GitHub
echo "📋 Step 4: Pushing all content to GitHub..."
git push -u origin --all
git push origin --tags

echo "✅ REMOTE CONFIGURATION COMPLETE!"
echo "🔗 Your repository should now be available at:"
echo "   https://github.com/YOUR_USERNAME/optimind-ai-ecosystem"
echo ""
echo "📋 Next Steps:"
echo "1. Open the URL above in your browser"
echo "2. Verify all files are visible"
echo "3. Test with AI systems using this URL"
echo ""
echo "🚀 Repository is now LIVE and ACCESSIBLE!"