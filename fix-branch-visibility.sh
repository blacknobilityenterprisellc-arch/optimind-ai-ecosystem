#!/bin/bash

# Branch Visibility Fix Script
# This script helps fix the issue where AI systems can't see the correct repository files

set -e

echo "🔧 Branch Visibility Fix Script"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if git repository
if [ ! -d ".git" ]; then
    print_error "Not a git repository. Please run this script from the root of your git repository."
    exit 1
fi

# Check current branch
current_branch=$(git branch --show-current)
print_status "Current branch: $current_branch"

# Check if we have a remote repository
if ! git remote | grep -q "origin"; then
    print_warning "No remote 'origin' found. You'll need to add it manually."
    read -p "Enter your GitHub repository URL (e.g., https://github.com/username/repo.git): " repo_url
    
    if [ -z "$repo_url" ]; then
        print_error "No repository URL provided. Exiting."
        exit 1
    fi
    
    git remote add origin "$repo_url"
    print_status "Added remote origin: $repo_url"
fi

# Ensure we're on platinum-main branch
if [ "$current_branch" != "platinum-main" ]; then
    print_status "Switching to platinum-main branch..."
    git checkout platinum-main || git checkout -b platinum-main
fi

# Add all files and commit if there are changes
if [ -n "$(git status --porcelain)" ]; then
    print_status "Committing current changes..."
    git add .
    git commit -m "Update repository files for branch visibility fix

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
fi

# Push platinum-main branch
print_status "Pushing platinum-main branch to remote..."
git push -u origin platinum-main || {
    print_error "Failed to push platinum-main branch. Check your remote URL and permissions."
    exit 1
}

# Create main branch from platinum-main for AI compatibility
print_status "Creating main branch for AI system compatibility..."
git checkout -b main platinum-main

# Push main branch
print_status "Pushing main branch to remote..."
git push -u origin main || {
    print_error "Failed to push main branch. Check your remote URL and permissions."
    exit 1
}

# Switch back to platinum-main
git checkout platinum-main

print_status "Branch setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Go to your GitHub repository"
echo "2. Go to Settings > Branches"
echo "3. Set 'platinum-main' as the default branch"
echo "4. Alternatively, you can keep 'main' as default for AI compatibility"
echo ""
echo "To verify the fix:"
echo "- Check if AI systems can now see your files"
echo "- Test repository access via GitHub API"
echo "- Verify BRANCH-VISIBILITY-FIX.md is visible"
echo ""
print_status "Script completed successfully!"