import { Client } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import logger from '../utils/logger.js';

class WhatsAppService {
    constructor() {
        this.sessions = new Map();
        this.isTestMode = process.env.NODE_ENV === 'test' || process.env.WHATSAPP_TEST_MODE === 'true';
    }

    async connect(senderId) {
        if (this.isTestMode) {
            console.log(`🧪 TEST MODE: Simulating WhatsApp connection for ${senderId}`);
            this.sessions.set(senderId, { connected: true, testMode: true });
            return;
        }

        if (!this.sessions.has(senderId)) {
            console.log(`🔄 Initializing WhatsApp client for ${senderId}...`);
            
            const client = new Client({
                puppeteer: {
                    headless: true,
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
                console.log(`\n📱 QR Code for ${senderId}:`);
                console.log(`Raw QR: ${qr}`);
                console.log('\n🔍 Scan this QR code with your WhatsApp:');
                qrcode.generate(qr, { small: true });
                console.log('\nOpen WhatsApp on your phone → Settings → Linked Devices → Link a Device');
            });

            client.on('ready', () => {
                console.log(`✅ WhatsApp client ${senderId} is ready!`);
            });

            client.on('authenticated', () => {
                console.log(`🔐 WhatsApp client ${senderId} authenticated!`);
            });

            client.on('auth_failure', (msg) => {
                console.error(`❌ Authentication failed for ${senderId}:`, msg);
            });

            client.on('disconnected', (reason) => {
                console.log(`⚠️  WhatsApp client ${senderId} disconnected:`, reason);
            });

            try {
                await client.initialize();
                this.sessions.set(senderId, client);
                console.log(`✅ Client ${senderId} initialized successfully`);
            } catch (error) {
                console.error(`❌ Failed to initialize client ${senderId}:`, error);
                throw error;
            }
        } else {
            console.log(`♻️  Using existing WhatsApp session for ${senderId}`);
        }
    }

    async sendMessages(senderId, recipients, messages) {
        try {
            console.log(`📤 Attempting to send messages via ${senderId}...`);
            await this.connect(senderId);
            const client = this.sessions.get(senderId);

            if (!client) {
                throw new Error(`No WhatsApp client found for ${senderId}`);
            }

            if (this.isTestMode) {
                console.log(`🧪 TEST MODE: Simulating message sending`);
                for (let i = 0; i < recipients.length; i++) {
                    const message = messages[i];
                    const recipient = recipients[i];
                    console.log(`📱 [TEST] Would send to ${recipient}: "${message}"`);
                }
                return;
            }

            console.log(`📋 Sending ${messages.length} messages to ${recipients.length} recipients`);

            for (let i = 0; i < recipients.length; i++) {
                const message = messages[i];
                const recipient = recipients[i];
                
                try {
                    console.log(`📱 Sending to ${recipient}: "${message}"`);
                    
                    // Format phone number properly for WhatsApp
                    const formattedNumber = this.formatPhoneNumber(recipient);
                    
                    await client.sendMessage(formattedNumber, message);
                    console.log(`✅ Message sent successfully to ${recipient}`);
                } catch (error) {
                    console.error(`❌ Failed to send message to ${recipient}:`, error.message);
                    throw error;
                }
            }
        } catch (error) {
            console.error(`❌ Error in sendMessages:`, error);
            throw error;
        }
    }

    formatPhoneNumber(number) {
        // Remove any spaces, dashes, or parentheses
        let cleaned = number.replace(/[\s\-\(\)]/g, '');
        
        // Ensure it starts with the country code without +
        if (cleaned.startsWith('+')) {
            cleaned = cleaned.substring(1);
        }
        
        // Add @c.us suffix for WhatsApp
        return `${cleaned}@c.us`;
    }

    async sendMessage(senderId, recipients, template, params) {
        await this.connect(senderId);
        const client = this.sessions.get(senderId);

        for (let i = 0; i < recipients.length; i++) {
            const message = this.replaceTemplateVariables(template, params[i]);
            try {
                await client.sendMessage(recipients[i], message);
                console.log(`Message sent to ${recipients[i]}: ${message}`);
            } catch (error) {
                console.error(`Failed to send message to ${recipients[i]}: ${error}`);
            }
        }
    }

    replaceTemplateVariables(template, params) {
        return Object.keys(params).reduce((msg, key) => {
            return msg.replace(new RegExp(`{{${key}}}`, 'g'), params[key]);
        }, template);
    }
}

export default WhatsAppService;
