#!/bin/bash

echo "🔍 VERIFYING GITHUB REPOSITORY STATUS"
echo "====================================="

echo "📋 Checking current git status..."
git status

echo ""
echo "📋 Checking remote configuration..."
git remote -v

echo ""
echo "📋 Checking recent commits..."
git log --oneline -5

echo ""
echo "📋 Checking if package.json is tracked..."
git ls-files | grep package.json

echo ""
echo "📋 Checking if tsconfig.json is tracked..."
git ls-files | grep tsconfig.json

echo ""
echo "📋 Checking if prisma schema is tracked..."
git ls-files | grep prisma

echo ""
echo "🌐 REPOSITORY URL:"
echo "https://github.com/blacknobilityenterprisellc-arch/optimind-ai-ecosystem"

echo ""
echo "✅ VERIFICATION COMPLETE!"
echo "Repository should be fully accessible with all configuration files."