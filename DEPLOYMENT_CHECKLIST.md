# ✅ GitHub Actions Setup Checklist

## 📋 Before You Start
- [x] SSH key pair generated (`github-actions-key` and `github-actions-key.pub`)
- [x] Public key added to Oracle Cloud server
- [x] GitHub Actions workflow file created (`.github/workflows/deploy.yml`)
- [x] Deployment script created (`scripts/deploy.sh`)

## 🔐 GitHub Repository Configuration

### 1. Repository Secrets (**CRITICAL**)
Go to: **GitHub Repository → Settings → Secrets and variables → Actions**

Add these **3 secrets**:

| Secret Name | Value |
|-------------|-------|
| `HOST` | `79.72.25.202` |
| `USERNAME` | `ubuntu` |
| `SSH_PRIVATE_KEY` | Content of `github-actions-key` file |

### 2. GitHub Actions Permissions
Go to: **GitHub Repository → Settings → Actions → General**
- ✅ Allow GitHub Actions
- ✅ Allow actions created by GitHub
- ✅ Allow specified actions and reusable workflows

## 🚀 Testing Your Setup

### 1. Test SSH Connection (Local)
```bash
ssh -i github-actions-key ubuntu@79.72.25.202 "echo 'SSH works!'"
```

### 2. Test Deployment (GitHub)
```bash
git add .
git commit -m "Setup GitHub Actions deployment"
git push origin main
```

### 3. Monitor Deployment
1. Go to GitHub repository
2. Click **"Actions"** tab
3. Watch the workflow run
4. Check deployment status

## 🎯 Expected Results

### After Push to Main Branch:
1. **GitHub Actions triggers** automatically
2. **Tests run** (if any)
3. **Code deploys** to Oracle Cloud
4. **PM2 restarts** the application
5. **Health check** verifies API is working
6. **Success notification** in GitHub

### Deployment URL:
**http://79.72.25.202:3000**

## 🔧 Troubleshooting

### If Deployment Fails:
1. Check **Actions** tab for error logs
2. Verify all 3 secrets are correctly set
3. Ensure SSH key format is correct
4. Check server accessibility

### Common Issues:
- ❌ SSH key missing BEGIN/END markers
- ❌ Extra spaces in secret values
- ❌ Wrong server IP or username
- ❌ Firewall blocking connections

## 📞 Support Commands

### Check SSH Key on Server:
```bash
ssh ubuntu@79.72.25.202 "cat ~/.ssh/authorized_keys | grep github-actions-deploy"
```

### Check Application Status:
```bash
ssh ubuntu@79.72.25.202 "pm2 status && curl -s localhost:3000/health"
```

### View Deployment Logs:
```bash
ssh ubuntu@79.72.25.202 "pm2 logs whatsapp-vvip --lines 20"
```

---

## 🎉 Success Criteria

✅ **GitHub Actions runs without errors**  
✅ **Application deploys to server**  
✅ **PM2 shows app as 'online'**  
✅ **Health endpoint returns 200 OK**  
✅ **API responds to requests**  

**Your WhatsApp Transfer VVIP API is now fully automated! 🚀**
