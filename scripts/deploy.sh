#!/bin/bash

# Advanced deployment script for WhatsApp API
# This script handles deployment with rollback capabilities

set -e  # Exit on any error

APP_DIR="/home/ubuntu/taxi-app-whatsapp"
BACKUP_DIR="/home/ubuntu/backups"
LOG_FILE="/home/ubuntu/deployment.log"
HEALTH_ENDPOINT="http://localhost:3000/health"
API_KEY="mySuperSecretKey"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

# Create backup
create_backup() {
    local backup_name="whatsapp-api-$(date +%Y%m%d-%H%M%S)"
    local backup_path="$BACKUP_DIR/$backup_name"
    
    log "Creating backup: $backup_name"
    mkdir -p "$BACKUP_DIR"
    
    if [ -d "$APP_DIR" ]; then
        cp -r "$APP_DIR" "$backup_path"
        echo "$backup_path" > "$BACKUP_DIR/latest_backup.txt"
        success "Backup created: $backup_path"
    else
        warning "Application directory not found, skipping backup"
    fi
    
    # Keep only last 5 backups
    cd "$BACKUP_DIR"
    ls -t | grep "whatsapp-api-" | tail -n +6 | xargs -r rm -rf
}

# Health check function
health_check() {
    local max_attempts=6
    local attempt=1
    
    log "Performing health check..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f -s -H "x-api-key: $API_KEY" "$HEALTH_ENDPOINT" > /dev/null 2>&1; then
            success "Health check passed (attempt $attempt/$max_attempts)"
            return 0
        fi
        
        warning "Health check failed (attempt $attempt/$max_attempts), retrying in 10 seconds..."
        sleep 10
        ((attempt++))
    done
    
    error "Health check failed after $max_attempts attempts"
    return 1
}

# Rollback function
rollback() {
    error "Deployment failed, initiating rollback..."
    
    if [ -f "$BACKUP_DIR/latest_backup.txt" ]; then
        local backup_path=$(cat "$BACKUP_DIR/latest_backup.txt")
        
        if [ -d "$backup_path" ]; then
            log "Rolling back to: $backup_path"
            
            # Stop current application
            pm2 stop whatsapp-vvip || true
            
            # Remove current application
            rm -rf "$APP_DIR"
            
            # Restore from backup
            cp -r "$backup_path" "$APP_DIR"
            
            # Restart application
            cd "$APP_DIR"
            pm2 restart whatsapp-vvip || pm2 start ecosystem.config.js
            
            # Health check after rollback
            if health_check; then
                success "Rollback completed successfully"
                return 0
            else
                error "Rollback failed - manual intervention required"
                return 1
            fi
        else
            error "Backup directory not found: $backup_path"
            return 1
        fi
    else
        error "No backup information found"
        return 1
    fi
}

# Main deployment function
deploy() {
    log "Starting deployment process..."
    
    # Create backup before deployment
    create_backup
    
    # Navigate to application directory
    cd "$APP_DIR" || {
        error "Failed to navigate to application directory"
        exit 1
    }
    
    # Stop PM2 process
    log "Stopping application..."
    pm2 stop whatsapp-vvip || true
    
    # Pull latest changes
    log "Pulling latest changes from Git..."
    git fetch origin || {
        error "Failed to fetch from Git"
        rollback
        exit 1
    }
    
    git reset --hard origin/main || {
        error "Failed to reset to origin/main"
        rollback
        exit 1
    }
    
    git clean -fd || {
        error "Failed to clean Git directory"
        rollback
        exit 1
    }
    
    # Install/update dependencies
    log "Installing dependencies..."
    npm ci --production || {
        error "Failed to install dependencies"
        rollback
        exit 1
    }
    
    # Start application
    log "Starting application..."
    pm2 restart whatsapp-vvip || pm2 start ecosystem.config.js || {
        error "Failed to start application"
        rollback
        exit 1
    }
    
    # Wait for application to start
    log "Waiting for application to initialize..."
    sleep 15
    
    # Perform health check
    if health_check; then
        success "Deployment completed successfully!"
        
        # Show PM2 status
        log "Current PM2 status:"
        pm2 status
        
        # Show application logs
        log "Recent application logs:"
        pm2 logs whatsapp-vvip --lines 10 --nostream
        
        return 0
    else
        error "Health check failed after deployment"
        rollback
        exit 1
    fi
}

# Pre-deployment checks
pre_deployment_checks() {
    log "Running pre-deployment checks..."
    
    # Check if PM2 is available
    if ! command -v pm2 &> /dev/null; then
        error "PM2 is not installed or not in PATH"
        exit 1
    fi
    
    # Check if Git is available
    if ! command -v git &> /dev/null; then
        error "Git is not installed or not in PATH"
        exit 1
    fi
    
    # Check if npm is available
    if ! command -v npm &> /dev/null; then
        error "npm is not installed or not in PATH"
        exit 1
    fi
    
    # Check if application directory exists
    if [ ! -d "$APP_DIR" ]; then
        error "Application directory does not exist: $APP_DIR"
        exit 1
    fi
    
    success "Pre-deployment checks passed"
}

# Main execution
main() {
    log "=== WhatsApp API Deployment Script ==="
    log "Timestamp: $(date)"
    log "User: $(whoami)"
    log "Host: $(hostname)"
    
    pre_deployment_checks
    deploy
    
    success "=== Deployment completed successfully ==="
}

# Execute main function
main "$@"
