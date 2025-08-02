# Dockerfile pour WhatsApp Transfer VVIP
# Cette solution évite d'installer les dépendances sur le serveur hôte

FROM node:18-slim

# Installer les dépendances système uniquement dans le container
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    fonts-noto-color-emoji \
    && rm -rf /var/lib/apt/lists/*

# Créer un utilisateur non-root
RUN useradd -m -s /bin/bash whatsapp

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances Node.js
RUN npm ci --only=production

# Copier le code source
COPY . .

# Changer le propriétaire des fichiers
RUN chown -R whatsapp:whatsapp /app

# Passer à l'utilisateur non-root
USER whatsapp

# Variables d'environnement pour Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Exposer le port
EXPOSE 3000

# Commande de démarrage
CMD ["node", "src/app.js"]
