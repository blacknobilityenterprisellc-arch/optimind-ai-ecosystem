#!/bin/bash

# Repository Access Verification Script
# This script verifies that the repository is accessible and contains the expected files

set -e

echo "🔍 Repository Access Verification"
echo "================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Repository URL
REPO_URL="https://github.com/blacknobilityenterprisellc-arch/nextjs-tailwind-shadcn-ts"
API_URL="https://api.github.com/repos/blacknobilityenterprisellc-arch/nextjs-tailwind-shadcn-ts"

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Function to test API access
test_api_access() {
    print_status "Testing GitHub API access..."
    
    if command -v curl &> /dev/null; then
        # Test repository info
        if curl -s -f "$API_URL" > /dev/null; then
            print_success "✅ Repository API accessible"
            
            # Test repository contents
            if curl -s -f "$API_URL/contents/" > /dev/null; then
                print_success "✅ Repository contents accessible"
                
                # Test specific files
                test_file_access "BRANCH-VISIBILITY-FIX.md"
                test_file_access "package.json"
                test_file_access "src/app/page.tsx"
                test_file_access "prisma/schema.prisma"
                
                # Count files
                file_count=$(curl -s "$API_URL/contents/" | jq '. | length' 2>/dev/null || echo "unknown")
                print_status "📁 Repository contains approximately $file_count files/directories"
                
            else
                print_error "❌ Repository contents not accessible"
            fi
        else
            print_error "❌ Repository API not accessible"
        fi
    else
        print_warning "⚠️  curl not available, skipping API tests"
    fi
}

# Function to test specific file access
test_file_access() {
    local file="$1"
    if curl -s -f "$API_URL/contents/$file" > /dev/null; then
        print_success "✅ $file - Accessible"
    else
        print_error "❌ $file - Not accessible"
    fi
}

# Function to test web interface
test_web_interface() {
    print_status "Testing web interface accessibility..."
    
    if command -v curl &> /dev/null; then
        # Test basic HTTP access
        if curl -s -f "$REPO_URL" > /dev/null; then
            print_success "✅ Web interface accessible"
        else
            print_error "❌ Web interface not accessible"
        fi
    else
        print_warning "⚠️  curl not available, skipping web interface tests"
    fi
}

# Function to check branch information
test_branches() {
    print_status "Testing branch information..."
    
    if command -v curl &> /dev/null; then
        # Test branches API
        if curl -s -f "$API_URL/branches" > /dev/null; then
            print_success "✅ Branches API accessible"
            
            # Check for main and platinum-main branches
            branches=$(curl -s "$API_URL/branches" | jq -r '.[].name' 2>/dev/null || echo "")
            
            if echo "$branches" | grep -q "main"; then
                print_success "✅ main branch exists"
            else
                print_error "❌ main branch not found"
            fi
            
            if echo "$branches" | grep -q "platinum-main"; then
                print_success "✅ platinum-main branch exists"
            else
                print_error "❌ platinum-main branch not found"
            fi
            
            # Count branches
            branch_count=$(echo "$branches" | wc -l | tr -d ' ')
            print_status "🌿 Repository contains $branch_count branches"
            
        else
            print_error "❌ Branches API not accessible"
        fi
    else
        print_warning "⚠️  curl not available, skipping branch tests"
    fi
}

# Function to check default branch
test_default_branch() {
    print_status "Testing default branch..."
    
    if command -v curl &> /dev/null; then
        # Get repository info including default branch
        repo_info=$(curl -s "$API_URL" 2>/dev/null || "")
        
        if [ -n "$repo_info" ]; then
            default_branch=$(echo "$repo_info" | jq -r '.default_branch' 2>/dev/null || echo "unknown")
            
            if [ "$default_branch" = "main" ]; then
                print_success "✅ Default branch is set to 'main' (AI compatible)"
            elif [ "$default_branch" = "platinum-main" ]; then
                print_warning "⚠️  Default branch is 'platinum-main' (may have AI compatibility issues)"
            else
                print_warning "⚠️  Default branch is '$default_branch'"
            fi
        else
            print_error "❌ Could not determine default branch"
        fi
    else
        print_warning "⚠️  curl not available, skipping default branch test"
    fi
}

# Function to provide AI system test commands
provide_ai_test_commands() {
    print_status "AI System Test Commands:"
    echo ""
    echo "Test your repository with AI systems using these commands:"
    echo ""
    echo "1. List repository contents:"
    echo "   \"List the contents of $REPO_URL\""
    echo ""
    echo "2. Read documentation:"
    echo "   \"Read the BRANCH-VISIBILITY-FIX.md file from $REPO_URL\""
    echo ""
    echo "3. Check package structure:"
    echo "   \"Show me the package.json file from $REPO_URL\""
    echo ""
    echo "4. Verify project structure:"
    echo "   \"What files are in the src/app/ directory of $REPO_URL\""
    echo ""
    echo "5. Test AI integration:"
    echo "   \"Does the repository at $REPO_URL contain AI SDK integration?\""
    echo ""
}

# Main verification process
echo "🚀 Starting repository verification..."
echo ""

test_api_access
echo ""
test_web_interface
echo ""
test_branches
echo ""
test_default_branch
echo ""
provide_ai_test_commands

echo ""
echo "🎯 Verification Complete!"
echo ""
echo "Next steps:"
echo "1. Test the repository with AI systems using the commands above"
echo "2. Verify that AI systems can see all your files"
echo "3. Check that BRANCH-VISIBILITY-FIX.md is accessible"
echo "4. Confirm that the complete project structure is visible"
echo ""
echo "Repository URL: $REPO_URL"
echo "API URL: $API_URL"
echo ""