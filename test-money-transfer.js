const axios = require('axios');

// Configuration
const API_BASE_URL = 'http://localhost:3000/api/whatsapp';
const API_KEY = 'your-api-key-here'; // Remplacez par votre clé API

// Exemple de test pour confirmation de transfert d'argent - Données complètes
async function testMoneyTransferConfirmationComplete() {
    try {
        const response = await axios.post(`${API_BASE_URL}/money-transfer/confirmation`, {
            senderId: 'your-whatsapp-business-number',
            recipients: ['+212600000000'], // Numéro du client
            transferData: {
                transferId: 'MT2024001234',
                beneficiary: {
                    name: 'Ahmed Taxi Service',
                    city: 'Casablanca, Maroc',
                    phone: '+212 600 000 000'
                },
                amount: '44.17',
                currency: 'EUR',
                acceptedServices: [
                    'Western Union',
                    'MoneyGram',
                    'Ria Money Transfer',
                    'Autres services similaires'
                ],
                acceptanceDelay: '2-4 heures',
                workingHours: '8h-20h',
                instructions: [
                    'Envoyez-nous le code de transfert par WhatsApp',
                    'Gardez le reçu jusqu\'à confirmation',
                    'Le service sera confirmé après réception'
                ]
            }
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ Test réussi - Confirmation transfert d\'argent (complète):', response.data);
    } catch (error) {
        console.error('❌ Erreur test transfert d\'argent (complète):', error.response?.data || error.message);
    }
}

// Exemple de test pour confirmation de transfert d'argent - Données minimales
async function testMoneyTransferConfirmationMinimal() {
    try {
        const response = await axios.post(`${API_BASE_URL}/money-transfer/confirmation`, {
            senderId: 'your-whatsapp-business-number',
            recipients: ['+212600000000'],
            transferData: {
                beneficiary: {
                    name: 'Ahmed Taxi Service',
                    city: 'Casablanca, Maroc'
                },
                amount: '44.17'
            }
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ Test réussi - Confirmation transfert d\'argent (minimale):', response.data);
    } catch (error) {
        console.error('❌ Erreur test transfert d\'argent (minimale):', error.response?.data || error.message);
    }
}

// Exemple avec services personnalisés
async function testMoneyTransferWithCustomServices() {
    try {
        const response = await axios.post(`${API_BASE_URL}/money-transfer/confirmation`, {
            senderId: 'your-whatsapp-business-number',
            recipients: ['+212600000000', '+212700000000'], // Plusieurs destinataires
            transferData: {
                transferId: 'MT2024001235',
                beneficiary: {
                    name: 'Service Taxi Premium',
                    city: 'Rabat, Maroc',
                    phone: '+212 700 000 000'
                },
                amount: '75.50',
                currency: 'USD',
                acceptedServices: [
                    'Western Union',
                    'Wise (ex-TransferWise)',
                    'Remitly',
                    'WorldRemit'
                ],
                acceptanceDelay: '1-3 heures',
                workingHours: '7h-22h',
                instructions: [
                    'Contactez-nous dès réception du code',
                    'Vérifiez les frais avant envoi',
                    'Service disponible 7j/7'
                ]
            }
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ Test réussi - Transfert avec services personnalisés:', response.data);
    } catch (error) {
        console.error('❌ Erreur test services personnalisés:', error.response?.data || error.message);
    }
}

// Exécuter tous les tests
async function runAllTests() {
    console.log('🚀 Démarrage des tests de confirmation de transfert d\'argent...\n');
    
    await testMoneyTransferConfirmationComplete();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await testMoneyTransferConfirmationMinimal();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await testMoneyTransferWithCustomServices();
    
    console.log('\n🏁 Tests terminés!');
}

// Exécuter les tests si ce fichier est lancé directement
if (require.main === module) {
    runAllTests();
}

module.exports = {
    testMoneyTransferConfirmationComplete,
    testMoneyTransferConfirmationMinimal,
    testMoneyTransferWithCustomServices,
    runAllTests
};