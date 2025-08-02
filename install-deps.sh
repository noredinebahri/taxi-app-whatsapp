#!/bin/bash
# Script d'installation des dépendances WhatsApp Web.js pour Ubuntu/Linux

echo "🔧 Installation des dépendances WhatsApp Transfer VVIP pour Linux"

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Vérifier si on est sur Ubuntu/Debian
check_os() {
    if [[ -f /etc/os-release ]]; then
        . /etc/os-release
        OS=$NAME
        VER=$VERSION_ID
        print_info "Système détecté: $OS $VER"
    else
        print_error "Impossible de détecter le système d'exploitation"
        exit 1
    fi
}

# Mettre à jour les paquets
update_packages() {
    print_info "Mise à jour de la liste des paquets..."
    sudo apt-get update -qq
    print_status "Liste des paquets mise à jour"
}

# Installer les outils de base
install_basic_tools() {
    print_info "Installation des outils de base..."
    sudo apt-get install -y \
        wget \
        curl \
        gnupg \
        ca-certificates \
        apt-transport-https \
        software-properties-common \
        unzip \
        git > /dev/null 2>&1
    print_status "Outils de base installés"
}

# Installer Node.js
install_nodejs() {
    if command -v node &> /dev/null; then
        NODE_VER=$(node --version)
        print_status "Node.js déjà installé: $NODE_VER"
        
        # Vérifier la version (doit être >= 16)
        NODE_MAJOR=$(echo $NODE_VER | cut -d'.' -f1 | cut -d'v' -f2)
        if [ "$NODE_MAJOR" -lt 16 ]; then
            print_warning "Version Node.js trop ancienne ($NODE_VER), mise à jour..."
            install_nodejs_fresh
        fi
    else
        print_info "Installation de Node.js 18..."
        install_nodejs_fresh
    fi
}

install_nodejs_fresh() {
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - > /dev/null 2>&1
    sudo apt-get install -y nodejs > /dev/null 2>&1
    print_status "Node.js installé: $(node --version)"
}

# Installer Google Chrome
install_chrome() {
    if command -v google-chrome &> /dev/null; then
        print_status "Google Chrome déjà installé"
    else
        print_info "Installation de Google Chrome..."
        wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add - > /dev/null 2>&1
        echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list > /dev/null
        sudo apt-get update -qq
        sudo apt-get install -y google-chrome-stable > /dev/null 2>&1
        print_status "Google Chrome installé"
    fi
}

# Installer les dépendances Puppeteer
install_puppeteer_deps() {
    print_info "Installation des dépendances Puppeteer..."
    sudo apt-get install -y \
        gconf-service \
        libasound2 \
        libatk1.0-0 \
        libatk-bridge2.0-0 \
        libc6 \
        libcairo2 \
        libcups2 \
        libdbus-1-3 \
        libexpat1 \
        libfontconfig1 \
        libgcc1 \
        libgconf-2-4 \
        libgdk-pixbuf2.0-0 \
        libglib2.0-0 \
        libgtk-3-0 \
        libnspr4 \
        libpango-1.0-0 \
        libpangocairo-1.0-0 \
        libstdc++6 \
        libx11-6 \
        libx11-xcb1 \
        libxcb1 \
        libxcomposite1 \
        libxcursor1 \
        libxdamage1 \
        libxext6 \
        libxfixes3 \
        libxi6 \
        libxrandr2 \
        libxrender1 \
        libxss1 \
        libxtst6 \
        ca-certificates \
        fonts-liberation \
        libappindicator1 \
        libnss3 \
        lsb-release \
        xdg-utils > /dev/null 2>&1
    print_status "Dépendances Puppeteer installées"
}

# Installer les polices
install_fonts() {
    print_info "Installation des polices..."
    sudo apt-get install -y \
        fonts-liberation \
        fonts-noto-color-emoji \
        fonts-noto-cjk \
        fonts-noto-cjk-extra \
        fonts-dejavu-core > /dev/null 2>&1
    print_status "Polices installées"
}

