#!/bin/bash
# Script de déploiement WhatsApp Transfer VVIP

echo "🚀 Déploiement WhatsApp Transfer VVIP"

# Variables
APP_NAME="whatsapp-transfer-vvip"
APP_DIR="/home/$(whoami)/apps/whatsappTransferVVIP"
NODE_VERSION="18"

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier si Node.js est installé
check_nodejs() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js n'est pas installé"
        print_status "Installation de Node.js ${NODE_VERSION}..."
        curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
        sudo apt-get install -y nodejs
    else
        NODE_VER=$(node --version)
        print_status "Node.js détecté: ${NODE_VER}"
    fi
}

# Installer PM2 si nécessaire
install_pm2() {
    if ! command -v pm2 &> /dev/null; then
        print_status "Installation de PM2..."
        npm install -g pm2
    else
        print_status "PM2 déjà installé"
    fi
}

# Créer le répertoire de l'application
setup_directory() {
    print_status "Configuration du répertoire..."
    mkdir -p "$(dirname "$APP_DIR")"
    
    if [ ! -d "$APP_DIR" ]; then
        mkdir -p "$APP_DIR"
        print_status "Répertoire créé: $APP_DIR"
    fi
}

# Copier les fichiers (si ce script est exécuté depuis le projet)
deploy_files() {
    if [ -f "package.json" ]; then
        print_status "Copie des fichiers vers $APP_DIR..."
        cp -r . "$APP_DIR/"
        cd "$APP_DIR"
    else
        print_error "Ce script doit être exécuté depuis le répertoire du projet"
        exit 1
    fi
}

# Installer les dépendances
install_dependencies() {
    print_status "Installation des dépendances..."
    npm install --production
    
    if [ $? -eq 0 ]; then
        print_status "Dépendances installées avec succès"
    else
        print_error "Erreur lors de l'installation des dépendances"
        exit 1
    fi
}

# Configurer l'environnement
setup_environment() {
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            print_status "Création du fichier .env..."
            cp .env.example .env
            print_warning "Pensez à modifier le fichier .env avec vos paramètres"
        else
            print_status "Création du fichier .env par défaut..."
            cat > .env << 'EOF'
PORT=3000
API_SECRET_KEY=your-super-secret-production-key
NODE_ENV=production
WHATSAPP_TEST_MODE=false
EOF
            print_warning "Fichier .env créé avec des valeurs par défaut"
        fi
    else
        print_status "Fichier .env déjà présent"
    fi
}

# Configurer PM2
setup_pm2() {
    print_status "Configuration de PM2..."
    
    cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'whatsapp-transfer-vvip',
    script: 'src/app.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    env: {
      NODE_ENV: 'production'
    }
  }]
}
EOF

    # Créer le répertoire des logs
    mkdir -p logs
    
    print_status "Configuration PM2 créée"
}

# Démarrer l'application
start_application() {
    print_status "Démarrage de l'application..."
    
    # Arrêter l'application si elle existe déjà
    pm2 stop $APP_NAME 2>/dev/null || true
    pm2 delete $APP_NAME 2>/dev/null || true
    
    # Démarrer l'application
    pm2 start ecosystem.config.js
    
    if [ $? -eq 0 ]; then
        print_status "Application démarrée avec succès"
        pm2 save
        
        # Configurer le démarrage automatique
        print_status "Configuration du démarrage automatique..."
        pm2 startup 2>/dev/null | grep -E '^sudo.*' | sh
        
        print_status "Statut de l'application:"
        pm2 status
    else
        print_error "Erreur lors du démarrage de l'application"
        exit 1
    fi
}

# Afficher les informations de fin
show_info() {
    print_status "🎉 Déploiement terminé!"
    echo ""
    echo "📱 Application WhatsApp Transfer VVIP déployée"
    echo "🌐 URL: http://$(hostname -I | awk '{print $1}'):3000"
    echo "📝 Logs: pm2 logs $APP_NAME"
    echo "📊 Status: pm2 status"
    echo "🔄 Restart: pm2 restart $APP_NAME"
    echo ""
    print_warning "N'oubliez pas de:"
    echo "1. Modifier le fichier .env avec vos vraies valeurs"
    echo "2. Configurer un reverse proxy (Nginx) si nécessaire"
    echo "3. Scanner le QR code WhatsApp pour la première utilisation"
    echo "4. Tester l'API avec: curl -H 'x-api-key: your-api-key' http://localhost:3000/health"
}

# Exécution principale
main() {
    print_status "Début du déploiement..."
    
    check_nodejs
    install_pm2
    setup_directory
    deploy_files
    install_dependencies
    setup_environment
    setup_pm2
    start_application
    show_info
}

# Vérifier si le script est exécuté avec les bonnes permissions
if [ "$EUID" -eq 0 ]; then
    print_error "Ne pas exécuter ce script en tant que root"
    exit 1
fi

# Exécuter le déploiement
main
