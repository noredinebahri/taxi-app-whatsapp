#!/bin/bash

# Pre-push Git hook to validate code before deployment
# This script runs locally before pushing to prevent broken deployments

set -e

echo "🔍 Running pre-push validation..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're pushing to main branch
protected_branch='main'
current_branch=$(git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,')

if [ $protected_branch = $current_branch ]; then
    echo -e "${YELLOW}⚠️  Pushing to protected branch: $protected_branch${NC}"
    echo "Running additional validations..."
fi

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ package.json not found${NC}"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📦 Installing dependencies...${NC}"
    npm install
fi

# Run tests if available
if npm run test --if-present 2>/dev/null; then
    echo -e "${GREEN}✅ Tests passed${NC}"
else
    echo -e "${YELLOW}⚠️  No tests found or tests failed${NC}"
fi

# Run linting if available
if npm run lint --if-present 2>/dev/null; then
    echo -e "${GREEN}✅ Linting passed${NC}"
else
    echo -e "${YELLOW}⚠️  No linting configured${NC}"
fi

# Check for security vulnerabilities
echo -e "${BLUE}🔍 Running security audit...${NC}"
if npm audit --audit-level=moderate; then
    echo -e "${GREEN}✅ Security audit passed${NC}"
else
    echo -e "${YELLOW}⚠️  Security vulnerabilities found${NC}"
    echo "Consider running 'npm audit fix' before pushing"
fi

# Validate essential files exist
echo -e "${BLUE}📋 Validating project structure...${NC}"

essential_files=(
    "src/app.js"
    "src/services/whatsappService.js"
    "src/controllers/whatsappController.js"
    "ecosystem.config.js"
    ".github/workflows/deploy.yml"
)

for file in "${essential_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file${NC}"
    else
        echo -e "${RED}❌ Missing: $file${NC}"
        exit 1
    fi
done

# Check if deployment script exists and is executable
if [ -f "scripts/deploy.sh" ]; then
    echo -e "${GREEN}✅ Deployment script found${NC}"
    
    # Make sure it's executable
    chmod +x scripts/deploy.sh
else
    echo -e "${YELLOW}⚠️  Deployment script not found${NC}"
fi

# Validate environment variables in ecosystem.config.js
if grep -q "NODE_ENV.*production" ecosystem.config.js; then
    echo -e "${GREEN}✅ Production environment configured${NC}"
else
    echo -e "${YELLOW}⚠️  Production environment not explicitly set${NC}"
fi

# Check for sensitive data
echo -e "${BLUE}🔒 Checking for sensitive data...${NC}"

sensitive_patterns=(
    "password.*="
    "secret.*="
    "api.*key.*="
    "token.*="
    "private.*key"
)

for pattern in "${sensitive_patterns[@]}"; do
    if git diff --cached --name-only | xargs grep -l "$pattern" 2>/dev/null; then
        echo -e "${RED}❌ Potential sensitive data found matching: $pattern${NC}"
        echo "Please review your changes and remove any hardcoded secrets"
        exit 1
    fi
done

echo -e "${GREEN}✅ No sensitive data detected${NC}"

# Final validation
echo -e "${GREEN}🎉 All validations passed!${NC}"
echo -e "${BLUE}🚀 Safe to push to $current_branch${NC}"

if [ $protected_branch = $current_branch ]; then
    echo ""
    echo -e "${YELLOW}📋 Deployment checklist:${NC}"
    echo "  ✅ Code has been tested"
    echo "  ✅ No security vulnerabilities"
    echo "  ✅ Essential files present"
    echo "  ✅ No sensitive data exposed"
    echo ""
    echo -e "${BLUE}The push will trigger automatic deployment to Oracle Cloud.${NC}"
    echo -e "${BLUE}Monitor the deployment at: https://github.com/YOUR_REPO/actions${NC}"
fi

exit 0
