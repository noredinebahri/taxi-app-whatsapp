# API de Confirmation de Transfert d'Argent

## Vue d'ensemble

Cet endpoint permet d'envoyer des confirmations de réception de demandes de transfert d'argent via WhatsApp. Il est spécialement conçu pour les services de transfert d'argent et inclut toutes les informations nécessaires pour le client.

## Endpoint

**POST** `/api/whatsapp/money-transfer/confirmation`

### Authentification

Cet endpoint nécessite une authentification via Bearer Token :

```
Authorization: Bearer YOUR_API_KEY
```

## Structure de la Requête

### Paramètres Requis

```json
{
  "senderId": "string",           // Numéro WhatsApp Business
  "recipients": ["string"],       // Tableau des numéros destinataires
  "transferData": {               // Données du transfert
    "beneficiary": {
      "name": "string"            // Nom du bénéficiaire (requis)
    },
    "amount": "string"            // Montant (requis)
  }
}
```

### Paramètres Complets (Optionnels)

```json
{
  "senderId": "your-whatsapp-business-number",
  "recipients": ["+212600000000"],
  "transferData": {
    "transferId": "MT2024001234",
    "beneficiary": {
      "name": "Ahmed Taxi Service",
      "city": "Casablanca, Maroc",
      "phone": "+212 600 000 000"
    },
    "amount": "44.17",
    "currency": "EUR",
    "acceptedServices": [
      "Western Union",
      "MoneyGram",
      "Ria Money Transfer",
      "Autres services similaires"
    ],
    "acceptanceDelay": "2-4 heures",
    "workingHours": "8h-20h",
    "instructions": [
      "Envoyez-nous le code de transfert par WhatsApp",
      "Gardez le reçu jusqu'à confirmation",
      "Le service sera confirmé après réception"
    ]
  }
}
```

## Exemple de Message Généré

```
💰 *CONFIRMATION DE DEMANDE DE TRANSFERT*

✅ Votre réservation a été bien reçue, nous traitons votre demande.

🆔 *Référence:* MT2024001234

💸 *Transfert d'Argent*

👤 *Informations du Bénéficiaire*
📝 Nom: Ahmed Taxi Service
🏙️ Ville: Casablanca, Maroc
📱 Téléphone: +212 600 000 000
💵 Montant: 44.17 EUR

🏦 *Services Acceptés*
• Western Union
• MoneyGram
• Ria Money Transfer
• Autres services similaires

⏰ *Délai d'Acceptation*
Les transferts sont acceptés par nos agences dans un délai de 2-4 heures pendant les heures d'ouverture (8h-20h).

📋 *Instructions*
• Envoyez-nous le code de transfert par WhatsApp
• Gardez le reçu jusqu'à confirmation
• Le service sera confirmé après réception

✅ *Votre demande est en cours de traitement !*

_Merci de votre confiance. Nous vous contacterons bientôt._ 🌟
```

## Exemples d'Intégration

### Node.js / Express

```javascript
const axios = require('axios');

async function sendMoneyTransferConfirmation(transferData) {
  try {
    const response = await axios.post('http://localhost:3000/api/whatsapp/money-transfer/confirmation', {
      senderId: process.env.WHATSAPP_SENDER_ID,
      recipients: [transferData.clientPhone],
      transferData: {
        transferId: transferData.id,
        beneficiary: {
          name: transferData.beneficiaryName,
          city: transferData.beneficiaryCity,
          phone: transferData.beneficiaryPhone
        },
        amount: transferData.amount,
        currency: transferData.currency || 'EUR',
        acceptedServices: transferData.services || [
          'Western Union',
          'MoneyGram',
          'Ria Money Transfer'
        ]
      }
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Erreur envoi confirmation:', error);
    throw error;
  }
}
```

### PHP / Laravel

```php
use Illuminate\Support\Facades\Http;

class MoneyTransferService
{
    public function sendConfirmation($transferData)
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . env('API_KEY'),
            'Content-Type' => 'application/json'
        ])->post('http://localhost:3000/api/whatsapp/money-transfer/confirmation', [
            'senderId' => env('WHATSAPP_SENDER_ID'),
            'recipients' => [$transferData['client_phone']],
            'transferData' => [
                'transferId' => $transferData['id'],
                'beneficiary' => [
                    'name' => $transferData['beneficiary_name'],
                    'city' => $transferData['beneficiary_city'],
                    'phone' => $transferData['beneficiary_phone']
                ],
                'amount' => $transferData['amount'],
                'currency' => $transferData['currency'] ?? 'EUR',
                'acceptedServices' => $transferData['services'] ?? [
                    'Western Union',
                    'MoneyGram',
                    'Ria Money Transfer'
                ]
            ]
        ]);
        
        return $response->json();
    }
}
```

## Réponses de l'API

### Succès (200)

```json
{
  "message": "Money transfer confirmation sent successfully",
  "transferId": "MT2024001234"
}
```

### Erreurs

#### 400 - Données manquantes

```json
{
  "error": "Recipients array is required"
}
```

```json
{
  "error": "Transfer data is required"
}
```

#### 401 - Non autorisé

```json
{
  "error": "Unauthorized"
}
```

#### 500 - Erreur serveur

```json
{
  "error": "Failed to send money transfer confirmation"
}
```

## Cas d'Usage

1. **Confirmation de réception de demande** : Informer le client que sa demande de transfert a été reçue
2. **Instructions de transfert** : Fournir les détails sur comment procéder au transfert
3. **Informations du bénéficiaire** : Confirmer les données du destinataire
4. **Services acceptés** : Lister les plateformes de transfert supportées
5. **Délais et horaires** : Informer sur les temps de traitement

## Valeurs par Défaut

- **currency** : "EUR"
- **acceptanceDelay** : "2-4 heures"
- **workingHours** : "8h-20h"
- **instructions** : Instructions standard si non spécifiées

## Test

Pour tester l'endpoint, utilisez le fichier `test-money-transfer.js` :

```bash
node test-money-transfer.js
```

Assurez-vous de :
1. Configurer votre clé API
2. Modifier les numéros de téléphone de test
3. Vérifier que le serveur WhatsApp est démarré

## Sécurité

- Toutes les requêtes doivent être authentifiées
- Les numéros de téléphone sont validés
- Les données sensibles sont loggées de manière sécurisée
- Rate limiting appliqué pour éviter le spam