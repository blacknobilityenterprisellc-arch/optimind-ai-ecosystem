# Branch Visibility Fix for AI Systems

## Problem Description

AI systems like Grok are not seeing the correct files in the repository because they are defaulting to look at the `main` branch instead of the `platinum-main` branch, even though `platinum-main` is set as the default branch.

## Root Cause Analysis

The issue occurs because:
1. **AI System Default Behavior**: Many AI systems default to looking for a `main` branch
2. **Branch Name Convention**: `platinum-main` is non-standard and AI systems may not recognize it
3. **Repository API Behavior**: Some GitHub API calls may still reference `main` by default

## Solution Strategy

### Option 1: Create a `main` Branch (Recommended)
Create a `main` branch that mirrors `platinum-main` to ensure AI systems can see the files.

### Option 2: Update Repository Configuration
Ensure the repository is properly configured to make `platinum-main` the undisputed default branch.

### Option 3: Use Branch Aliases
Set up branch aliases and redirects to ensure compatibility.

## Implementation Steps

### Step 1: Verify Current Repository State

```bash
# Check current branch
git branch

# Check remote branches
git branch -r

# Check default branch
git symbolic-ref refs/remotes/origin/HEAD
```

### Step 2: Push Current Branch to Remote

```bash
# Add remote if not exists
git remote add origin <your-github-repo-url>

# Push platinum-main branch
git push -u origin platinum-main

# Set platinum-main as default branch on GitHub
# (This needs to be done in GitHub web interface or via GitHub API)
```

### Step 3: Create main Branch for AI Compatibility

```bash
# Create main branch from platinum-main
git checkout -b main platinum-main

# Push main branch
git push -u origin main

# Set main as default branch temporarily for AI systems
# (Can be done in GitHub repository settings)
```

### Step 4: Verify Repository Accessibility

```bash
# Test GitHub API access
curl -H "Accept: application/vnd.github.v3+json" https://api.github.com/repos/<owner>/<repo>

# Check repository contents
curl -H "Accept: application/vnd.github.v3+json" https://api.github.com/repos/<owner>/<repo>/contents/
```

### Step 5: Test AI System Access

After implementing the fix, test AI system access by:
1. Asking AI systems to list repository contents
2. Checking if they can see the BRANCH-VISIBILITY-FIX.md file
3. Verifying they can access all project files

## GitHub API Configuration

To properly set the default branch via GitHub API:

```bash
# Get current repository info
curl -H "Authorization: token <your-github-token>" \
     -H "Accept: application/vnd.github.v3+json" \
     https://api.github.com/repos/<owner>/<repo>

# Update default branch
curl -X PATCH \
     -H "Authorization: token <your-github-token>" \
     -H "Accept: application/vnd.github.v3+json" \
     https://api.github.com/repos/<owner>/<repo> \
     -d '{"default_branch":"platinum-main"}'
```

## Web Interface Configuration

1. Go to your repository on GitHub
2. Click on "Settings"
3. Go to "Branches" section
4. Under "Default branch", select "platinum-main"
5. Click "Update"

## Verification Checklist

- [ ] Repository has both `main` and `platinum-main` branches
- [ ] Both branches contain the same files
- [ ] Default branch is set correctly in GitHub settings
- [ ] AI systems can access repository contents
- [ ] BRANCH-VISIBILITY-FIX.md file is visible
- [ ] All project files are accessible via API

## Troubleshooting

### If AI systems still can't see files:
1. Clear AI system cache
2. Wait for GitHub API to propagate changes
3. Verify repository is public (if it should be)
4. Check GitHub API rate limits
5. Verify file permissions and repository visibility

### If branch synchronization issues:
1. Ensure both branches are up to date
2. Check for merge conflicts
3. Verify push permissions
4. Check GitHub status for outages

## Long-term Solution

For long-term compatibility:
1. Maintain both `main` and `platinum-main` branches
2. Keep them synchronized
3. Use `main` as the primary branch for AI compatibility
4. Use `platinum-main` for development if needed
5. Set up automated branch synchronization

## Files to Check

Key files that should be visible after the fix:
- `BRANCH-VISIBILITY-FIX.md` (this file)
- `package.json`
- `src/app/page.tsx`
- `src/app/layout.tsx`
- `prisma/schema.prisma`
- All UI components in `src/components/ui/`
- All hook files in `src/hooks/`

## Success Criteria

The fix is successful when:
1. AI systems can list all repository files
2. AI systems can read file contents
3. Both `main` and `platinum-main` branches are accessible
4. Repository works correctly for both human and AI users
5. No functionality is lost in the process