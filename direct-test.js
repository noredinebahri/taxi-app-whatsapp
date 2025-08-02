import WhatsAppService from './src/services/whatsappService.js';

console.log('🚀 Testing WhatsApp Service directly...');

const whatsappService = new WhatsAppService();

// Test the connection
async function testConnection() {
    try {
        console.log('📱 Attempting to connect to WhatsApp...');
        await whatsappService.connect('test-instance');
        console.log('✅ Connection successful!');
        
        // Try to send a test message
        const messages = ['Test message from WhatsApp Transfer VVIP'];
        const recipients = ['+212633030117'];
        
        await whatsappService.sendMessages('test-instance', recipients, messages);
        console.log('✅ Message sent successfully!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Stack:', error.stack);
    }
}

testConnection();
