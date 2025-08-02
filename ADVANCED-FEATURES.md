# 🚀 WhatsApp Transfer VVIP - Fonctionnalités Avancées

## 📋 Nouvelles Fonctionnalités

Ce document détaille les nouvelles fonctionnalités avancées ajoutées au service WhatsApp Transfer VVIP, basées sur la documentation officielle de [whatsapp-web.js](https://docs.wwebjs.dev/).

## 🎯 Fonctionnalités Disponibles

### 1. 📊 Sondages (Polls)

Créez des sondages interactifs pour recueillir l'avis de vos utilisateurs.

**Endpoint:** `POST /api/whatsapp/send-poll`

**Paramètres:**
```json
{
  "senderId": "default",
  "recipients": ["+212633030117"],
  "pollData": {
    "question": "Quelle est votre couleur préférée?",
    "options": ["🔴 Rouge", "🔵 Bleu", "🟢 Vert", "🟡 Jaune"],
    "allowMultipleAnswers": false
  }
}
```

**Exemple d'utilisation pour TaxiApp:**
```bash
curl -X POST "http://localhost:3000/api/whatsapp/send-poll" \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-secret-api-key-here" \
  -d '{
    "senderId": "default",
    "recipients": ["+212633030117"],
    "pollData": {
      "question": "Quel type de taxi préférez-vous?",
      "options": ["🚖 Standard", "🚗 Premium", "🚐 Van", "🏍️ Moto"],
      "allowMultipleAnswers": false
    }
  }'
```

### 2. 📍 Localisation

Envoyez des localisations géographiques avec nom et adresse.

**Endpoint:** `POST /api/whatsapp/send-location`

**Paramètres:**
```json
{
  "senderId": "default",
  "recipients": ["+212633030117"],
  "locationData": {
    "latitude": 33.5731,
    "longitude": -7.5898,
    "name": "Aéroport Mohammed V",
    "address": "Casablanca, Maroc"
  }
}
```

**Cas d'usage:**
- Points de rendez-vous populaires
- Localisation des chauffeurs
- Destinations fréquentes

### 3. 🎬 Médias (Images, Vidéos, Documents)

Envoyez des fichiers multimédias avec légendes.

**Endpoint:** `POST /api/whatsapp/send-media`

**Options de source:**
- `filePath`: Chemin vers un fichier local
- `url`: URL d'un fichier en ligne
- `base64`: Données encodées en base64

**Exemple avec URL:**
```json
{
  "senderId": "default",
  "recipients": ["+212633030117"],
  "mediaData": {
    "url": "https://example.com/taxi-photo.jpg",
    "caption": "Votre taxi vous attend! 🚖"
  }
}
```

**Exemple avec fichier local:**
```json
{
  "senderId": "default",
  "recipients": ["+212633030117"],
  "mediaData": {
    "filePath": "/path/to/driver-photo.jpg",
    "caption": "Photo de votre chauffeur: Ahmed"
  }
}
```

### 4. 👤 Cartes de Contact

Partagez des contacts professionnels.

**Endpoint:** `POST /api/whatsapp/send-contact`

**Paramètres:**
```json
{
  "senderId": "default",
  "recipients": ["+212633030117"],
  "contactData": {
    "name": "Service Client TaxiApp",
    "number": "+212522123456",
    "organization": "TaxiApp Morocco"
  }
}
```

### 5. 😊 Messages avec Réactions Suggérées

Encouragez l'interaction avec des réactions suggérées.

**Endpoint:** `POST /api/whatsapp/send-message-with-reaction`

**Paramètres:**
```json
{
  "senderId": "default",
  "recipients": ["+212633030117"],
  "messageData": {
    "text": "Comment était votre course?",
    "suggestedReactions": ["⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"]
  }
}
```

### 6. ✨ Messages Riches

Messages avec mise en forme avancée, mentions et citations.

**Endpoint:** `POST /api/whatsapp/send-rich-message`

**Paramètres:**
```json
{
  "senderId": "default",
  "recipients": ["+212633030117"],
  "messageData": {
    "text": "🚖 *RÉSERVATION CONFIRMÉE*\n\n📋 Détails:\n👤 Passager: John Doe\n📱 Contact: +212633030117",
    "mentions": ["+212633030117"],
    "quotedMessage": "message_id_to_quote"
  }
}
```

## 🔧 Installation et Test

### 1. Installer les dépendances
```bash
cd whatsappTransferVVIP
npm install
```

### 2. Démarrer le service
```bash
npm start
```

### 3. Tester les fonctionnalités
```bash
# Rendre le script exécutable
chmod +x test-advanced-features.sh

# Modifier les variables dans le script
# Puis exécuter
./test-advanced-features.sh
```

Ou avec Node.js:
```bash
node test-advanced-features.js
```

## 📱 Cas d'Usage pour TaxiApp

### Sondages de Satisfaction
```json
{
  "question": "🌟 Notez votre expérience TaxiApp",
  "options": ["😞 1 étoile", "😐 2 étoiles", "😊 3 étoiles", "😍 4 étoiles", "🤩 5 étoiles"]
}
```

### Notifications de Course
```json
{
  "text": "🚖 *Course Confirmée*\n\n👨‍✈️ Chauffeur: Ahmed\n🚗 Mercedes Classe E\n📍 Arrivée dans 5 min",
  "suggestedReactions": ["👍", "❓", "📞"]
}
```

### Localisation Points de Rendez-vous
```json
{
  "latitude": 33.5731,
  "longitude": -7.5898,
  "name": "Aéroport Mohammed V - Terminal 1",
  "address": "Zone de départ Taxi, Casablanca"
}
```

### Contact Chauffeur
```json
{
  "name": "Ahmed - Chauffeur TaxiApp",
  "number": "+212666123456",
  "organization": "TaxiApp Morocco - Chauffeur Premium"
}
```

## 🚀 Fonctionnalités Futures

Basé sur la roadmap de whatsapp-web.js:

- ✅ **Sondages** - Implémenté
- ✅ **Réactions** - Implémenté
- ✅ **Médias** - Implémenté
- ✅ **Localisation** - Implémenté
- 🔜 **Vote dans les sondages** - En développement
- 🔜 **Communautés** - Planifié
- ❌ **Boutons** - Déprécié par WhatsApp
- ❌ **Listes** - Déprécié par WhatsApp

## 🔒 Sécurité

Toutes les nouvelles fonctionnalités utilisent le même système d'authentification par clé API que les fonctionnalités existantes.

```javascript
headers: {
  'x-api-key': 'your-secret-api-key-here'
}
```

## 🎯 Performance

- Délais automatiques entre messages pour éviter le rate limiting
- Support pour l'envoi en lot avec gestion d'erreurs individuelles
- Validation des numéros WhatsApp avant envoi
- Gestion gracieuse des erreurs

## 📊 Monitoring

Chaque nouvelle fonctionnalité retourne un objet de résultat détaillé:

```json
{
  "message": "Poll sent successfully",
  "results": [
    {
      "recipient": "+212633030117",
      "status": "success"
    },
    {
      "recipient": "+212invalid",
      "status": "failed",
      "error": "Invalid number"
    }
  ]
}
```

## 🤝 Support

Pour toute question ou problème:

1. Vérifiez les logs du service
2. Testez d'abord en mode test (`WHATSAPP_TEST_MODE=true`)
3. Consultez la documentation officielle: https://docs.wwebjs.dev/
4. Vérifiez que votre session WhatsApp est active

---

**Note:** Ces fonctionnalités nécessitent une session WhatsApp active et un numéro de téléphone vérifié. Certaines fonctionnalités peuvent ne pas être disponibles selon les restrictions de WhatsApp Business API.
