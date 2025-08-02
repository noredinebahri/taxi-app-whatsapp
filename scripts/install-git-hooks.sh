#!/bin/bash

# Git Hook Installation Script
# This script installs the pre-push hook to validate code before deployment

echo "🔧 Installing Git hooks..."

# Create .git/hooks directory if it doesn't exist
mkdir -p .git/hooks

# Copy pre-push hook
cp scripts/pre-push-hook.sh .git/hooks/pre-push

# Make it executable
chmod +x .git/hooks/pre-push

echo "✅ Pre-push hook installed successfully!"
echo ""
echo "This hook will now run automatically before each git push to:"
echo "  - Run tests"
echo "  - Check for security vulnerabilities" 
echo "  - Validate project structure"
echo "  - Prevent pushing sensitive data"
echo ""
echo "To bypass the hook (not recommended), use: git push --no-verify"
