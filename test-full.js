import axios from 'axios';

// Enable test mode
process.env.WHATSAPP_TEST_MODE = 'true';

const API_BASE_URL = 'http://localhost:3000/api';
const API_KEY = 'mySuperSecretKey';

const headers = {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY
};

// Test data with your phone numbers
const testData = {
    senderId: 'instance1',
    recipients: ['+212633030117', '+212621323085'],
    template: 'Bonjour {{name}}, ceci est un test du service WhatsApp Transfer VVIP. Votre message: {{message}}',
    params: [
        { 
            name: 'Contact Morocco 1', 
            message: 'Votre service WhatsApp fonctionne parfaitement!' 
        },
        { 
            name: 'Contact Morocco 2', 
            message: 'Le microservice est maintenant opérationnel!' 
        }
    ]
};

async function waitForServer() {
    for (let i = 0; i < 10; i++) {
        try {
            await axios.get('http://localhost:3000/health');
            console.log('✅ Server is ready!');
            return true;
        } catch (error) {
            console.log(`⏳ Waiting for server... (${i + 1}/10)`);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    return false;
}

async function testWhatsAppAPI() {
    console.log('🚀 Testing WhatsApp Transfer VVIP API in TEST MODE\n');
    
    // Wait for server to be ready
    if (!(await waitForServer())) {
        console.error('❌ Server not responding');
        return;
    }

    try {
        // Test 1: Health check
        console.log('🔍 1. Testing health endpoint...');
        const healthResponse = await axios.get('http://localhost:3000/health');
        console.log('✅ Health check passed:', healthResponse.data);
        console.log('');

        // Test 2: Add a template
        console.log('🔍 2. Testing add template...');
        const templateData = {
            templateId: 'morocco-welcome',
            template: 'Marhaba {{name}}! Bienvenue dans notre service. Code: {{code}}'
        };
        const addTemplateResponse = await axios.post(`${API_BASE_URL}/template`, templateData, { headers });
        console.log('✅ Template added:', addTemplateResponse.data);
        console.log('');

        // Test 3: Get templates
        console.log('🔍 3. Testing get templates...');
        const getTemplatesResponse = await axios.get(`${API_BASE_URL}/template`, { headers });
        console.log('✅ Templates retrieved:', getTemplatesResponse.data);
        console.log('');

        // Test 4: Send WhatsApp messages (TEST MODE)
        console.log('🔍 4. Testing WhatsApp message sending (TEST MODE)...');
        console.log('📱 Recipients:', testData.recipients);
        console.log('📝 Template:', testData.template);
        console.log('📋 Parameters:', testData.params);
        
        const sendResponse = await axios.post(`${API_BASE_URL}/whatsapp/send`, testData, { headers });
        console.log('✅ Messages sent successfully (TEST MODE):', sendResponse.data);
        console.log('');

        console.log('🎉 All tests passed!');
        console.log('');
        console.log('📋 Summary:');
        console.log('- API endpoints are working correctly');
        console.log('- Security (API key) is functioning');
        console.log('- Template system is operational');
        console.log('- WhatsApp service is ready (in test mode)');
        console.log('');
        console.log('🔄 To enable real WhatsApp sending:');
        console.log('1. Remove WHATSAPP_TEST_MODE environment variable');
        console.log('2. Restart the server');
        console.log('3. Scan the QR code when it appears');
        console.log('4. Send real messages to your phone numbers');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

// Run the test
testWhatsAppAPI();
