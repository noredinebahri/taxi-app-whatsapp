# 🚖 API de Confirmation de Réservation Taxi

## 📋 Vue d'ensemble

Cet endpoint spécialisé permet d'envoyer des confirmations de réservation taxi professionnelles via WhatsApp. Il est conçu pour s'intégrer parfaitement avec votre application de transfert de clients.

## 🔗 Endpoint

**POST** `/api/whatsapp/taxi/booking-confirmation`

## 🔐 Authentification

```http
Content-Type: application/json
x-api-key: votre-clé-api
```

## 📝 Structure de la requête

### Paramètres requis

```json
{
  "senderId": "taxi-app-instance",
  "recipients": ["+212633030117"],
  "bookingData": {
    "transactionId": "TXN-2025-001234",
    "pickup": "Point de départ",
    "destination": "Point d'arrivée",
    "price": 180
  }
}
```

### Paramètres complets (optionnels)

```json
{
  "senderId": "taxi-app-instance",
  "recipients": ["+212633030117", "+212621323085"],
  "bookingData": {
    "transactionId": "TXN-2025-001234",
    "pickup": {
      "address": "Aéroport Mohammed V, Casablanca",
      "coordinates": {
        "lat": 33.3676,
        "lng": -7.5897
      }
    },
    "destination": {
      "address": "Hôtel Hyatt Regency, Casablanca",
      "coordinates": {
        "lat": 33.5731,
        "lng": -7.5898
      }
    },
    "price": 180,
    "originalPrice": 220,
    "couponCode": "WELCOME20",
    "discount": 40,
    "driver": {
      "firstName": "Ahmed",
      "lastName": "Benali",
      "phone": "+212661234567",
      "vehicleType": "Mercedes Classe E",
      "plateNumber": "123456-A-78",
      "rating": 4.8
    },
    "passengers": 2,
    "luggage": 3,
    "specialOffer": "Première course gratuite pour les nouveaux clients!",
    "emergencyNumber": "+212522123456",
    "estimatedTime": "35 minutes",
    "bookingTime": "2025-08-02 14:30:00",
    "notes": "Client VIP - Service premium"
  }
}
```

## 📱 Exemple de message généré

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

_Merci de votre confiance. Bon voyage!_ 🌟
```

## 🔧 Intégration avec votre API

### Exemple Node.js/Express

```javascript
import axios from 'axios';

const WHATSAPP_API_URL = 'http://localhost:3000/api';
const WHATSAPP_API_KEY = 'votre-clé-api';

async function sendTaxiConfirmation(bookingData, clientPhone) {
  try {
    const response = await axios.post(
      `${WHATSAPP_API_URL}/whatsapp/taxi/booking-confirmation`,
      {
        senderId: 'taxi-app',
        recipients: [clientPhone],
        bookingData: bookingData
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': WHATSAPP_API_KEY
        }
      }
    );
    
    console.log('Confirmation envoyée:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur envoi confirmation:', error.response?.data);
    throw error;
  }
}

// Utilisation dans votre endpoint de réservation
app.post('/api/bookings', async (req, res) => {
  try {
    // Créer la réservation dans votre base de données
    const booking = await createBooking(req.body);
    
    // Envoyer la confirmation WhatsApp
    await sendTaxiConfirmation({
      transactionId: booking.id,
      pickup: booking.pickup,
      destination: booking.destination,
      price: booking.finalPrice,
      originalPrice: booking.originalPrice,
      couponCode: booking.couponCode,
      driver: booking.assignedDriver,
      passengers: booking.passengers,
      luggage: booking.luggage,
      emergencyNumber: '+212522123456'
    }, booking.clientPhone);
    
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Exemple PHP/Laravel

```php
use Illuminate\Support\Facades\Http;

class TaxiBookingService
{
    private $whatsappApiUrl = 'http://localhost:3000/api';
    private $whatsappApiKey = 'votre-clé-api';
    
    public function sendBookingConfirmation($booking)
    {
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'x-api-key' => $this->whatsappApiKey
        ])->post($this->whatsappApiUrl . '/whatsapp/taxi/booking-confirmation', [
            'senderId' => 'taxi-app',
            'recipients' => [$booking->client_phone],
            'bookingData' => [
                'transactionId' => $booking->transaction_id,
                'pickup' => $booking->pickup_address,
                'destination' => $booking->destination_address,
                'price' => $booking->final_price,
                'originalPrice' => $booking->original_price,
                'couponCode' => $booking->coupon_code,
                'driver' => [
                    'firstName' => $booking->driver->first_name,
                    'lastName' => $booking->driver->last_name,
                    'phone' => $booking->driver->phone,
                    'vehicleType' => $booking->driver->vehicle_type
                ],
                'passengers' => $booking->passengers,
                'luggage' => $booking->luggage,
                'emergencyNumber' => '+212522123456'
            ]
        ]);
        
        return $response->json();
    }
}
```

## 📊 Réponses de l'API

### Succès (200)
```json
{
  "message": "Taxi booking confirmation sent successfully",
  "transactionId": "TXN-2025-001234"
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

## 🎯 Cas d'usage

1. **Confirmation immédiate** après réservation
2. **Mise à jour** avec informations chauffeur
3. **Rappel** avant le départ
4. **Notification** de changements

## 🔍 Test de l'endpoint

Utilisez le fichier `test-taxi-booking.js` pour tester l'endpoint :

```bash
node test-taxi-booking.js
```

## 📞 Support

Pour toute question ou problème d'intégration, contactez l'équipe de développement.

---

*Cette API est optimisée pour les applications de transfert taxi et garantit une expérience client professionnelle.*