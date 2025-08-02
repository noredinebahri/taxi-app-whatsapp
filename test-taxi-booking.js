import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';
const API_KEY = 'mySuperSecretKey';

const headers = {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY
};

// Exemple de données de réservation taxi complètes
const taxiBookingData = {
    senderId: 'taxi-app-instance',
    recipients: ['+212633030117'], // Numéro du client
    bookingData: {
        transactionId: 'TXN-2025-001234',
        pickup: {
            address: 'Aéroport Mohammed V, Casablanca'
        },
        destination: {
            address: 'Hôtel Hyatt Regency, Casablanca'
        },
        price: 180,
        originalPrice: 220,
        couponCode: 'WELCOME20',
        discount: 40,
        driver: {
            firstName: 'Ahmed',
            lastName: 'Benali',
            phone: '+212661234567',
            vehicleType: 'Mercedes Classe E'
        },
        passengers: 2,
        luggage: 3,
        specialOffer: 'Première course gratuite pour les nouveaux clients!',
        emergencyNumber: '+212522123456',
        estimatedTime: '35 minutes',
        bookingTime: new Date().toLocaleString('fr-FR')
    }
};

// Exemple avec données minimales
const minimalBookingData = {
    senderId: 'taxi-app-instance',
    recipients: ['+212621323085'],
    bookingData: {
        transactionId: 'TXN-2025-001235',
        pickup: 'Gare Casa-Port',
        destination: 'Marina Shopping Center',
        price: 45,
        driver: {
            firstName: 'Youssef',
            lastName: 'Alami',
            phone: '+212667890123'
        },
        emergencyNumber: '+212522123456'
    }
};

async function testTaxiBookingConfirmation() {
    try {
        console.log('🚖 Testing Taxi Booking Confirmation...');
        console.log('📱 Recipient:', taxiBookingData.recipients[0]);
        console.log('🆔 Transaction ID:', taxiBookingData.bookingData.transactionId);
        console.log('💰 Price:', taxiBookingData.bookingData.price + '€');
        
        const response = await axios.post(
            `${API_BASE_URL}/whatsapp/taxi/booking-confirmation`,
            taxiBookingData,
            { headers }
        );
        
        console.log('✅ Taxi booking confirmation sent successfully!');
        console.log('📋 Response:', response.data);
        console.log('');
        
    } catch (error) {
        console.error('❌ Error sending taxi booking confirmation:', error.response?.data || error.message);
    }
}

async function testMinimalBookingConfirmation() {
    try {
        console.log('🚖 Testing Minimal Taxi Booking Confirmation...');
        console.log('📱 Recipient:', minimalBookingData.recipients[0]);
        console.log('🆔 Transaction ID:', minimalBookingData.bookingData.transactionId);
        
        const response = await axios.post(
            `${API_BASE_URL}/whatsapp/taxi/booking-confirmation`,
            minimalBookingData,
            { headers }
        );
        
        console.log('✅ Minimal booking confirmation sent successfully!');
        console.log('📋 Response:', response.data);
        console.log('');
        
    } catch (error) {
        console.error('❌ Error sending minimal booking confirmation:', error.response?.data || error.message);
    }
}

async function runTaxiTests() {
    console.log('🚀 Starting Taxi Booking API Tests...\n');
    
    // Test avec données complètes
    await testTaxiBookingConfirmation();
    
    // Test avec données minimales
    await testMinimalBookingConfirmation();
    
    console.log('🏁 Taxi booking tests completed!');
}

// Exécuter les tests
runTaxiTests().catch(console.error);

// Export pour utilisation dans d'autres fichiers
export { taxiBookingData, minimalBookingData };