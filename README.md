# 📱 WhatsApp Transfer VVIP

Un microservice Node.js puissant pour l'envoi automatisé de messages WhatsApp avec templates avancés et fonctionnalités professionnelles.

![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![Express](https://img.shields.io/badge/Express-4.18-blue)
![WhatsApp](https://img.shields.io/badge/WhatsApp-Web.js-25D366)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🚀 **Fonctionnalités**

### **📨 Envoi de Messages**
- ✅ Messages texte avec templates personnalisables
- ✅ Variables dynamiques (`{{nom}}`, `{{commande}}`, etc.)
- ✅ Support multi-destinataires
- ✅ Gestion de sessions multiples

### **🎯 Fonctionnalités Avancées**
- 📊 **Sondages interactifs** avec options multiples
- 🎬 **Médias** (images, vidéos, documents)
- 📍 **Localisation** géographique
- 👤 **Cartes de contact** professionnelles
- 💬 **Messages riches** avec formatage
- ⚡ **Réactions suggérées**

### **📋 Templates Prêts à l'Emploi**
- 🎉 Message de bienvenue
- ✅ Confirmation de commande
- 🚚 Notification de livraison
- 🎁 Promotions spéciales
- 📅 Rappels de rendez-vous
- 💳 Demandes de paiement
- ⭐ Enquêtes de satisfaction
- 📰 Newsletters
- 🚨 Alertes d'urgence
- 🎂 Vœux d'anniversaire

## 🏗️ **Architecture**

```
whatsappTransferVVIP/
├── src/
│   ├── app.js                 # Serveur Express principal
│   ├── controllers/           # Logique métier
│   │   ├── whatsappController.js
│   │   └── templateController.js
│   ├── services/              # Services WhatsApp
│   │   ├── whatsappService.js
│   │   └── templateService.js
│   ├── routes/                # Routes API
│   │   ├── whatsapp.js
│   │   └── template.js
│   ├── middleware/            # Sécurité & authentification
│   │   └── auth.js
│   └── utils/                 # Utilitaires
│       └── logger.js
├── deploy.sh                  # Script de déploiement
├── install-deps.sh           # Installation dépendances système
└── Dockerfile                # Container Docker
```

## 🚀 **Installation Rapide**

### **Prérequis**
- Node.js 18+
- Linux/Ubuntu (pour les dépendances WhatsApp)
- Git

### **1. Cloner le projet**
```bash
git clone https://github.com/noredinebahri/taxi-app-whatsapp.git
cd taxi-app-whatsapp/whatsappTransferVVIP
```

### **2. Installation automatique (Linux/Ubuntu)**
```bash
chmod +x install-deps.sh deploy.sh
./install-deps.sh  # Installe les dépendances système
./deploy.sh        # Déploie l'application
```

### **3. Installation manuelle**
```bash
# Installer les dépendances Node.js
npm install

# Configurer l'environnement
cp .env.example .env
nano .env  # Modifier avec vos paramètres

# Démarrer l'application
npm start
```

## ⚙️ **Configuration**

### **Fichier .env**
```bash
# Port du serveur
PORT=3000

# Clé API pour la sécurité
API_SECRET_KEY=votre-cle-super-secrete

# Environnement
NODE_ENV=production

# Mode test (désactiver en production)
WHATSAPP_TEST_MODE=false
```

## 📡 **API Endpoints**

### **🔧 Gestion des Sessions**
```bash
# Statut d'une session
GET /api/whatsapp/session/{senderId}/status

# Toutes les sessions
GET /api/whatsapp/sessions/status

# Déconnecter une session
POST /api/whatsapp/session/{senderId}/disconnect
```

### **📨 Envoi de Messages**
```bash
# Message simple
POST /api/whatsapp/send

# Sondage interactif
POST /api/whatsapp/send-poll

# Média (image/vidéo/document)
POST /api/whatsapp/send-media

# Localisation
POST /api/whatsapp/send-location

# Carte de contact
POST /api/whatsapp/send-contact
```

### **📋 Templates Métier**
```bash
# Message de bienvenue
POST /api/whatsapp/templates/welcome

# Confirmation de commande
POST /api/whatsapp/templates/order-confirmation

# Notification de livraison
POST /api/whatsapp/templates/delivery-notification

# Promotion
POST /api/whatsapp/templates/promotion

# Rappel de rendez-vous
POST /api/whatsapp/templates/appointment-reminder

# Demande de paiement
POST /api/whatsapp/templates/payment-request

# Enquête de satisfaction
POST /api/whatsapp/templates/customer-satisfaction

# Newsletter
POST /api/whatsapp/templates/newsletter

# Alerte d'urgence
POST /api/whatsapp/templates/emergency-alert

# Vœux d'anniversaire
POST /api/whatsapp/templates/birthday-wishes
```

## 💡 **Exemples d'Utilisation**

### **Message Simple**
```bash
curl -X POST "http://localhost:3000/api/whatsapp/send" \
  -H "Content-Type: application/json" \
  -H "x-api-key: mySuperSecretKey" \
  -d '{
    "recipients": ["+212633030117"],
    "template": "Bonjour {{nom}}, votre commande {{numero}} est prête!",
    "params": [{"nom": "Ahmed", "numero": "#1234"}]
  }'
```

### **Sondage Interactif**
```bash
curl -X POST "http://localhost:3000/api/whatsapp/send-poll" \
  -H "Content-Type: application/json" \
  -H "x-api-key: mySuperSecretKey" \
  -d '{
    "recipients": ["+212633030117"],
    "pollData": {
      "question": "Quel est votre plat préféré?",
      "options": ["Pizza", "Tacos", "Burger", "Salade"],
      "allowMultipleAnswers": false
    }
  }'
```

### **Message de Bienvenue**
```bash
curl -X POST "http://localhost:3000/api/whatsapp/templates/welcome" \
  -H "Content-Type: application/json" \
  -H "x-api-key: mySuperSecretKey" \
  -d '{
    "recipients": ["+212633030117"],
    "customerName": "Ahmed",
    "companyName": "Restaurant Al Fassia"
  }'
```

## 🐳 **Déploiement Docker**

```bash
# Construire l'image
docker build -t whatsapp-transfer-vvip .

# Lancer le container
docker run -d \
  --name whatsapp-api \
  -p 3000:3000 \
  -v $(pwd)/.wwebjs_auth:/app/.wwebjs_auth \
  -e API_SECRET_KEY=votre-cle-secrete \
  whatsapp-transfer-vvip
```

## 🌐 **Hébergement Simple**

Ce projet fonctionne parfaitement sur :
- **VPS Linux** (OVH, Contabo, DigitalOcean)
- **Serveur dédié**
- **Hébergement mutualisé** avec Node.js
- **Raspberry Pi**

Pas besoin de cloud complexe ! 🎯

## 🔒 **Sécurité**

- ✅ Authentification par clé API
- ✅ Validation des entrées
- ✅ Sessions isolées
- ✅ Logs détaillés
- ✅ Protection contre les abus

## 📞 **Support Maroc**

- ✅ Numéros marocains (+212...)
- ✅ Formatage automatique
- ✅ Validation locale
- ✅ Interface en français

## 🤝 **Contribution**

1. Fork le projet
2. Créer une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📝 **Licence**

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🙏 **Remerciements**

- [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) - Bibliothèque WhatsApp
- [Express.js](https://expressjs.com/) - Framework web
- Communauté Node.js

## 📧 **Contact**

- **Auteur**: Noureddine Bahri
- **GitHub**: [@noredinebahri](https://github.com/noredinebahri)
- **Projet**: [taxi-app-whatsapp](https://github.com/noredinebahri/taxi-app-whatsapp)

---

⭐ **N'oubliez pas de mettre une étoile si ce projet vous aide !** ⭐