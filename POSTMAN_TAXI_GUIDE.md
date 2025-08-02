# 🚖 Guide Postman - API Taxi Booking WhatsApp

## 📋 Vue d'ensemble

Ce guide vous explique comment utiliser la collection Postman pour tester l'API de confirmation de réservation taxi via WhatsApp.

## 📥 Installation de la Collection

### Méthode 1: Import direct
1. Ouvrez Postman
2. Cliquez sur **Import** (en haut à gauche)
3. Sélectionnez le fichier `Taxi-Booking-Postman-Collection.json`
4. Cliquez sur **Import**

### Méthode 2: Import par URL
1. Dans Postman, cliquez sur **Import**
2. Sélectionnez l'onglet **Link**
3. Collez l'URL du fichier JSON depuis votre repository
4. Cliquez sur **Continue** puis **Import**

## ⚙️ Configuration des Variables

Après l'import, configurez les variables d'environnement :

### Variables de Collection
- `base_url`: `http://localhost:3000` (URL de votre serveur)
- `api_key`: `mySuperSecretKey` (votre clé API)

### Pour modifier les variables :
1. Cliquez sur la collection "🚖 Taxi Booking WhatsApp API"
2. Allez dans l'onglet **Variables**
3. Modifiez les valeurs selon votre configuration
4. Cliquez sur **Save**

## 🧪 Tests Disponibles

La collection contient **11 scénarios de test** :

### 1. 🏥 Health Check
**Endpoint**: `GET /health`

**Description**: Vérification rapide que le service fonctionne

**Réponse attendue**:
```json
{
  "status": "OK",
  "message": "WhatsApp Transfer VVIP service is running"
}
```

### 2. 🚖 Confirmation Réservation Taxi - Complète
**Endpoint**: `POST /api/whatsapp/taxi/booking-confirmation`

**Description**: Test avec toutes les informations possibles

**Données incluses**:
- Transaction ID
- Adresses complètes avec coordonnées
- Tarification avec réduction
- Informations chauffeur complètes
- Nombre de passagers/bagages
- Offre spéciale
- Numéro d'urgence

**Message généré** (exemple):
```
🚖 CONFIRMATION DE RÉSERVATION TAXI

📋 Détails de la course:
🆔 Transaction: #TXN-2025-001234
📅 Réservé le: 02/08/2025 14:30:00

📍 Trajet:
🟢 Départ: Aéroport Mohammed V, Casablanca
🔴 Arrivée: Hôtel Hyatt Regency, Casablanca
⏱️ Durée estimée: 35 minutes

👨‍💼 Votre chauffeur:
👤 Ahmed Benali
📱 Tél: +212661234567
🚗 Véhicule: Mercedes Classe E

👥 Informations passagers:
🧳 Passagers: 2
💼 Bagages: 3

💰 Tarification:
💸 Prix initial: 220€
🎟️ Code promo: WELCOME20
💚 Économie: -40€
💵 Prix final: 180€

🎁 Offre spéciale:
Première course gratuite pour les nouveaux clients!

🆘 Urgence: +212522123456

✅ Votre réservation est confirmée!
```

### 3. 🚖 Confirmation Réservation Taxi - Minimale
**Endpoint**: `POST /api/whatsapp/taxi/booking-confirmation`

**Description**: Test avec les informations minimales requises

**Données incluses**:
- Transaction ID
- Adresses simples
- Prix de base
- Informations chauffeur de base
- Numéro d'urgence

### 4. 🚖 Confirmation avec Promotion
**Endpoint**: `POST /api/whatsapp/taxi/booking-confirmation`

**Description**: Test avec promotion et réduction

**Cas d'usage**: Course aéroport avec code promo

### 5. 📱 Message WhatsApp Simple
**Endpoint**: `POST /api/whatsapp/send`

**Description**: Test de l'endpoint générique de message

### 6. 📋 Gestion des Templates
**Endpoints**: 
- `POST /api/template/` - Ajouter un template
- `GET /api/template/` - Récupérer tous les templates

### 7. 🔄 Restaurer Sessions
**Endpoint**: `POST /api/whatsapp/restore-sessions`

**Description**: Restaurer toutes les sessions WhatsApp

### 8. 💰 Transfert d'Argent - Données Complètes
**Endpoint**: `POST /api/whatsapp/money-transfer/confirmation`

**Description**: Confirmation de transfert d'argent avec toutes les informations

**Données incluses**:
- ID transfert
- Informations bénéficiaire complètes
- Montant et devise
- Services de transfert acceptés
- Instructions spéciales
- Numéro d'urgence

### 9. 💰 Transfert d'Argent - Données Minimales
**Endpoint**: `POST /api/whatsapp/money-transfer/confirmation`

**Description**: Confirmation avec informations essentielles uniquement

**Données incluses**:
- Nom bénéficiaire
- Ville de destination
- Montant de base

### 10. 💰 Transfert d'Argent - Services Personnalisés
**Endpoint**: `POST /api/whatsapp/money-transfer/confirmation`

**Description**: Confirmation avec services de transfert personnalisés

**Données incluses**:
- Services alternatifs (Wise, Remitly, WorldRemit)
- Horaires étendus
- Options de retrait multiples

### 11. 🔄 Restaurer Session Spécifique
**Endpoint**: `POST /api/whatsapp/restore-session`

**Description**: Restauration d'une session WhatsApp spécifique

**Données incluses**:
- Sender ID
- Données de session

## 🔧 Personnalisation des Tests

### Modifier les numéros de téléphone
Dans chaque requête, modifiez le champ `recipients` :
```json
{
  "recipients": ["+212XXXXXXXXX"]
}
```

### Modifier les données de réservation
Personnalisez les données dans `bookingData` :
```json
{
  "bookingData": {
    "transactionId": "VOTRE-ID",
    "pickup": "Votre adresse de départ",
    "destination": "Votre adresse d'arrivée",
    "price": 100,
    "driver": {
      "firstName": "Prénom",
      "lastName": "Nom",
      "phone": "+212XXXXXXXXX"
    }
  }
}
```

## 📊 Codes de Réponse

### Succès (200)
```json
{
  "message": "Taxi booking confirmation sent successfully",
  "transactionId": "TXN-2025-001234"
}
```

### Erreur d'authentification (401)
```json
{
  "error": "Unauthorized: Invalid API key"
}
```

### Erreur de validation (400)
```json
{
  "error": "Missing required fields: recipients, bookingData"
}
```

### Erreur serveur (500)
```json
{
  "error": "Failed to send taxi booking confirmation"
}
```

## 🚀 Démarrage Rapide

1. **Démarrez votre serveur**:
   ```bash
   cd whatsappTransferVVIP
   npm start
   ```

2. **Importez la collection** dans Postman

3. **Configurez les variables** (URL et clé API)

4. **Testez le Health Check** pour vérifier la connexion

5. **Lancez une confirmation taxi** avec vos données

## 🔍 Dépannage

### Erreur de connexion
- Vérifiez que le serveur est démarré sur le port 3000
- Vérifiez l'URL dans les variables Postman

### Erreur d'authentification
- Vérifiez la clé API dans les variables
- Assurez-vous que le header `x-api-key` est présent

### Message non reçu
- Vérifiez que WhatsApp Web est connecté
- Vérifiez le format du numéro de téléphone (+212XXXXXXXXX)
- Consultez les logs du serveur

## 📞 Support

Pour toute question ou problème :
1. Consultez les logs du serveur
2. Vérifiez la documentation API
3. Testez d'abord le Health Check

---

*Cette collection Postman est optimisée pour tester toutes les fonctionnalités de l'API taxi WhatsApp.*