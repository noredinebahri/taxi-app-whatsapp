# WhatsApp Transfer VVIP 📱

Un microservice Node.js Express pour l'envoi de messages WhatsApp via WhatsApp Web.

## 🚀 Démarrage rapide

### 1. Installation des dépendances
```bash
npm install
```

### 2. Configuration
Créer un fichier `.env` à la racine du projet :
```bash
API_SECRET_KEY=mySuperSecretKey
PORT=3000
# WHATSAPP_TEST_MODE=true  # Décommentez pour le mode test
```

### 3. Lancement du serveur
```bash
# Mode production
npm start

# Mode développement (avec nodemon)
npm run dev

# Mode test (sans vraie connexion WhatsApp)
WHATSAPP_TEST_MODE=true npm start
```

## 🧪 Tests

### Test complet du service
```bash
# Démarrer le serveur en mode test
WHATSAPP_TEST_MODE=true npm start

# Dans un autre terminal
node test-full.js
```

### Test avec vos numéros
```bash
node test-api.js
```

## 📡 API Endpoints

### 🔐 Authentification
Tous les endpoints nécessitent le header `x-api-key` avec la valeur configurée dans `.env`.

### Health Check
```http
GET /health
```

### 📝 Templates

#### Ajouter un template
```http
POST /api/template
Content-Type: application/json
x-api-key: mySuperSecretKey

{
  "templateId": "welcome",
  "template": "Bonjour {{name}}, bienvenue! Code: {{code}}"
}
```

#### Récupérer tous les templates
```http
GET /api/template
x-api-key: mySuperSecretKey
```

### 📱 Envoi de messages WhatsApp

```http
POST /api/whatsapp/send
Content-Type: application/json
x-api-key: mySuperSecretKey

{
  "senderId": "instance1",
  "recipients": ["+212633030117", "+212621323085"],
  "template": "Bonjour {{name}}, votre rendez-vous est prévu le {{date}}.",
  "params": [
    { "name": "Ali", "date": "2025-08-10" },
    { "name": "Sara", "date": "2025-08-11" }
  ]
}
```

## 🔌 Connexion WhatsApp Web

### Première utilisation
1. Démarrer le serveur sans `WHATSAPP_TEST_MODE`
2. Faire un appel à l'API `/whatsapp/send`
3. Un QR code s'affichera dans la console
4. Scanner le QR code avec WhatsApp mobile :
   - Ouvrir WhatsApp sur votre téléphone
   - Aller dans Paramètres → Appareils liés
   - Cliquer sur "Lier un appareil"
   - Scanner le QR code

### Sessions multiples
Le service supporte plusieurs sessions WhatsApp simultanées via le paramètre `senderId`.

## 🧪 Mode Test

Pour tester l'API sans connexion WhatsApp réelle :
```bash
export WHATSAPP_TEST_MODE=true
# ou
WHATSAPP_TEST_MODE=true npm start
```

En mode test, les messages sont simulés et affichés dans la console.

## 🔒 Sécurité

### API Key
- Toutes les requêtes nécessitent le header `x-api-key`
- La clé secrète est configurée dans la variable d'environnement `API_SECRET_KEY`
- Gardez cette clé confidentielle et ne la partagez qu'avec les services autorisés

### Validation des entrées
- Validation des paramètres requis
- Formatage automatique des numéros de téléphone
- Gestion des erreurs avec logs détaillés

## 📞 Format des numéros de téléphone

Le service accepte les formats suivants :
- `+212633030117`
- `212633030117`
- `+212 633 030 117`

Ils sont automatiquement convertis au format WhatsApp (`212633030117@c.us`).

## 🛠️ Architecture

```
whatsappTransferVVIP/
├── src/
│   ├── app.js                 # Point d'entrée principal
│   ├── controllers/           # Logique des contrôleurs
│   │   ├── whatsappController.js
│   │   └── templateController.js
│   ├── middleware/            # Middlewares Express
│   │   └── auth.js           # Authentification par API key
│   ├── routes/               # Définition des routes
│   │   ├── whatsapp.js
│   │   └── template.js
│   ├── services/             # Logique métier
│   │   ├── whatsappService.js
│   │   └── templateService.js
│   └── utils/                # Utilitaires
│       └── logger.js
├── test-api.js               # Tests avec vos numéros
├── test-full.js              # Test complet du service
└── package.json
```

## 🐛 Dépannage

### Le QR code n'apparaît pas
1. Vérifiez que `WHATSAPP_TEST_MODE` n'est pas activé
2. Regardez les logs de la console pour les erreurs
3. Assurez-vous que Chrome/Chromium est installé sur le système

### Erreurs de connexion
1. Vérifiez votre connexion internet
2. Redémarrez le serveur
3. Supprimez le dossier `.wwebjs_auth` si présent

### Messages non envoyés
1. Vérifiez que la session WhatsApp est active
2. Confirmez le format des numéros de téléphone
3. Vérifiez que les numéros existent sur WhatsApp

## 📊 Logs

Le service fournit des logs détaillés :
- ✅ Succès d'envoi
- ❌ Erreurs avec détails
- 🔄 État des connexions
- 📱 QR codes pour l'authentification

## 🔗 Intégration avec apibackendtransfer

Pour intégrer ce microservice dans votre API principale :

```javascript
import axios from 'axios';

const WHATSAPP_API_URL = 'http://localhost:3000/api';
const WHATSAPP_API_KEY = 'mySuperSecretKey';

async function sendWhatsAppMessage(recipients, template, params) {
  try {
    const response = await axios.post(`${WHATSAPP_API_URL}/whatsapp/send`, {
      senderId: 'apibackendtransfer',
      recipients,
      template,
      params
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': WHATSAPP_API_KEY
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Erreur envoi WhatsApp:', error.response?.data || error.message);
    throw error;
  }
}
```

## 📝 Licence

ISC
