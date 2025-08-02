import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';
const API_KEY = 'mySuperSecretKey';

const headers = {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY
};

// Test data
const testData = {
    senderId: 'instance1',
    recipients: ['+212633030117', '+212621323085'],
    template: 'Bonjour {{name}}, ceci est un test du service WhatsApp Transfer VVIP. Date: {{date}}',
    params: [
        { name: 'Contact 1', date: '2025-08-01' },
        { name: 'Contact 2', date: '2025-08-01' }
    ]
};

async function testHealthEndpoint() {
    try {
        console.log('🔍 Testing health endpoint...');
        const response = await axios.get(`${API_BASE_URL}/../health`, { headers });
        console.log('✅ Health check:', response.data);
    } catch (error) {
        console.error('❌ Health check failed:', error.response?.data || error.message);
    }
}

async function testAddTemplate() {
    try {
        console.log('🔍 Testing add template...');
        const templateData = {
            templateId: 'welcome',
            template: 'Bienvenue {{name}}! Votre compte a été créé le {{date}}.'
        };
        const response = await axios.post(`${API_BASE_URL}/template`, templateData, { headers });
        console.log('✅ Template added:', response.data);
    } catch (error) {
        console.error('❌ Add template failed:', error.response?.data || error.message);
    }
}

async function testGetTemplates() {
    try {
        console.log('🔍 Testing get templates...');
        const response = await axios.get(`${API_BASE_URL}/template`, { headers });
        console.log('✅ Templates retrieved:', response.data);
    } catch (error) {
        console.error('❌ Get templates failed:', error.response?.data || error.message);
    }
}

async function testSendWhatsAppMessage() {
    try {
        console.log('🔍 Testing WhatsApp message sending...');
        console.log('📱 Recipients:', testData.recipients);
        console.log('📝 Template:', testData.template);
        
        const response = await axios.post(`${API_BASE_URL}/whatsapp/send`, testData, { headers });
        console.log('✅ Messages sent successfully:', response.data);
    } catch (error) {
        console.error('❌ Send message failed:', error.response?.data || error.message);
    }
}

async function runTests() {
    console.log('🚀 Starting API tests for WhatsApp Transfer VVIP...\n');
    
    await testHealthEndpoint();
    console.log('');
    
    await testAddTemplate();
    console.log('');
    
    await testGetTemplates();
    console.log('');
    
    await testSendWhatsAppMessage();
    console.log('');
    
    console.log('✅ All tests completed!');
}

// Run the tests
runTests().catch(console.error);
