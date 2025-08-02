# GitHub Actions Deployment Setup

This guide explains how to set up automated deployment to your Oracle Cloud server using GitHub Actions.

## 🚀 Overview

The GitHub Actions workflow automatically:
- ✅ Runs tests when code is pushed or PR is created
- 🚀 Deploys to Oracle Cloud server on main branch push or PR merge
- 🏥 Performs health checks to ensure deployment success
- 🔄 Provides automatic rollback on deployment failure
- 📦 Creates backups before each deployment

## 🔧 Setup Instructions

### 1. Repository Secrets Configuration

You need to add the following secrets to your GitHub repository:

1. Go to your GitHub repository
2. Click on **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add these secrets:

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `HOST` | Oracle Cloud server IP | `79.72.25.202` |
| `USERNAME` | SSH username | `ubuntu` |
| `SSH_PRIVATE_KEY` | Private SSH key content | `-----BEGIN OPENSSH PRIVATE KEY-----...` |

### 2. SSH Key Setup

If you don't have SSH key access set up:

```bash
# On your local machine, generate SSH key pair
ssh-keygen -t rsa -b 4096 -f github-actions-key

# Copy public key to server
ssh-copy-id -i github-actions-key.pub ubuntu@79.72.25.202

# Copy private key content to GitHub secret
cat github-actions-key
```

### 3. Server Preparation

Ensure your Oracle Cloud server has:
- Git repository cloned at `/home/ubuntu/taxi-app-whatsapp`
- PM2 installed and configured
- Node.js and npm installed
- Proper firewall rules (port 3000 open)

```bash
# On your server, initialize the repository
cd /home/ubuntu
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git taxi-app-whatsapp
cd taxi-app-whatsapp

# Ensure PM2 is set up
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 📋 Workflow Details

### Triggers
- **Push to main branch**: Triggers immediate deployment
- **Pull Request merged**: Triggers deployment when PR is merged to main
- **Pull Request opened**: Runs tests only (no deployment)

### Jobs

#### 1. Test Job
- 🟢 Sets up Node.js environment
- 📦 Installs dependencies
- 🧪 Runs tests (if available)
- 🔍 Performs security audit

#### 2. Deploy Job
- 📂 Copies deployment script to server
- 🚀 Executes deployment with backup and rollback capabilities
- 🏥 Performs health checks
- 📊 Shows PM2 status and logs

#### 3. Rollback Job (if deployment fails)
- 🔄 Automatically restores from latest backup
- ⚡ Ensures service availability

## 🛠️ Deployment Script Features

The deployment script (`scripts/deploy.sh`) includes:

- **Pre-deployment checks**: Validates environment and dependencies
- **Automatic backup**: Creates timestamped backups before deployment
- **Graceful shutdown**: Stops application properly before update
- **Health monitoring**: Verifies application health after deployment
- **Smart rollback**: Automatically reverts on failure
- **Logging**: Comprehensive logging of all operations
- **Cleanup**: Maintains only last 5 backups

## 📊 Monitoring Deployment

### Viewing Deployment Status
1. Go to your GitHub repository
2. Click on **Actions** tab
3. Select the latest workflow run
4. Monitor real-time logs and status

### Health Check Endpoints
After deployment, verify these endpoints:
- Health: `http://79.72.25.202:3000/health`
- Sessions: `http://79.72.25.202:3000/api/whatsapp/sessions/status`

### Server Logs
SSH to your server to check detailed logs:
```bash
# Application logs
pm2 logs whatsapp-vvip

# Deployment logs
tail -f /home/ubuntu/deployment.log

# PM2 status
pm2 status
```

## 🔒 Security Considerations

- ✅ Private SSH key is stored securely in GitHub Secrets
- ✅ API keys are not exposed in logs
- ✅ Server access is limited to SSH key authentication
- ✅ Deployment script validates inputs and handles errors
- ✅ Automatic rollback prevents extended downtime

## 🚨 Troubleshooting

### Common Issues

1. **SSH Connection Failed**
   - Verify SSH private key is correctly added to GitHub Secrets
   - Ensure public key is in server's `~/.ssh/authorized_keys`
   - Check server firewall allows SSH (port 22)

2. **Deployment Script Permission Denied**
   - Script is automatically made executable by workflow
   - Verify user has write permissions to application directory

3. **Health Check Failed**
   - Check if application started properly: `pm2 status`
   - Verify port 3000 is open and not blocked
   - Check application logs: `pm2 logs whatsapp-vvip`

4. **Git Pull Failed**
   - Ensure server has internet connectivity
   - Verify Git repository is properly configured
   - Check if there are local changes conflicting with remote

### Manual Rollback
If automatic rollback fails:
```bash
# On server
cd /home/ubuntu/backups
ls -la  # Find latest backup
cp -r whatsapp-api-YYYYMMDD-HHMMSS /home/ubuntu/taxi-app-whatsapp
cd /home/ubuntu/taxi-app-whatsapp
pm2 restart whatsapp-vvip
```

## 📈 Workflow Optimization Tips

1. **Branch Protection**: Set up branch protection rules requiring PR reviews
2. **Environment Secrets**: Use environment-specific secrets for staging/production
3. **Notifications**: Add Slack/Discord notifications for deployment status
4. **Parallel Testing**: Run multiple test suites in parallel
5. **Caching**: Utilize GitHub Actions caching for faster builds

## 🎯 Next Steps

After setting up the workflow:
1. Test with a small change to trigger deployment
2. Monitor the deployment process in GitHub Actions
3. Verify application health post-deployment
4. Set up monitoring and alerting for production
5. Consider adding staging environment for additional testing

---

**Note**: Always test the deployment process in a staging environment before using in production!
