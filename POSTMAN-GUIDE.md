# 📋 Guide d'Importation Postman - WhatsApp Transfer VVIP

## 🚀 Importation de la Collection

### 1. **Ouvrir Postman**
- Lancez l'application Postman sur votre ordinateur

### 2. **Importer la Collection**
- Cliquez sur **"Import"** (bouton en haut à gauche)
- Sélectionnez **"Upload Files"**
- Choisissez le fichier `WhatsApp-VVIP-Postman-Collection.json`
- Cliquez sur **"Import"**

### 3. **Configuration des Variables**
La collection utilise des variables prédéfinies :
- `{{base_url}}` = `http://79.72.25.202`
- `{{api_key}}` = `mySuperSecretKey`
- `{{test_phone}}` = `+212600000000`

## 📁 Structure de la Collection

### 🏥 **Health & Status** (3 requêtes)
- **Health Check** - Vérifier l'état du serveur
- **Session Status - All** - État de toutes les sessions
- **Session Status - Specific** - État d'une session spécifique

### 📱 **Messages de Base** (2 requêtes)
- **Send Template Message** - Envoi avec variables
- **Send Rich Message** - Message enrichi avec lien

### 📊 **Fonctionnalités Avancées** (3 requêtes)
- **Send Poll** - Sondage WhatsApp
- **Send Location** - Partage de localisation
- **Send Contact Card** - Carte de contact

### 📋 **Templates Prédéfinis** (10 requêtes)
- **Welcome Message** - Message de bienvenue
- **Order Confirmation** - Confirmation de commande
- **Promotion Template** - Messages promotionnels
- **Delivery Notification** - Notification de livraison
- **Appointment Reminder** - Rappel de rendez-vous
- **Payment Request** - Demande de paiement
- **Customer Satisfaction** - Enquête satisfaction
- **Newsletter** - Newsletter automatisée
- **Emergency Alert** - Alertes d'urgence
- **Birthday Wishes** - Vœux d'anniversaire

### 🔧 **Session Management** (2 requêtes)
- **Disconnect Session** - Déconnecter une session
- **Clear Session** - Effacer une session

## 🧪 Tests Automatiques

Chaque requête inclut des tests automatiques :
- ✅ Temps de réponse acceptable (< 5 secondes)
- ✅ Content-Type JSON correct
- ✅ Status code 200 pour succès

## 📝 Utilisation Recommandée

### **Ordre de test suggéré :**

1. **🏥 Health Check** - Vérifier que l'API fonctionne
2. **📱 Send Template Message** - Test de base
3. **📊 Send Poll** - Test fonctionnalité avancée
4. **📋 Welcome Message** - Test template prédéfini
5. **📋 Order Confirmation** - Test business logic

### **Personnalisation :**

1. **Modifier le numéro de téléphone :**
   - Variables → `test_phone` → Votre numéro au format `+212XXXXXXXXX`

2. **Changer l'environnement :**
   - Variables → `base_url` → URL de votre serveur

3. **API Key différente :**
   - Variables → `api_key` → Votre clé API

## 🎯 Exemples de Réponses Attendues

### ✅ **Succès (200 OK) :**
```json
{
  "status": "OK",
  "message": "WhatsApp Transfer VVIP is running"
}
```

### ❌ **Erreur Authentication (401) :**
```json
{
  "error": "Access denied. API key required."
}
```

### ⚠️ **Erreur Validation (400) :**
```json
{
  "error": "Missing required fields: recipients, template, params"
}
```

## 🔍 Debug et Troubleshooting

1. **Vérifier la connectivité :**
   ```bash
   curl http://79.72.25.202/health
   ```

2. **Tester l'authentification :**
   - Vérifier l'header `x-api-key` dans chaque requête

3. **Analyser les logs :**
   - Console Postman → onglet "Tests" pour voir les résultats

## 📞 Support

- **Documentation API** : README.md
- **Tests manuels** : test-external-access.bat
- **Logs serveur** : SSH vers 79.72.25.202

---
**Collection créée le :** 2 Août 2025  
**Version API :** 1.0.0  
**Endpoints :** 20 requêtes complètes
