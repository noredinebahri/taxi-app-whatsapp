import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import logger from '../utils/logger.js';

const { Client, LocalAuth } = pkg;

class WhatsAppService {
    constructor() {
        this.clients = new Map();
        this.isTestMode = process.env.WHATSAPP_TEST_MODE === 'true';
        console.log(`🔧 WhatsApp Service initialized - Test Mode: ${this.isTestMode}`);
    }

    // Créer un nouveau client WhatsApp
    async createClient(sessionId = 'default') {
        try {
            console.log(`🔄 Creating new WhatsApp client for session: ${sessionId}`);
            
            if (this.isTestMode) {
                console.log(`⚠️ Test mode enabled - simulating client creation`);
                this.clients.set(sessionId, { ready: true, testMode: true });
                return { success: true, message: 'Test client created' };
            }

            const client = new Client({
                authStrategy: new LocalAuth({ clientId: sessionId }),
                webVersionCache: {
                    type: 'remote',
                    remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
                    strict: false
                },
                puppeteer: {
                    headless: true,
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-dev-shm-usage',
                        '--disable-gpu',
                        '--disable-extensions',
                        '--disable-background-timer-throttling',
                        '--disable-backgrounding-occluded-windows',
                        '--disable-renderer-backgrounding'
                    ]
                }
            });

            // Marquer le client comme non prêt initialement
            client.isReady = false;

            // Événements du client
            client.on('qr', (qr) => {
                console.log(`📱 QR Code for ${sessionId}:`);
                qrcode.generate(qr, { small: true });
            });

            client.on('ready', () => {
                console.log(`✅ WhatsApp client ${sessionId} is ready!`);
                client.isReady = true;
            });

            client.on('authenticated', () => {
                console.log(`🔐 WhatsApp client ${sessionId} authenticated`);
                // Marquer comme prêt après authentification
                setTimeout(() => {
                    client.isReady = true;
                    console.log(`✅ WhatsApp client ${sessionId} is ready after authentication!`);
                }, 2000);
            });

            client.on('disconnected', (reason) => {
                console.log(`❌ WhatsApp client ${sessionId} disconnected:`, reason);
                this.clients.delete(sessionId);
            });

            // Initialiser le client
            await client.initialize();
            this.clients.set(sessionId, client);

            return { success: true, message: `Client ${sessionId} created successfully` };
        } catch (error) {
            console.error(`❌ Error creating client ${sessionId}:`, error.message);
            return { success: false, error: error.message };
        }
    }

    // Envoyer un message
    async sendMessage(sessionId, to, message) {
        try {
            console.log(`📤 Sending message via ${sessionId} to ${to}`);
            
            if (this.isTestMode) {
                console.log(`✅ [TEST MODE] Message sent to ${to}: ${message}`);
                return { success: true, message: 'Test message sent' };
            }

            const client = this.clients.get(sessionId);
            if (!client) {
                throw new Error(`Client ${sessionId} not found`);
            }

            if (!client.isReady) {
                throw new Error(`Client ${sessionId} not ready`);
            }

            // Formater le numéro de téléphone pour WhatsApp Web.js
            let chatId = to;
            if (!to.includes('@')) {
                chatId = `${to}@c.us`;
            }
            
            // Utiliser la méthode correcte pour envoyer le message
            const result = await client.sendMessage(chatId, message);
            console.log(`✅ Message sent successfully to ${to}`);
            return { success: true, messageId: result.id._serialized };
        } catch (error) {
            console.error(`❌ Error sending message:`, error.message);
            return { success: false, error: error.message };
        }
    }

    // Vérifier le statut d'une session
    async getSessionStatus(sessionId) {
        try {
            const client = this.clients.get(sessionId);
            if (!client) {
                return { status: 'not_found', message: `Session ${sessionId} not found` };
            }

            if (this.isTestMode) {
                return { status: 'ready', message: 'Test mode - session ready' };
            }

            return {
                status: client.isReady ? 'ready' : 'not_ready',
                message: `Session ${sessionId} is ${client.isReady ? 'ready' : 'not ready'}`
            };
        } catch (error) {
            return { status: 'error', error: error.message };
        }
    }

    // Déconnecter une session
    async disconnectSession(sessionId) {
        try {
            if (this.isTestMode) {
                console.log(`✅ [TEST MODE] Session ${sessionId} disconnected`);
                this.clients.delete(sessionId);
                return { success: true, message: 'Test session disconnected' };
            }

            const client = this.clients.get(sessionId);
            if (client) {
                await client.destroy();
                this.clients.delete(sessionId);
                console.log(`✅ Session ${sessionId} disconnected`);
            }
            return { success: true, message: `Session ${sessionId} disconnected` };
        } catch (error) {
            console.error(`❌ Error disconnecting session ${sessionId}:`, error.message);
            return { success: false, error: error.message };
        }
    }

    // Obtenir toutes les sessions
    getAllSessions() {
        const sessions = [];
        for (const [sessionId, client] of this.clients) {
            sessions.push({
                sessionId,
                active: true,
                ready: this.isTestMode || !!client.info,
                testMode: this.isTestMode
            });
        }
        return { success: true, sessions };
    }
}

export default new WhatsAppService();