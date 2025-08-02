# 🚖 WhatsApp Transfer VVIP - API de Messagerie Taxi

whatsappTransferVVIP est un microservice Node.js spécialisé qui facilite l'envoi de messages WhatsApp via WhatsApp Web. Ce service agit comme un microservice externe à intégrer avec votre API de transfert taxi pour déléguer la tâche d'envoi de messages professionnels.

## ✨ Fonctionnalités

- 🔗 Connexion à WhatsApp Web via la bibliothèque `whatsapp-web.js`
- 📱 Envoi de messages avec templates personnalisables
- 🚖 **Endpoint spécialisé pour confirmations de réservation taxi**
- 👥 Gestion de sessions WhatsApp multiples basées sur `senderId`
- 💾 Stockage en mémoire pour templates et données de session
- 🔐 Mécanisme de sécurité simple avec authentification par clé API
- 📋 Persistence automatique des sessions WhatsApp
- 📊 Logging détaillé et monitoring

## Project Structure

```
whatsappTransferVVIP
├── src
│   ├── app.js                  # Entry point of the application
│   ├── controllers             # Contains controllers for handling requests
│   │   ├── whatsappController.js
│   │   └── templateController.js
│   ├── middleware              # Middleware for authentication
│   │   └── auth.js
│   ├── services                # Business logic for WhatsApp and templates
│   │   ├── whatsappService.js
│   │   └── templateService.js
│   ├── routes                  # API route definitions
│   │   ├── whatsapp.js
│   │   └── template.js
│   └── utils                   # Utility functions
│       └── logger.js
├── package.json                # NPM package configuration
├── .env.example                # Example environment variables
└── README.md                   # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd whatsappTransferVVIP
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on the `.env.example` file and set your `API_SECRET_KEY`.

## Usage

To start the server, run:
```
npm start
```

The service will be available at `http://localhost:3000`.

## 📡 API Endpoints

### 🏥 Health Check
- **GET** `/health` - Vérification de l'état du service

### 🚖 Endpoints Taxi (Nouveauté)

#### Confirmation de Réservation Taxi
- **POST** `/api/whatsapp/taxi/booking-confirmation`
  
  **Description**: Envoie une confirmation de réservation taxi professionnelle avec tous les détails.
  
  **Request Body**:
  ```json
  {
    "senderId": "taxi-app-instance",
    "recipients": ["+212633030117"],
    "bookingData": {
      "transactionId": "TXN-2025-001234",
      "pickup": "Aéroport Mohammed V, Casablanca",
      "destination": "Hôtel Hyatt Regency, Casablanca",
      "price": 180,
      "originalPrice": 220,
      "couponCode": "WELCOME20",
      "discount": 40,
      "driver": {
        "firstName": "Ahmed",
        "lastName": "Benali",
        "phone": "+212661234567",
        "vehicleType": "Mercedes Classe E"
      },
      "passengers": 2,
      "luggage": 3,
      "specialOffer": "Première course gratuite!",
      "emergencyNumber": "+212522123456",
      "estimatedTime": "35 minutes"
    }
  }
  ```

### 📱 Endpoints WhatsApp Génériques

#### Envoi de Message Simple
- **POST** `/api/whatsapp/send`
  
  **Request Body**:
  ```json
  {
    "senderId": "instance1",
    "recipients": ["+212600000000", "+212611111111"],
    "template": "Bonjour {{name}}, votre rendez-vous est prévu le {{date}}.",
    "params": [
      { "name": "Ali", "date": "2025-08-10" },
      { "name": "Sara", "date": "2025-08-11" }
    ]
  }
  ```

#### Envoi de Message avec Template
- **POST** `/api/whatsapp/send-template`

#### Envoi de Promotion
- **POST** `/api/whatsapp/send-promotion`

#### Envoi de Rappel de Rendez-vous
- **POST** `/api/whatsapp/send-appointment-reminder`

#### Gestion des Sessions
- **POST** `/api/whatsapp/restore-sessions` - Restaurer toutes les sessions
- **GET** `/api/whatsapp/session-status/:senderId` - Statut d'une session

### 📋 Endpoints Templates

#### Ajouter un Template Personnalisé
- **POST** `/api/template/`
  
  **Request Body**:
  ```json
  {
    "templateName": "template1",
    "template": "Votre template personnalisé ici."
  }
  ```

#### Récupérer tous les Templates
- **GET** `/api/template/`

## 📖 Documentation Détaillée

- 📄 **[TAXI_BOOKING_API.md](./TAXI_BOOKING_API.md)** - Guide complet pour l'endpoint de confirmation taxi
- 📄 **[SESSION_PERSISTENCE.md](./SESSION_PERSISTENCE.md)** - Documentation sur la persistence des sessions

## 🧪 Tests

Utilisez les fichiers de test fournis :
- `test-taxi-booking.js` - Test de l'endpoint de confirmation taxi
- `test-api.js` - Tests généraux de l'API
- `test-full.js` - Tests complets

## Security

This service uses API key authentication. Ensure that the `x-api-key` header is included in your requests to secure the communication between `apibackendtransfer` and `whatsappTransferVVIP`.

## Logging

The service logs successful message sends and errors to the console for monitoring purposes.

## License

This project is licensed under the MIT License.