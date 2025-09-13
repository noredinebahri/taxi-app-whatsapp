import whatsappService from '../services/whatsappService.js';

class WhatsAppController {
    constructor() {
        console.log('🎮 WhatsApp Controller initialized');
    }

    // Envoyer un message simple
    async sendSimpleMessage(req, res) {
        try {
            const { recipient, message, sessionId = 'default' } = req.body;

            if (!recipient || !message) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required fields: recipient, message'
                });
            }

            console.log(`📤 Sending message to ${recipient} via session ${sessionId}`);
            
            // Créer le client s'il n'existe pas
            const sessionStatus = await whatsappService.getSessionStatus(sessionId);
            if (sessionStatus.status !== 'ready') {
                console.log(`🔄 Creating new session ${sessionId}`);
                const createResult = await whatsappService.createClient(sessionId);
                if (!createResult.success) {
                    return res.status(500).json({
                        success: false,
                        error: 'Failed to create WhatsApp session',
                        details: createResult.error
                    });
                }
            }

            // Envoyer le message
            const result = await whatsappService.sendMessage(sessionId, recipient, message);
            
            if (result.success) {
                return res.status(200).json({
                    success: true,
                    message: 'Message sent successfully',
                    recipient,
                    content: message,
                    sessionId,
                    messageId: result.messageId
                });
            } else {
                return res.status(500).json({
                    success: false,
                    error: 'Failed to send message',
                    details: result.error
                });
            }
        } catch (error) {
            console.error('❌ Error in sendSimpleMessage:', error.message);
            return res.status(500).json({
                success: false,
                error: 'Internal server error',
                details: error.message
            });
        }
    }

    // Obtenir le statut d'une session
    async getSessionStatus(req, res) {
        try {
            const { senderId = 'default' } = req.params;
            const status = await whatsappService.getSessionStatus(senderId);
            
            return res.status(200).json({
                success: true,
                sessionId: senderId,
                ...status
            });
        } catch (error) {
            console.error('❌ Error getting session status:', error.message);
            return res.status(500).json({
                success: false,
                error: 'Failed to get session status',
                details: error.message
            });
        }
    }

    // Obtenir toutes les sessions
    async getAllSessionStatuses(req, res) {
        try {
            const result = whatsappService.getAllSessions();
            return res.status(200).json(result);
        } catch (error) {
            console.error('❌ Error getting all sessions:', error.message);
            return res.status(500).json({
                success: false,
                error: 'Failed to get sessions',
                details: error.message
            });
        }
    }

    // Créer une nouvelle session
    async createSession(req, res) {
        try {
            const { sessionId = 'default' } = req.body;
            
            console.log(`🔄 Creating session ${sessionId}`);
            const result = await whatsappService.createClient(sessionId);
            
            if (result.success) {
                return res.status(200).json({
                    success: true,
                    message: `Session ${sessionId} created successfully`,
                    sessionId
                });
            } else {
                return res.status(500).json({
                    success: false,
                    error: 'Failed to create session',
                    details: result.error
                });
            }
        } catch (error) {
            console.error('❌ Error creating session:', error.message);
            return res.status(500).json({
                success: false,
                error: 'Failed to create session',
                details: error.message
            });
        }
    }

    // Déconnecter une session
    async disconnectSession(req, res) {
        try {
            const { senderId = 'default' } = req.params;
            
            console.log(`🔌 Disconnecting session ${senderId}`);
            const result = await whatsappService.disconnectSession(senderId);
            
            return res.status(200).json(result);
        } catch (error) {
            console.error('❌ Error disconnecting session:', error.message);
            return res.status(500).json({
                success: false,
                error: 'Failed to disconnect session',
                details: error.message
            });
        }
    }

    // Restaurer les sessions (pour compatibilité)
    async restoreStoredSessions(req, res) {
        try {
            console.log('🔄 Restore sessions called - creating default session');
            const result = await whatsappService.createClient('default');
            
            return res.status(200).json({
                success: true,
                message: 'Sessions restored',
                details: result
            });
        } catch (error) {
            console.error('❌ Error restoring sessions:', error.message);
            return res.status(500).json({
                success: false,
                error: 'Failed to restore sessions',
                details: error.message
            });
        }
    }

    // Nettoyer une session (pour compatibilité)
    async clearSession(req, res) {
        try {
            const { senderId = 'default' } = req.params;
            
            console.log(`🧹 Clearing session ${senderId}`);
            const result = await whatsappService.disconnectSession(senderId);
            
            return res.status(200).json({
                success: true,
                message: `Session ${senderId} cleared`,
                details: result
            });
        } catch (error) {
            console.error('❌ Error clearing session:', error.message);
            return res.status(500).json({
                success: false,
                error: 'Failed to clear session',
                details: error.message
            });
        }
    }

    // Envoyer un message de bienvenue
    async sendWelcomeMessage(req, res) {
        try {
            const { recipient, sessionId = 'default', customerName = '' } = req.body;

            if (!recipient) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required field: recipient'
                });
            }

            // Message de bienvenue personnalisé
            const welcomeMessage = `🚖 Bienvenue chez TransferVVIP ${customerName ? customerName : ''}!

✨ Nous sommes ravis de vous accueillir dans notre service de transport premium.

🌟 Nos services :
• Transport VIP avec chauffeurs professionnels
• Réservation 24h/24 et 7j/7
• Véhicules haut de gamme
• Service clientèle personnalisé

📱 Pour réserver votre prochain trajet, contactez-nous !

Merci de votre confiance ! 🙏`;

            console.log(`📤 Sending welcome message to ${recipient} via session ${sessionId}`);
            
            // Créer le client s'il n'existe pas
            const sessionStatus = await whatsappService.getSessionStatus(sessionId);
            if (sessionStatus.status !== 'ready') {
                console.log(`🔄 Creating new session ${sessionId}`);
                const createResult = await whatsappService.createClient(sessionId);
                if (!createResult.success) {
                    return res.status(500).json({
                        success: false,
                        error: 'Failed to create WhatsApp session',
                        details: createResult.error
                    });
                }
            }

            // Envoyer le message de bienvenue
            const result = await whatsappService.sendMessage(sessionId, recipient, welcomeMessage);
            
            if (result.success) {
                return res.status(200).json({
                    success: true,
                    message: 'Welcome message sent successfully',
                    recipient,
                    sessionId,
                    messageId: result.messageId,
                    template: 'welcome'
                });
            } else {
                return res.status(500).json({
                    success: false,
                    error: 'Failed to send welcome message',
                    details: result.error
                });
            }
        } catch (error) {
            console.error('❌ Error in sendWelcomeMessage:', error.message);
            return res.status(500).json({
                success: false,
                error: 'Internal server error',
                details: error.message
            });
        }
    }

    // Envoyer un message de confirmation de commande
    async sendOrderConfirmation(req, res) {
        try {
            const { 
                recipient, 
                sessionId = 'default', 
                orderNumber = '', 
                customerName = '',
                pickupLocation = '',
                destination = '',
                pickupTime = '',
                vehicleType = '',
                totalPrice = '',
                driverName = '',
                driverPhone = ''
            } = req.body;

            if (!recipient) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required field: recipient'
                });
            }

            // Message de confirmation de commande personnalisé
            const confirmationMessage = `✅ *CONFIRMATION DE RÉSERVATION*
🚖 TransferVVIP

📋 **Détails de votre réservation :**
${orderNumber ? `🔢 Numéro de commande : *${orderNumber}*\n` : ''}${customerName ? `👤 Client : *${customerName}*\n` : ''}${pickupLocation ? `📍 Lieu de prise en charge : *${pickupLocation}*\n` : ''}${destination ? `🎯 Destination : *${destination}*\n` : ''}${pickupTime ? `🕐 Heure de prise en charge : *${pickupTime}*\n` : ''}${vehicleType ? `🚗 Type de véhicule : *${vehicleType}*\n` : ''}${totalPrice ? `💰 Prix total : *${totalPrice}*\n` : ''}
${driverName || driverPhone ? '👨‍✈️ **Informations chauffeur :**\n' : ''}${driverName ? `• Nom : *${driverName}*\n` : ''}${driverPhone ? `• Téléphone : *${driverPhone}*\n` : ''}
📱 *Votre réservation est confirmée !*

🔔 Vous recevrez une notification 15 minutes avant l'arrivée de votre chauffeur.

❓ Des questions ? Contactez-nous !

✨ Merci de faire confiance à TransferVVIP ! 🙏`;

            console.log(`📤 Sending order confirmation to ${recipient} via session ${sessionId}`);
            
            // Créer le client s'il n'existe pas
            const sessionStatus = await whatsappService.getSessionStatus(sessionId);
            if (sessionStatus.status !== 'ready') {
                console.log(`🔄 Creating new session ${sessionId}`);
                const createResult = await whatsappService.createClient(sessionId);
                if (!createResult.success) {
                    return res.status(500).json({
                        success: false,
                        error: 'Failed to create WhatsApp session',
                        details: createResult.error
                    });
                }
            }

            // Envoyer le message de confirmation
            const result = await whatsappService.sendMessage(sessionId, recipient, confirmationMessage);
            
            if (result.success) {
                return res.status(200).json({
                    success: true,
                    message: 'Order confirmation sent successfully',
                    recipient,
                    sessionId,
                    messageId: result.messageId,
                    template: 'order-confirmation',
                    orderDetails: {
                        orderNumber,
                        customerName,
                        pickupLocation,
                        destination,
                        pickupTime,
                        vehicleType,
                        totalPrice
                    }
                });
            } else {
                return res.status(500).json({
                    success: false,
                    error: 'Failed to send order confirmation',
                    details: result.error
                });
            }
        } catch (error) {
            console.error('❌ Error in sendOrderConfirmation:', error.message);
            return res.status(500).json({
                success: false,
                error: 'Internal server error',
                details: error.message
            });
        }
    }

    // Envoyer une notification de livraison/arrivée
    async sendDeliveryNotification(req, res) {
        try {
            const { 
                recipient, 
                sessionId = 'default', 
                orderNumber = '', 
                customerName = '',
                driverName = '',
                driverPhone = '',
                vehicleInfo = '',
                licensePlate = '',
                estimatedArrival = '',
                currentLocation = '',
                notificationType = 'arrival' // 'arrival', 'onway', 'completed'
            } = req.body;

            if (!recipient) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required field: recipient'
                });
            }

            let notificationMessage = '';

            switch (notificationType) {
                case 'onway':
                    notificationMessage = `🚗 *VOTRE CHAUFFEUR EST EN ROUTE*
🚖 TransferVVIP

${orderNumber ? `📋 Commande : *${orderNumber}*\n` : ''}${customerName ? `👤 Client : *${customerName}*\n` : ''}
👨‍✈️ **Informations chauffeur :**
${driverName ? `• Nom : *${driverName}*\n` : ''}${driverPhone ? `• Téléphone : *${driverPhone}*\n` : ''}${vehicleInfo ? `🚗 Véhicule : *${vehicleInfo}*\n` : ''}${licensePlate ? `🔢 Plaque : *${licensePlate}*\n` : ''}${estimatedArrival ? `🕐 Arrivée estimée : *${estimatedArrival}*\n` : ''}${currentLocation ? `📍 Position actuelle : *${currentLocation}*\n` : ''}
📱 Votre chauffeur vous contactera à son arrivée.

✨ Merci de votre patience !`;
                    break;
                    
                case 'completed':
                    notificationMessage = `✅ *TRAJET TERMINÉ*
🚖 TransferVVIP

${orderNumber ? `📋 Commande : *${orderNumber}*\n` : ''}${customerName ? `👤 Client : *${customerName}*\n` : ''}
🎯 Votre trajet s'est terminé avec succès !

⭐ **Nous espérons que vous avez apprécié notre service !**

📝 N'hésitez pas à nous laisser un avis.
📱 Pour vos prochains trajets, contactez-nous !

🙏 Merci de faire confiance à TransferVVIP !`;
                    break;
                    
                default: // 'arrival'
                    notificationMessage = `🚗 *VOTRE CHAUFFEUR EST ARRIVÉ*
🚖 TransferVVIP

${orderNumber ? `📋 Commande : *${orderNumber}*\n` : ''}${customerName ? `👤 Client : *${customerName}*\n` : ''}
👨‍✈️ **Votre chauffeur vous attend :**
${driverName ? `• Nom : *${driverName}*\n` : ''}${driverPhone ? `• Téléphone : *${driverPhone}*\n` : ''}${vehicleInfo ? `🚗 Véhicule : *${vehicleInfo}*\n` : ''}${licensePlate ? `🔢 Plaque : *${licensePlate}*\n` : ''}${currentLocation ? `📍 Position : *${currentLocation}*\n` : ''}
📱 Votre chauffeur vous attend. Merci de vous diriger vers le véhicule.

✨ Bon voyage avec TransferVVIP !`;
            }

            console.log(`📤 Sending delivery notification (${notificationType}) to ${recipient} via session ${sessionId}`);
            
            // Créer le client s'il n'existe pas
            const sessionStatus = await whatsappService.getSessionStatus(sessionId);
            if (sessionStatus.status !== 'ready') {
                console.log(`🔄 Creating new session ${sessionId}`);
                const createResult = await whatsappService.createClient(sessionId);
                if (!createResult.success) {
                    return res.status(500).json({
                        success: false,
                        error: 'Failed to create WhatsApp session',
                        details: createResult.error
                    });
                }
            }

            // Envoyer la notification
            const result = await whatsappService.sendMessage(sessionId, recipient, notificationMessage);
            
            if (result.success) {
                return res.status(200).json({
                    success: true,
                    message: `Delivery notification (${notificationType}) sent successfully`,
                    recipient,
                    sessionId,
                    messageId: result.messageId,
                    template: 'delivery-notification',
                    notificationType,
                    deliveryDetails: {
                        orderNumber,
                        customerName,
                        driverName,
                        driverPhone,
                        vehicleInfo,
                        licensePlate,
                        estimatedArrival,
                        currentLocation
                    }
                });
            } else {
                return res.status(500).json({
                    success: false,
                    error: 'Failed to send delivery notification',
                    details: result.error
                });
            }
        } catch (error) {
            console.error('❌ Error in sendDeliveryNotification:', error.message);
            return res.status(500).json({
                success: false,
                error: 'Internal server error',
                details: error.message
            });
        }
    }

    // Envoyer une promotion
    async sendPromotion(req, res) {
        try {
            const { recipient, sessionId = 'default', promotionType = 'general', discount, validUntil, promoCode, description } = req.body;

            if (!recipient) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required field: recipient'
                });
            }

            // Créer le message de promotion personnalisé
            let promotionMessage = `🎉 *PROMOTION SPÉCIALE* 🎉\n🚖 TransferVVIP\n\n`;
            
            if (promotionType === 'discount' && discount) {
                promotionMessage += `💰 Profitez de *${discount}%* de réduction sur votre prochaine course !\n\n`;
            } else if (promotionType === 'free_ride') {
                promotionMessage += `🚗 *Course GRATUITE* pour votre prochain trajet !\n\n`;
            } else if (promotionType === 'new_customer') {
                promotionMessage += `🌟 Bienvenue ! Profitez de *50% de réduction* sur votre première course !\n\n`;
            } else {
                promotionMessage += `🎁 Offre spéciale disponible maintenant !\n\n`;
            }

            if (description) {
                promotionMessage += `📝 *Détails:* ${description}\n\n`;
            }

            if (promoCode) {
                promotionMessage += `🏷️ *Code promo:* ${promoCode}\n`;
            }

            if (validUntil) {
                promotionMessage += `⏰ *Valable jusqu'au:* ${validUntil}\n\n`;
            }

            promotionMessage += `📱 Réservez maintenant !\n✨ Votre service de transport premium`;

            console.log(`📤 Sending promotion to ${recipient} via session ${sessionId}`);
            
            // Créer le client s'il n'existe pas
            const sessionStatus = await whatsappService.getSessionStatus(sessionId);
            if (sessionStatus.status !== 'ready') {
                console.log(`🔄 Creating new session ${sessionId}`);
                const createResult = await whatsappService.createClient(sessionId);
                if (!createResult.success) {
                    return res.status(500).json({
                        success: false,
                        error: 'Failed to create WhatsApp session',
                        details: createResult.error
                    });
                }
            }

            // Envoyer la promotion
            const result = await whatsappService.sendMessage(sessionId, recipient, promotionMessage);
            
            if (result.success) {
                return res.status(200).json({
                    success: true,
                    message: 'Promotion sent successfully',
                    recipient,
                    sessionId,
                    messageId: result.messageId,
                    template: 'promotion',
                    promotionDetails: {
                        promotionType,
                        discount,
                        promoCode,
                        validUntil,
                        description
                    }
                });
            } else {
                return res.status(500).json({
                    success: false,
                    error: 'Failed to send promotion',
                    details: result.error
                });
            }
        } catch (error) {
            console.error('❌ Error in sendPromotion:', error.message);
            return res.status(500).json({
                success: false,
                error: 'Internal server error',
                details: error.message
            });
        }
    }

    // Envoyer une alerte d'urgence
    async sendEmergencyAlert(req, res) {
        try {
            const { recipient, sessionId = 'default', alertType = 'general', message: customMessage, location, contactNumber, severity = 'high' } = req.body;

            if (!recipient) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required field: recipient'
                });
            }

            // Créer le message d'alerte d'urgence
            let alertMessage = `🚨 *ALERTE D'URGENCE* 🚨\n🚖 TransferVVIP\n\n`;
            
            if (alertType === 'security') {
                alertMessage += `🔒 *Alerte de sécurité*\nVotre sécurité est notre priorité. Veuillez prendre les précautions nécessaires.\n\n`;
            } else if (alertType === 'weather') {
                alertMessage += `🌧️ *Alerte météorologique*\nConditions météorologiques dangereuses signalées. Soyez prudent lors de vos déplacements.\n\n`;
            } else if (alertType === 'traffic') {
                alertMessage += `🚦 *Alerte circulation*\nPerturbations importantes du trafic signalées. Prévoyez des délais supplémentaires.\n\n`;
            } else if (alertType === 'service') {
                alertMessage += `⚠️ *Alerte service*\nInterruption temporaire de nos services dans certaines zones.\n\n`;
            } else {
                alertMessage += `⚠️ *Alerte générale*\n\n`;
            }

            if (customMessage) {
                alertMessage += `📢 *Message:* ${customMessage}\n\n`;
            }

            if (location) {
                alertMessage += `📍 *Zone concernée:* ${location}\n`;
            }

            if (contactNumber) {
                alertMessage += `📞 *Contact d'urgence:* ${contactNumber}\n`;
            }

            alertMessage += `\n⏰ *Envoyé le:* ${new Date().toLocaleString('fr-FR')}\n🚖 Équipe TransferVVIP`;

            console.log(`📤 Sending emergency alert (${alertType}) to ${recipient} via session ${sessionId}`);
            
            // Créer le client s'il n'existe pas
            const sessionStatus = await whatsappService.getSessionStatus(sessionId);
            if (sessionStatus.status !== 'ready') {
                console.log(`🔄 Creating new session ${sessionId}`);
                const createResult = await whatsappService.createClient(sessionId);
                if (!createResult.success) {
                    return res.status(500).json({
                        success: false,
                        error: 'Failed to create WhatsApp session',
                        details: createResult.error
                    });
                }
            }

            // Envoyer l'alerte
            const result = await whatsappService.sendMessage(sessionId, recipient, alertMessage);
            
            if (result.success) {
                return res.status(200).json({
                    success: true,
                    message: 'Emergency alert sent successfully',
                    recipient,
                    sessionId,
                    messageId: result.messageId,
                    template: 'emergency-alert',
                    alertDetails: {
                        alertType,
                        severity,
                        location,
                        contactNumber,
                        customMessage
                    }
                });
            } else {
                return res.status(500).json({
                    success: false,
                    error: 'Failed to send emergency alert',
                    details: result.error
                });
            }
        } catch (error) {
            console.error('❌ Error in sendEmergencyAlert:', error.message);
            return res.status(500).json({
                success: false,
                error: 'Internal server error',
                details: error.message
            });
        }
    }
}

export default WhatsAppController;