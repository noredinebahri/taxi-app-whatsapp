import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import logger from '../utils/logger.js';
import fs from 'fs';
import path from 'path';

const { Client, LocalAuth, MessageMedia, Poll, Location } = pkg;

class WhatsAppService {
    constructor() {
        this.sessions = new Map();
        this.isTestMode = process.env.NODE_ENV === 'test' || process.env.WHATSAPP_TEST_MODE === 'true';
    }

    // Check if session data exists for a given senderId
    hasStoredSession(senderId) {
        const sessionPath = path.join(process.cwd(), '.wwebjs_auth', `session-${senderId}`);
        try {
            return fs.existsSync(sessionPath) && fs.readdirSync(sessionPath).length > 0;
        } catch (error) {
            return false;
        }
    }

    async connect(senderId) {
        if (this.isTestMode) {
            console.log(`🧪 TEST MODE: Simulating WhatsApp connection for ${senderId}`);
            this.sessions.set(senderId, { connected: true, testMode: true });
            return;
        }        if (!this.sessions.has(senderId)) {
            console.log(`🔄 Initializing WhatsApp client for ${senderId}...`);
            
            const client = new Client({
                authStrategy: new LocalAuth({
                    clientId: senderId
                }),
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

    // Nouvelle méthode pour envoyer des sondages (polls)
    async sendPoll(senderId, recipients, pollData) {
        try {
            console.log(`📊 Attempting to send poll via ${senderId}...`);
            await this.connect(senderId);
            const client = this.sessions.get(senderId);

            if (!client) {
                throw new Error(`No WhatsApp client found for ${senderId}`);
            }

            if (this.isTestMode) {
                console.log(`🧪 TEST MODE: Simulating poll sending`);
                console.log(`📊 [TEST] Poll: "${pollData.question}"`);
                console.log(`📊 [TEST] Options: ${pollData.options.join(', ')}`);
                return;
            }

            const { question, options, allowMultipleAnswers = false } = pollData;
            
            if (!question || !options || options.length < 2) {
                throw new Error('Poll must have a question and at least 2 options');
            }

            const poll = new Poll(question, options, { allowMultipleAnswers });

            const results = [];
            for (const recipient of recipients) {
                try {
                    const formattedNumber = this.formatPhoneNumber(recipient);
                    console.log(`📊 Sending poll to ${recipient}: "${question}"`);
                    
                    const numberId = await client.getNumberId(formattedNumber);
                    if (!numberId) {
                        console.error(`❌ Invalid WhatsApp number: ${recipient}`);
                        results.push({ recipient, status: 'failed', error: 'Invalid number' });
                        continue;
                    }
                    
                    await client.sendMessage(formattedNumber, poll);
                    console.log(`✅ Poll sent successfully to ${recipient}`);
                    results.push({ recipient, status: 'success' });
                    
                    // Wait between messages to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } catch (error) {
                    console.error(`❌ Failed to send poll to ${recipient}:`, error.message);
                    results.push({ recipient, status: 'failed', error: error.message });
                }
            }
            
            return results;
        } catch (error) {
            console.error(`❌ Error in sendPoll:`, error);
            throw error;
        }
    }

    // Nouvelle méthode pour envoyer des médias
    async sendMedia(senderId, recipients, mediaData) {
        try {
            console.log(`🎬 Attempting to send media via ${senderId}...`);
            await this.connect(senderId);
            const client = this.sessions.get(senderId);

            if (!client) {
                throw new Error(`No WhatsApp client found for ${senderId}`);
            }

            if (this.isTestMode) {
                console.log(`🧪 TEST MODE: Simulating media sending`);
                console.log(`🎬 [TEST] Media: ${mediaData.type} - ${mediaData.caption || 'No caption'}`);
                return;
            }

            let media;
              // Support pour différents types de médias
            if (mediaData.filePath) {
                // Média depuis un fichier local
                media = MessageMedia.fromFilePath(mediaData.filePath);
            } else if (mediaData.url) {
                // Média depuis une URL
                try {
                    media = await MessageMedia.fromUrl(mediaData.url, { unsafeMime: true });
                } catch (error) {
                    console.error(`Failed to download media from URL: ${mediaData.url}`, error);
                    throw new Error(`Failed to download media from URL: ${error.message}`);
                }
            } else if (mediaData.base64) {
                // Média depuis du base64
                media = new MessageMedia(mediaData.mimetype, mediaData.base64, mediaData.filename);
            } else {
                throw new Error('Media source not specified (filePath, url, or base64 required)');
            }

            const results = [];
            for (const recipient of recipients) {
                try {
                    const formattedNumber = this.formatPhoneNumber(recipient);
                    console.log(`🎬 Sending media to ${recipient}`);
                    
                    const numberId = await client.getNumberId(formattedNumber);
                    if (!numberId) {
                        console.error(`❌ Invalid WhatsApp number: ${recipient}`);
                        results.push({ recipient, status: 'failed', error: 'Invalid number' });
                        continue;
                    }
                    
                    await client.sendMessage(formattedNumber, media, { 
                        caption: mediaData.caption || '' 
                    });
                    console.log(`✅ Media sent successfully to ${recipient}`);
                    results.push({ recipient, status: 'success' });
                    
                    // Wait between messages to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 2000));
                } catch (error) {
                    console.error(`❌ Failed to send media to ${recipient}:`, error.message);
                    results.push({ recipient, status: 'failed', error: error.message });
                }
            }
            
            return results;
        } catch (error) {
            console.error(`❌ Error in sendMedia:`, error);
            throw error;
        }
    }

    // Nouvelle méthode pour envoyer une localisation
    async sendLocation(senderId, recipients, locationData) {
        try {
            console.log(`📍 Attempting to send location via ${senderId}...`);
            await this.connect(senderId);
            const client = this.sessions.get(senderId);

            if (!client) {
                throw new Error(`No WhatsApp client found for ${senderId}`);
            }

            if (this.isTestMode) {
                console.log(`🧪 TEST MODE: Simulating location sending`);
                console.log(`📍 [TEST] Location: ${locationData.latitude}, ${locationData.longitude}`);
                return;
            }

            const { latitude, longitude, name, address } = locationData;
            
            if (!latitude || !longitude) {
                throw new Error('Latitude and longitude are required');
            }

            const location = new Location(latitude, longitude, { name, address });

            const results = [];
            for (const recipient of recipients) {
                try {
                    const formattedNumber = this.formatPhoneNumber(recipient);
                    console.log(`📍 Sending location to ${recipient}`);
                    
                    const numberId = await client.getNumberId(formattedNumber);
                    if (!numberId) {
                        console.error(`❌ Invalid WhatsApp number: ${recipient}`);
                        results.push({ recipient, status: 'failed', error: 'Invalid number' });
                        continue;
                    }
                    
                    await client.sendMessage(formattedNumber, location);
                    console.log(`✅ Location sent successfully to ${recipient}`);
                    results.push({ recipient, status: 'success' });
                    
                    // Wait between messages to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } catch (error) {
                    console.error(`❌ Failed to send location to ${recipient}:`, error.message);
                    results.push({ recipient, status: 'failed', error: error.message });
                }
            }
            
            return results;
        } catch (error) {
            console.error(`❌ Error in sendLocation:`, error);
            throw error;
        }
    }

    // Nouvelle méthode pour envoyer des cartes de contact
    async sendContactCard(senderId, recipients, contactData) {
        try {
            console.log(`👤 Attempting to send contact card via ${senderId}...`);
            await this.connect(senderId);
            const client = this.sessions.get(senderId);

            if (!client) {
                throw new Error(`No WhatsApp client found for ${senderId}`);
            }

            if (this.isTestMode) {
                console.log(`🧪 TEST MODE: Simulating contact card sending`);
                console.log(`👤 [TEST] Contact: ${contactData.name} - ${contactData.number}`);
                return;
            }

            const { name, number, organization } = contactData;
            
            if (!name || !number) {
                throw new Error('Contact name and number are required');
            }

            // Créer une vCard
            const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${name}
TEL:${number}${organization ? `\nORG:${organization}` : ''}
END:VCARD`;

            const results = [];
            for (const recipient of recipients) {
                try {
                    const formattedNumber = this.formatPhoneNumber(recipient);
                    console.log(`👤 Sending contact card to ${recipient}`);
                    
                    const numberId = await client.getNumberId(formattedNumber);
                    if (!numberId) {
                        console.error(`❌ Invalid WhatsApp number: ${recipient}`);
                        results.push({ recipient, status: 'failed', error: 'Invalid number' });
                        continue;
                    }
                    
                    await client.sendMessage(formattedNumber, vcard);
                    console.log(`✅ Contact card sent successfully to ${recipient}`);
                    results.push({ recipient, status: 'success' });
                    
                    // Wait between messages to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } catch (error) {
                    console.error(`❌ Failed to send contact card to ${recipient}:`, error.message);
                    results.push({ recipient, status: 'failed', error: error.message });
                }
            }
            
            return results;
        } catch (error) {
            console.error(`❌ Error in sendContactCard:`, error);
            throw error;
        }
    }

    // Nouvelle méthode pour envoyer des messages avec réaction
    async sendMessageWithReaction(senderId, recipients, messageData) {
        try {
            console.log(`😊 Attempting to send message with reaction option via ${senderId}...`);
            await this.connect(senderId);
            const client = this.sessions.get(senderId);

            if (!client) {
                throw new Error(`No WhatsApp client found for ${senderId}`);
            }

            if (this.isTestMode) {
                console.log(`🧪 TEST MODE: Simulating message with reaction sending`);
                console.log(`😊 [TEST] Message: "${messageData.text}"`);
                return;
            }

            const { text, suggestedReactions } = messageData;
            
            // Ajouter des suggestions de réactions au message
            let messageText = text;
            if (suggestedReactions && suggestedReactions.length > 0) {
                messageText += '\n\n💡 Réagissez avec: ' + suggestedReactions.join(' ');
            }

            const results = [];
            for (const recipient of recipients) {
                try {
                    const formattedNumber = this.formatPhoneNumber(recipient);
                    console.log(`😊 Sending message with reaction option to ${recipient}`);
                    
                    const numberId = await client.getNumberId(formattedNumber);
                    if (!numberId) {
                        console.error(`❌ Invalid WhatsApp number: ${recipient}`);
                        results.push({ recipient, status: 'failed', error: 'Invalid number' });
                        continue;
                    }
                    
                    await client.sendMessage(formattedNumber, messageText);
                    console.log(`✅ Message sent successfully to ${recipient}`);
                    results.push({ recipient, status: 'success' });
                    
                    // Wait between messages to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } catch (error) {
                    console.error(`❌ Failed to send message to ${recipient}:`, error.message);
                    results.push({ recipient, status: 'failed', error: error.message });
                }
            }
            
            return results;
        } catch (error) {
            console.error(`❌ Error in sendMessageWithReaction:`, error);
            throw error;
        }
    }

    // Méthode améliorée pour les messages avec format riche
    async sendRichMessage(senderId, recipients, messageData) {
        try {
            console.log(`✨ Attempting to send rich message via ${senderId}...`);
            await this.connect(senderId);
            const client = this.sessions.get(senderId);

            if (!client) {
                throw new Error(`No WhatsApp client found for ${senderId}`);
            }

            if (this.isTestMode) {
                console.log(`🧪 TEST MODE: Simulating rich message sending`);
                console.log(`✨ [TEST] Rich message: "${messageData.text}"`);
                return;
            }

            const { text, mentions, quotedMessage } = messageData;
            
            const options = {};
            
            // Support pour les mentions
            if (mentions && mentions.length > 0) {
                options.mentions = mentions.map(mention => this.formatPhoneNumber(mention));
            }

            // Support pour la citation de message
            if (quotedMessage) {
                options.quotedMessageId = quotedMessage;
            }

            const results = [];
            for (const recipient of recipients) {
                try {
                    const formattedNumber = this.formatPhoneNumber(recipient);
                    console.log(`✨ Sending rich message to ${recipient}`);
                    
                    const numberId = await client.getNumberId(formattedNumber);
                    if (!numberId) {
                        console.error(`❌ Invalid WhatsApp number: ${recipient}`);
                        results.push({ recipient, status: 'failed', error: 'Invalid number' });
                        continue;
                    }
                    
                    await client.sendMessage(formattedNumber, text, options);
                    console.log(`✅ Rich message sent successfully to ${recipient}`);
                    results.push({ recipient, status: 'success' });
                    
                    // Wait between messages to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } catch (error) {
                    console.error(`❌ Failed to send rich message to ${recipient}:`, error.message);
                    results.push({ recipient, status: 'failed', error: error.message });
                }
            }
              return results;
        } catch (error) {
            console.error(`❌ Error in sendRichMessage:`, error);
            throw error;
        }
    }

    // Méthode pour vérifier le statut d'une session
    getSessionStatus(senderId) {
        const hasMemorySession = this.sessions.has(senderId);
        const hasStoredSession = this.hasStoredSession(senderId);
        
        return {
            senderId,
            inMemory: hasMemorySession,
            stored: hasStoredSession,
            status: hasMemorySession ? 'connected' : (hasStoredSession ? 'stored' : 'none')
        };
    }

    // Méthode pour obtenir tous les statuts de session
    getAllSessionStatuses() {
        const allSessions = [];
        
        // Sessions en mémoire
        for (const [senderId] of this.sessions) {
            allSessions.push(this.getSessionStatus(senderId));
        }
        
        // Sessions stockées mais pas en mémoire
        try {
            const authPath = path.join(process.cwd(), '.wwebjs_auth');
            if (fs.existsSync(authPath)) {
                const sessionDirs = fs.readdirSync(authPath);
                for (const dir of sessionDirs) {
                    if (dir.startsWith('session-')) {
                        const senderId = dir.replace('session-', '');
                        if (!this.sessions.has(senderId)) {
                            allSessions.push(this.getSessionStatus(senderId));
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error reading session directories:', error);
        }
        
        return allSessions;
    }

    // Méthode pour déconnecter une session spécifique
    async disconnect(senderId) {
        if (this.sessions.has(senderId)) {
            const client = this.sessions.get(senderId);
            if (client && typeof client.destroy === 'function') {
                await client.destroy();
            }
            this.sessions.delete(senderId);
            console.log(`🔌 Disconnected WhatsApp session for ${senderId}`);
        }
    }

    // Méthode pour effacer complètement une session (supprime les données stockées)
    async clearSession(senderId) {
        // D'abord déconnecter si connecté
        await this.disconnect(senderId);
        
        // Ensuite supprimer les données stockées
        try {
            const sessionPath = path.join(process.cwd(), '.wwebjs_auth', `session-${senderId}`);
            if (fs.existsSync(sessionPath)) {
                fs.rmSync(sessionPath, { recursive: true, force: true });
                console.log(`🗑️  Cleared stored session data for ${senderId}`);
            }
        } catch (error) {
            console.error(`Error clearing session data for ${senderId}:`, error);
            throw error;
        }
    }
}

export default WhatsAppService;
