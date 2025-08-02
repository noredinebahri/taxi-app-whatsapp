import { Client } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

console.log('🔧 Testing WhatsApp Web.js directly...');

const client = new Client({
    puppeteer: {
        headless: false, // Show browser for debugging
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
        ]
    }
});

client.on('qr', (qr) => {
    console.log('\n📱 QR Code received!');
    console.log('Raw QR data:', qr);
    console.log('\n🔍 Scan this QR code with WhatsApp:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ WhatsApp Web is ready!');
    process.exit(0);
});

client.on('authenticated', () => {
    console.log('🔐 Authentication successful!');
});

client.on('auth_failure', (msg) => {
    console.error('❌ Authentication failed:', msg);
    process.exit(1);
});

client.on('disconnected', (reason) => {
    console.log('⚠️ Disconnected:', reason);
    process.exit(1);
});

console.log('🚀 Initializing WhatsApp client...');

client.initialize().catch(error => {
    console.error('❌ Initialization failed:', error);
    process.exit(1);
});

// Timeout after 2 minutes
setTimeout(() => {
    console.log('⏰ Timeout reached, exiting...');
    process.exit(1);
}, 120000);
