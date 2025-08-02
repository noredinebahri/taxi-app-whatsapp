# GitHub Secrets Configuration

## 🔐 Required Repository Secrets

Add these secrets to your GitHub repository:
**Settings → Secrets and variables → Actions → New repository secret**

### 1. HOST
```
Name: HOST
Value: 79.72.25.202
```

### 2. USERNAME
```
Name: USERNAME
Value: ubuntu
```

### 3. SSH_PRIVATE_KEY
```
Name: SSH_PRIVATE_KEY
Value: [Copy the ENTIRE content of github-actions-key file]
```

## 📋 How to Copy SSH Private Key

1. Open the file `github-actions-key` in a text editor
2. Copy ALL content including:
   - `-----BEGIN OPENSSH PRIVATE KEY-----`
   - All the key content
   - `-----END OPENSSH PRIVATE KEY-----`
3. Paste exactly as is in the GitHub secret

## ✅ Verification Steps

After adding secrets, verify:
1. All 3 secrets are added
2. No extra spaces in values
3. SSH key includes begin/end markers
4. HOST is the correct IP address

## 🚀 Ready to Deploy!

Once secrets are configured:
1. Push code to main branch
2. GitHub Actions will automatically deploy
3. Check Actions tab for deployment status
