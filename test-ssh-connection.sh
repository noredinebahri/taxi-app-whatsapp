#!/bin/bash

# Test GitHub Actions SSH Connection
# This script helps verify that GitHub Actions can connect to your server

echo "🔍 Testing SSH connection from local machine..."
echo "📍 Server: 79.72.25.202"
echo "👤 User: ubuntu"
echo ""

# Test SSH connection using the GitHub Actions key
ssh -i github-actions-key -o StrictHostKeyChecking=no ubuntu@79.72.25.202 "
echo '✅ SSH connection successful!'
echo ''
echo '📊 Current server status:'
echo '  - Hostname: \$(hostname)'
echo '  - Date: \$(date)'
echo '  - Uptime: \$(uptime)'
echo ''
echo '🔧 PM2 Status:'
pm2 status 2>/dev/null || echo 'PM2 not running'
echo ''
echo '📁 Application directory:'
ls -la /home/ubuntu/taxi-app-whatsapp/ 2>/dev/null || echo 'Directory not found'
echo ''
echo '🌐 Port 3000 status:'
ss -tlnp | grep :3000 || echo 'Port 3000 not listening'
"

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SUCCESS! GitHub Actions will be able to connect to your server."
    echo "🚀 You can now push your code and watch the automatic deployment!"
else
    echo ""
    echo "❌ FAILED! There's an issue with the SSH connection."
    echo "🔧 Please check:"
    echo "  1. SSH key was added to server's authorized_keys"
    echo "  2. Server is accessible from your location"
    echo "  3. Firewall allows SSH connections"
fi
