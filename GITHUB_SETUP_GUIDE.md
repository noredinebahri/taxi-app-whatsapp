## 🎯 **EXACT GITHUB CONFIGURATION STEPS**

### **Step 1: Go to Your GitHub Repository**
1. Open your browser
2. Navigate to your GitHub repository: `https://github.com/yourusername/your-repo-name`

### **Step 2: Access Repository Secrets**
1. Click the **"Settings"** tab at the top of your repository
2. In the left sidebar, click **"Secrets and variables"**
3. Click **"Actions"**
4. Click **"New repository secret"**

### **Step 3: Add Required Secrets**

#### **Secret 1: HOST**
- **Name:** `HOST`
- **Value:** `79.72.25.202`
- Click **"Add secret"**

#### **Secret 2: USERNAME**
- **Name:** `USERNAME`
- **Value:** `ubuntu`
- Click **"Add secret"**

#### **Secret 3: SSH_PRIVATE_KEY**
- **Name:** `SSH_PRIVATE_KEY`
- **Value:** Copy this EXACT content (including the BEGIN/END lines):

```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACCfYnYY/SxdHGkJDvfJFt+PTjfuL9yKKJBRjMG9KCjjsAAAAJjv/wjy7/8I
8gAAAAtzc2gtZWQyNTUxOQAAACCfYnYY/SxdHGkJDvfJFt+PTjfuL9yKKJBRjMG9KCjjsA
AAAEBkD/XoIGL6V55yVwlv1ntd80B4uIC08bMMhceLO1c8CJ9idhj9LF0caQkO98kW349O
N+4v3IookFGMwb0oKOOwAAAAFWdpdGh1Yi1hY3Rpb25zLWRlcGxveQ==
-----END OPENSSH PRIVATE KEY-----
```

- Click **"Add secret"**

### **Step 4: Verify Secrets**
After adding all secrets, you should see:
- ✅ HOST
- ✅ USERNAME  
- ✅ SSH_PRIVATE_KEY

### **Step 5: Commit and Push Your Code**
```bash
git add .
git commit -m "Add GitHub Actions CI/CD pipeline"
git push origin main
```

### **Step 6: Monitor Deployment**
1. Go to the **"Actions"** tab in your GitHub repository
2. You'll see the workflow running
3. Click on the workflow to see detailed logs
4. Deployment takes ~2-3 minutes

### **🎉 That's It!**
Your WhatsApp API will now automatically deploy to Oracle Cloud whenever you:
- Push to main branch
- Merge a pull request

**API URL after deployment:** `http://79.72.25.202:3000`
