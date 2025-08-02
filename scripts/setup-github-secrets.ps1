# GitHub Secrets Setup Helper Script (PowerShell)
# This script helps you set up the required secrets for GitHub Actions deployment

$ErrorActionPreference = "Stop"

Write-Host "🔐 GitHub Actions Secrets Setup Helper" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Check if GitHub CLI is installed
if (!(Get-Command "gh" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ GitHub CLI (gh) is not installed." -ForegroundColor Red
    Write-Host "Please install it from: https://cli.github.com/"
    Write-Host "Or use the GitHub web interface to add secrets manually."
    exit 1
}

# Check if user is logged in to GitHub CLI
try {
    gh auth status 2>$null
    Write-Host "✅ GitHub CLI is available and you're logged in." -ForegroundColor Green
} catch {
    Write-Host "⚠️  You're not logged in to GitHub CLI." -ForegroundColor Yellow
    Write-Host "Please run: gh auth login"
    exit 1
}

Write-Host ""

# Get repository information
$repoInfo = gh repo view --json owner,name | ConvertFrom-Json
$repoOwner = $repoInfo.owner.login
$repoName = $repoInfo.name

Write-Host "📂 Repository: $repoOwner/$repoName" -ForegroundColor Blue
Write-Host ""

# Function to set secret
function Set-GitHubSecret {
    param(
        [string]$SecretName,
        [string]$SecretDescription
    )
    
    Write-Host "🔑 Setting up secret: $SecretName" -ForegroundColor Yellow
    Write-Host "Description: $SecretDescription"
    
    $secretValue = ""
    
    # Special handling for SSH private key
    if ($SecretName -eq "SSH_PRIVATE_KEY") {
        Write-Host "Please enter the path to your SSH private key file:"
        $keyPath = Read-Host
        
        if (Test-Path $keyPath) {
            $secretValue = Get-Content -Path $keyPath -Raw
        } else {
            Write-Host "❌ File not found: $keyPath" -ForegroundColor Red
            return $false
        }
    } else {
        Write-Host "Please enter the value for $SecretName"
        $secretValue = Read-Host
    }
    
    if ($secretValue) {
        $secretValue | gh secret set $SecretName --repo "$repoOwner/$repoName"
        Write-Host "✅ Secret $SecretName has been set." -ForegroundColor Green
    } else {
        Write-Host "❌ Empty value provided for $SecretName" -ForegroundColor Red
        return $false
    }
    
    Write-Host ""
    return $true
}

# Set up secrets
Write-Host "Let's set up the required secrets for GitHub Actions deployment:"
Write-Host ""

# HOST secret
Set-GitHubSecret -SecretName "HOST" -SecretDescription "Oracle Cloud server IP address (e.g., 79.72.25.202)"

# USERNAME secret  
Set-GitHubSecret -SecretName "USERNAME" -SecretDescription "SSH username for the server (usually 'ubuntu')"

# SSH_PRIVATE_KEY secret
Set-GitHubSecret -SecretName "SSH_PRIVATE_KEY" -SecretDescription "SSH private key content for server access"

Write-Host "🎉 All secrets have been configured!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Commit and push your GitHub Actions workflow files"
Write-Host "2. Make a test commit to trigger the deployment"
Write-Host "3. Monitor the deployment in the Actions tab of your repository"
Write-Host ""
Write-Host "💡 Tip: You can view your secrets at:" -ForegroundColor Blue
Write-Host "https://github.com/$repoOwner/$repoName/settings/secrets/actions"
