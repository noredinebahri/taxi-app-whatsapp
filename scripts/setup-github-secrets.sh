#!/bin/bash

# GitHub Secrets Setup Helper Script
# This script helps you set up the required secrets for GitHub Actions deployment

set -e

echo "🔐 GitHub Actions Secrets Setup Helper"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo -e "${RED}❌ GitHub CLI (gh) is not installed.${NC}"
    echo "Please install it from: https://cli.github.com/"
    echo "Or use the GitHub web interface to add secrets manually."
    exit 1
fi

# Check if user is logged in to GitHub CLI
if ! gh auth status &> /dev/null; then
    echo -e "${YELLOW}⚠️  You're not logged in to GitHub CLI.${NC}"
    echo "Please run: gh auth login"
    exit 1
fi

echo -e "${GREEN}✅ GitHub CLI is available and you're logged in.${NC}"
echo ""

# Get repository information
REPO_INFO=$(gh repo view --json owner,name)
REPO_OWNER=$(echo $REPO_INFO | jq -r '.owner.login')
REPO_NAME=$(echo $REPO_INFO | jq -r '.name')

echo -e "${BLUE}📂 Repository: ${REPO_OWNER}/${REPO_NAME}${NC}"
echo ""

# Function to set secret
set_secret() {
    local secret_name=$1
    local secret_description=$2
    local secret_value=""
    
    echo -e "${YELLOW}🔑 Setting up secret: ${secret_name}${NC}"
    echo "Description: $secret_description"
    
    # Special handling for SSH private key
    if [ "$secret_name" = "SSH_PRIVATE_KEY" ]; then
        echo "Please enter the path to your SSH private key file:"
        read -r key_path
        
        if [ -f "$key_path" ]; then
            secret_value=$(cat "$key_path")
        else
            echo -e "${RED}❌ File not found: $key_path${NC}"
            return 1
        fi
    else
        echo "Please enter the value for $secret_name:"
        read -r secret_value
    fi
    
    if [ -n "$secret_value" ]; then
        echo "$secret_value" | gh secret set "$secret_name" --repo "${REPO_OWNER}/${REPO_NAME}"
        echo -e "${GREEN}✅ Secret $secret_name has been set.${NC}"
    else
        echo -e "${RED}❌ Empty value provided for $secret_name${NC}"
        return 1
    fi
    
    echo ""
}

# Set up secrets
echo "Let's set up the required secrets for GitHub Actions deployment:"
echo ""

# HOST secret
set_secret "HOST" "Oracle Cloud server IP address (e.g., 79.72.25.202)"

# USERNAME secret  
set_secret "USERNAME" "SSH username for the server (usually 'ubuntu')"

# SSH_PRIVATE_KEY secret
set_secret "SSH_PRIVATE_KEY" "SSH private key content for server access"

echo -e "${GREEN}🎉 All secrets have been configured!${NC}"
echo ""
echo "Next steps:"
echo "1. Commit and push your GitHub Actions workflow files"
echo "2. Make a test commit to trigger the deployment"
echo "3. Monitor the deployment in the Actions tab of your repository"
echo ""
echo -e "${BLUE}💡 Tip: You can view your secrets at:${NC}"
echo "https://github.com/${REPO_OWNER}/${REPO_NAME}/settings/secrets/actions"