# Installer PM2
install_pm2() {
    if command -v pm2 &> /dev/null; then
        print_status "PM2 déjà installé"
    else
        print_info "Installation de PM2..."
        sudo npm install -g pm2 > /dev/null 2>&1
        print_status "PM2 installé"
    fi
}

# Configurer les permissions Chrome
setup_chrome_permissions() {
    print_info "Configuration des permissions Chrome..."
    
    # Ajouter l'utilisateur au groupe audio (pour le son)
    sudo usermod -a -G audio $USER
    
    # Créer le répertoire pour Chrome s'il n'existe pas
    mkdir -p ~/.config/google-chrome
    
    print_status "Permissions configurées"
}

# Tester l'installation
test_installation() {
    print_info "Test de l'installation..."
    
    # Tester Node.js
    if command -v node &> /dev/null; then
        print_status "Node.js: $(node --version)"
    else
        print_error "Node.js non trouvé"
        return 1
    fi
    
    # Tester npm
    if command -v npm &> /dev/null; then
        print_status "npm: $(npm --version)"
    else
        print_error "npm non trouvé"
        return 1
    fi
    
    # Tester Chrome
    if command -v google-chrome &> /dev/null; then
        CHROME_VER=$(google-chrome --version)
        print_status "Chrome: $CHROME_VER"
    else
        print_error "Google Chrome non trouvé"
        return 1
    fi
    
    # Tester PM2
    if command -v pm2 &> /dev/null; then
        print_status "PM2: $(pm2 --version)"
    else
        print_error "PM2 non trouvé"
        return 1
    fi
    
    print_status "Tous les composants sont installés correctement!"
}

# Installation spécifique pour serveurs sans interface graphique
install_headless_deps() {
    print_info "Installation des dépendances pour serveur headless..."
    sudo apt-get install -y \
        xvfb \
        x11vnc \
        fluxbox > /dev/null 2>&1
    print_status "Dépendances headless installées"
}

# Fonction principale
main() {
    print_info "🚀 Début de l'installation des dépendances WhatsApp Web.js"
    echo ""
    
    # Vérifier les permissions
    if [ "$EUID" -eq 0 ]; then
        print_error "Ne pas exécuter ce script en tant que root"
        print_info "Utilisez: ./install-deps.sh"
        exit 1
    fi
    
    check_os
    update_packages
    install_basic_tools
    install_nodejs
    install_chrome
    install_puppeteer_deps
    install_fonts
    install_pm2
    setup_chrome_permissions
    
    # Demander si on veut installer les deps headless
    echo ""
    read -p "Installer les dépendances pour serveur sans interface graphique? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        install_headless_deps
    fi
    
    echo ""
    test_installation
    
    echo ""
    print_status "🎉 Installation terminée avec succès!"
    echo ""
    print_info "Prochaines étapes:"
    echo "1. Redémarrer votre session (logout/login) pour appliquer les permissions"
    echo "2. Cloner votre projet WhatsApp Transfer VVIP"
    echo "3. Exécuter: npm install"
    echo "4. Lancer: npm start"
    echo ""
    print_warning "Note: Si vous êtes sur un serveur distant, assurez-vous que Chromium peut s'exécuter en mode headless"
}

# Vérifier les arguments
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "Script d'installation des dépendances WhatsApp Web.js"
    echo ""
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  -h, --help     Afficher cette aide"
    echo "  --headless     Installer uniquement les dépendances headless"
    echo ""
    echo "Ce script installe automatiquement:"
    echo "- Node.js 18"
    echo "- Google Chrome"
    echo "- Dépendances Puppeteer"
    echo "- Polices système"
    echo "- PM2"
    exit 0
fi

if [ "$1" = "--headless" ]; then
    check_os
    update_packages
    install_basic_tools
    install_nodejs
    install_chrome
    install_puppeteer_deps
    install_fonts
    install_pm2
    install_headless_deps
    test_installation
    exit 0
fi

# Exécuter l'installation
main
