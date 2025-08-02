import WhatsAppService from '../services/whatsappService.js';

class WhatsAppController {
    constructor() {
        this.whatsappService = new WhatsAppService();
    }

    async sendMessage(req, res) {
        const { senderId = 'default', recipients, template, params } = req.body;

        if (!recipients || !template || !params) {
            return res.status(400).json({ error: 'Missing required fields: recipients, template, params' });
        }

        try {
            const messages = params.map(param => {
                return this.replaceTemplateVariables(template, param);
            });

            await this.whatsappService.sendMessages(senderId, recipients, messages);
            console.log('Messages sent successfully');
            return res.status(200).json({ message: 'Messages sent successfully' });
        } catch (error) {
            console.error('Error sending messages:', error);
            return res.status(500).json({ error: 'Failed to send messages' });
        }
    }

    replaceTemplateVariables(template, params) {
        return Object.keys(params).reduce((result, key) => {
            return result.replace(new RegExp(`{{${key}}}`, 'g'), params[key]);
        }, template);
    }

    async getSessionStatus(req, res) {
        try {
            const { senderId = 'default' } = req.params;
            const status = this.whatsappService.getSessionStatus(senderId);
            return res.status(200).json(status);
        } catch (error) {
            console.error('Error getting session status:', error);
            return res.status(500).json({ error: 'Failed to get session status' });
        }
    }

    async getAllSessionStatuses(req, res) {
        try {
            const statuses = this.whatsappService.getAllSessionStatuses();
            return res.status(200).json(statuses);
        } catch (error) {
            console.error('Error getting all session statuses:', error);
            return res.status(500).json({ error: 'Failed to get session statuses' });
        }
    }

    async disconnectSession(req, res) {
        try {
            const { senderId = 'default' } = req.params;
            await this.whatsappService.disconnect(senderId);
            return res.status(200).json({ message: `Session ${senderId} disconnected successfully` });
        } catch (error) {
            console.error('Error disconnecting session:', error);
            return res.status(500).json({ error: 'Failed to disconnect session' });
        }
    }

    async clearSession(req, res) {
        try {
            const { senderId = 'default' } = req.params;
            await this.whatsappService.clearSession(senderId);
            return res.status(200).json({ message: `Session ${senderId} cleared successfully` });
        } catch (error) {
            console.error('Error clearing session:', error);
            return res.status(500).json({ error: 'Failed to clear session' });
        }
    }

    async restoreStoredSessions(req, res) {
        try {
            await this.whatsappService.restoreStoredSessions();
            return res.status(200).json({ 
                message: 'Session restoration initiated successfully',
                note: 'Sessions are being restored in the background. Check individual session statuses for progress.'
            });
        } catch (error) {
            console.error('Error restoring sessions:', error);
            return res.status(500).json({ error: 'Failed to restore sessions' });
        }
    }

    // Nouveau endpoint pour envoyer des sondages
    async sendPoll(req, res) {
        const { senderId = 'default', recipients, pollData } = req.body;

        if (!recipients || !pollData || !pollData.question || !pollData.options) {
            return res.status(400).json({ 
                error: 'Missing required fields: recipients, pollData.question, pollData.options' 
            });
        }

        if (pollData.options.length < 2) {
            return res.status(400).json({ 
                error: 'Poll must have at least 2 options' 
            });
        }

        try {
            const results = await this.whatsappService.sendPoll(senderId, recipients, pollData);
            console.log('Poll sent successfully');
            return res.status(200).json({ 
                message: 'Poll sent successfully',
                results: results 
            });
        } catch (error) {
            console.error('Error sending poll:', error);
            return res.status(500).json({ error: 'Failed to send poll' });
        }
    }

    // Nouveau endpoint pour envoyer des médias
    async sendMedia(req, res) {
        const { senderId = 'default', recipients, mediaData } = req.body;

        if (!recipients || !mediaData) {
            return res.status(400).json({ 
                error: 'Missing required fields: recipients, mediaData' 
            });
        }

        if (!mediaData.filePath && !mediaData.url && !mediaData.base64) {
            return res.status(400).json({ 
                error: 'Media source required: filePath, url, or base64' 
            });
        }

        try {
            const results = await this.whatsappService.sendMedia(senderId, recipients, mediaData);
            console.log('Media sent successfully');
            return res.status(200).json({ 
                message: 'Media sent successfully',
                results: results 
            });
        } catch (error) {
            console.error('Error sending media:', error);
            return res.status(500).json({ error: 'Failed to send media' });
        }
    }

    // Nouveau endpoint pour envoyer une localisation
    async sendLocation(req, res) {
        const { senderId = 'default', recipients, locationData } = req.body;

        if (!recipients || !locationData || !locationData.latitude || !locationData.longitude) {
            return res.status(400).json({ 
                error: 'Missing required fields: recipients, locationData.latitude, locationData.longitude' 
            });
        }

        try {
            const results = await this.whatsappService.sendLocation(senderId, recipients, locationData);
            console.log('Location sent successfully');
            return res.status(200).json({ 
                message: 'Location sent successfully',
                results: results 
            });
        } catch (error) {
            console.error('Error sending location:', error);
            return res.status(500).json({ error: 'Failed to send location' });
        }
    }

    // Nouveau endpoint pour envoyer des cartes de contact
    async sendContactCard(req, res) {
        const { senderId = 'default', recipients, contactData } = req.body;

        if (!recipients || !contactData || !contactData.name || !contactData.number) {
            return res.status(400).json({ 
                error: 'Missing required fields: recipients, contactData.name, contactData.number' 
            });
        }

        try {
            const results = await this.whatsappService.sendContactCard(senderId, recipients, contactData);
            console.log('Contact card sent successfully');
            return res.status(200).json({ 
                message: 'Contact card sent successfully',
                results: results 
            });
        } catch (error) {
            console.error('Error sending contact card:', error);
            return res.status(500).json({ error: 'Failed to send contact card' });
        }
    }

    // Nouveau endpoint pour les messages avec réactions suggérées
    async sendMessageWithReaction(req, res) {
        const { senderId = 'default', recipients, messageData } = req.body;

        if (!recipients || !messageData || !messageData.text) {
            return res.status(400).json({ 
                error: 'Missing required fields: recipients, messageData.text' 
            });
        }

        try {
            const results = await this.whatsappService.sendMessageWithReaction(senderId, recipients, messageData);
            console.log('Message with reaction option sent successfully');
            return res.status(200).json({ 
                message: 'Message with reaction option sent successfully',
                results: results 
            });
        } catch (error) {
            console.error('Error sending message with reaction:', error);
            return res.status(500).json({ error: 'Failed to send message with reaction' });
        }
    }

    // Nouveau endpoint pour les messages riches (mentions, citations)
    async sendRichMessage(req, res) {
        const { senderId = 'default', recipients, messageData } = req.body;

        if (!recipients || !messageData || !messageData.text) {
            return res.status(400).json({ 
                error: 'Missing required fields: recipients, messageData.text' 
            });
        }

        try {
            const results = await this.whatsappService.sendRichMessage(senderId, recipients, messageData);
            console.log('Rich message sent successfully');
            return res.status(200).json({ 
                message: 'Rich message sent successfully',
                results: results 
            });
        } catch (error) {
            console.error('Error sending rich message:', error);
            return res.status(500).json({ error: 'Failed to send rich message' });
        }
    }

    // Template: Message de bienvenue
    async sendWelcomeMessage(req, res) {
        const { senderId = 'default', recipients, customerName, companyName = 'Notre Entreprise' } = req.body;

        if (!recipients || !customerName) {
            return res.status(400).json({ 
                error: 'Missing required fields: recipients, customerName' 
            });
        }

        try {
            const message = `*Bienvenue chez ${companyName}!*

Bonjour ${customerName},

Nous sommes ravis de vous accueillir parmi nos clients! 

Voici ce que vous pouvez attendre de nous:
• Service client exceptionnel
• Livraisons rapides
• Qualité garantie
• Support 24/7

Pour toute question, n'hésitez pas à nous contacter.

Merci de votre confiance!

_${companyName} - Votre satisfaction, notre priorité_`;

            await this.whatsappService.sendMessages(senderId, recipients, [message]);
            console.log('Welcome message sent successfully');
            return res.status(200).json({ message: 'Welcome message sent successfully' });
        } catch (error) {
            console.error('Error sending welcome message:', error);
            return res.status(500).json({ error: 'Failed to send welcome message' });
        }
    }

    // Template: Confirmation de commande
    async sendOrderConfirmation(req, res) {
        const { senderId = 'default', recipients, orderData } = req.body;

        if (!recipients || !orderData || !orderData.orderNumber) {
            return res.status(400).json({ 
                error: 'Missing required fields: recipients, orderData.orderNumber' 
            });
        }

        try {
            const { orderNumber, customerName, items, total, deliveryTime } = orderData;
            
            let itemsList = '';
            if (items && items.length > 0) {
                itemsList = items.map(item => `• ${item.name} (x${item.quantity}) - ${item.price}DH`).join('\n');
            }

            const message = `*Commande Confirmée*

Bonjour ${customerName || 'Cher client'},

Votre commande #${orderNumber} a été confirmée avec succès!

*Détails de la commande:*
${itemsList}

*Total: ${total}DH*

*Livraison prévue: ${deliveryTime || 'Dans les plus brefs délais'}*

Nous préparons votre commande avec soin. Vous recevrez une notification dès qu'elle sera en route!

Merci pour votre confiance!`;

            await this.whatsappService.sendMessages(senderId, recipients, [message]);
            console.log('Order confirmation sent successfully');
            return res.status(200).json({ message: 'Order confirmation sent successfully' });
        } catch (error) {
            console.error('Error sending order confirmation:', error);
            return res.status(500).json({ error: 'Failed to send order confirmation' });
        }
    }

    // Template: Notification de livraison
    async sendDeliveryNotification(req, res) {
        const { senderId = 'default', recipients, deliveryData } = req.body;

        if (!recipients || !deliveryData || !deliveryData.orderNumber) {
            return res.status(400).json({ 
                error: 'Missing required fields: recipients, deliveryData.orderNumber' 
            });
        }

        try {
            const { orderNumber, customerName, driverName, driverPhone, estimatedTime, trackingUrl } = deliveryData;

            const message = `*Votre commande est en route!*

Bonjour ${customerName || 'Cher client'},

Bonne nouvelle! Votre commande #${orderNumber} a quitté notre entrepôt.

*Votre livreur:* ${driverName || 'Notre équipe'}
*Contact livreur:* ${driverPhone || 'Disponible via app'}

*Arrivée estimée:* ${estimatedTime || 'Dans les prochaines heures'}

${trackingUrl ? `*Suivre votre commande:* ${trackingUrl}` : ''}

Préparez-vous à recevoir votre commande!

Merci de votre patience!`;

            await this.whatsappService.sendMessages(senderId, recipients, [message]);
            console.log('Delivery notification sent successfully');
            return res.status(200).json({ message: 'Delivery notification sent successfully' });
        } catch (error) {
            console.error('Error sending delivery notification:', error);
            return res.status(500).json({ error: 'Failed to send delivery notification' });
        }
    }

    // Template: Promotion spéciale
    async sendPromotion(req, res) {
        const { senderId = 'default', recipients, promoData } = req.body;

        if (!recipients || !promoData || !promoData.title) {
            return res.status(400).json({ 
                error: 'Missing required fields: recipients, promoData.title' 
            });
        }

        try {
            const { title, description, discount, code, validUntil, conditions } = promoData;

            const message = `*${title}*

${description || 'Offre spéciale limitée!'}

*Réduction: ${discount || '20%'}*
*Code promo: ${code || 'SPECIAL2025'}*
*Valable jusqu\'au: ${validUntil || 'Fin du mois'}*

${conditions ? `*Conditions:*\n${conditions}` : ''}

*Comment utiliser votre code:*
1. Ajoutez vos articles au panier
2. Entrez le code promo
3. Profitez de votre réduction!

Ne manquez pas cette opportunité!

_Offre limitée dans le temps_`;

            await this.whatsappService.sendMessages(senderId, recipients, [message]);
            console.log('Promotion sent successfully');
            return res.status(200).json({ message: 'Promotion sent successfully' });
        } catch (error) {
            console.error('Error sending promotion:', error);
            return res.status(500).json({ error: 'Failed to send promotion' });
        }
    }

    // Template: Rappel de rendez-vous
    async sendAppointmentReminder(req, res) {
        const { senderId = 'default', recipients, appointmentData } = req.body;

        if (!recipients || !appointmentData || !appointmentData.date) {
            return res.status(400).json({ 
                error: 'Missing required fields: recipients, appointmentData.date' 
            });
        }

        try {
            const { customerName, date, time, location, service, practitioner } = appointmentData;

            const message = `*Rappel de Rendez-vous*

Bonjour ${customerName || 'Cher client'},

Nous vous rappelons votre rendez-vous:

*Date:* ${date}
*Heure:* ${time || 'À confirmer'}
*Lieu:* ${location || 'Nos locaux'}
*Service:* ${service || 'Consultation'}
*Avec:* ${practitioner || 'Notre équipe'}

*Important:*
• Arrivez 10 minutes avant l'heure
• Apportez vos documents si nécessaire
• En cas d'empêchement, contactez-nous

Pour modifier ou annuler: Répondez à ce message

À bientôt!`;

            await this.whatsappService.sendMessages(senderId, recipients, [message]);
            console.log('Appointment reminder sent successfully');
            return res.status(200).json({ message: 'Appointment reminder sent successfully' });
        } catch (error) {
            console.error('Error sending appointment reminder:', error);
            return res.status(500).json({ error: 'Failed to send appointment reminder' });
        }
    }

    // Template: Demande de paiement
    async sendPaymentRequest(req, res) {
        const { senderId = 'default', recipients, paymentData } = req.body;

        if (!recipients || !paymentData || !paymentData.amount) {
            return res.status(400).json({ 
                error: 'Missing required fields: recipients, paymentData.amount' 
            });
        }

        try {
            const { customerName, invoiceNumber, amount, dueDate, paymentMethods, paymentLink } = paymentData;

            const message = `*Demande de Paiement*

Bonjour ${customerName || 'Cher client'},

Nous vous informons qu'un paiement est en attente:

*Facture #${invoiceNumber || 'N/A'}*
*Montant: ${amount}DH*
*Échéance: ${dueDate || 'Immédiate'}*

*Moyens de paiement acceptés:*
${paymentMethods || '• Carte bancaire\n• Virement\n• Espèces'}

${paymentLink ? `*Payer en ligne:* ${paymentLink}` : ''}

Pour toute question sur cette facture, contactez-nous.

Merci de votre promptitude!

_Paiement sécurisé garanti_`;

            await this.whatsappService.sendMessages(senderId, recipients, [message]);
            console.log('Payment request sent successfully');
            return res.status(200).json({ message: 'Payment request sent successfully' });
        } catch (error) {
            console.error('Error sending payment request:', error);
            return res.status(500).json({ error: 'Failed to send payment request' });
        }
    }

    // Template: Enquête de satisfaction
    async sendCustomerSatisfaction(req, res) {
        const { senderId = 'default', recipients, surveyData } = req.body;

        if (!recipients) {
            return res.status(400).json({ 
                error: 'Missing required fields: recipients' 
            });
        }

        try {
            const { customerName, serviceDate, surveyLink } = surveyData || {};

            const message = `*Votre avis compte pour nous!*

Bonjour ${customerName || 'Cher client'},

Comment s'est passé votre expérience ${serviceDate ? `du ${serviceDate}` : 'récente'} avec nous?

*Votre satisfaction est notre priorité!*

${surveyLink ? `*Répondez à notre enquête:* ${surveyLink}` : ''}

Ou répondez simplement à ce message avec:
1 à 5 étoiles

*Partagez votre expérience:*
• Qu'avez-vous aimé?
• Que pouvons-nous améliorer?
• Recommanderiez-vous nos services?

Votre feedback nous aide à mieux vous servir!

_Merci de prendre quelques minutes pour nous aider_`;

            await this.whatsappService.sendMessages(senderId, recipients, [message]);
            console.log('Customer satisfaction survey sent successfully');
            return res.status(200).json({ message: 'Customer satisfaction survey sent successfully' });
        } catch (error) {
            console.error('Error sending customer satisfaction survey:', error);
            return res.status(500).json({ error: 'Failed to send customer satisfaction survey' });
        }
    }

    // Template: Newsletter
    async sendNewsletter(req, res) {
        const { senderId = 'default', recipients, newsletterData } = req.body;

        if (!recipients || !newsletterData || !newsletterData.title) {
            return res.status(400).json({ 
                error: 'Missing required fields: recipients, newsletterData.title' 
            });
        }

        try {
            const { title, content, highlights, callToAction, unsubscribeLink } = newsletterData;

            const message = `*${title}*

${content || 'Voici les dernières nouvelles de notre entreprise!'}

*Points forts de ce mois:*
${highlights || '• Nouveaux services disponibles\n• Amélioration de nos processus\n• Événements à venir'}

${callToAction ? `*${callToAction}*` : ''}

*Restons connectés:*
• Site web: www.example.com
• Email: contact@example.com
• Téléphone: +212 XXX XXX XXX

${unsubscribeLink ? `*Se désabonner:* ${unsubscribeLink}` : ''}

Merci de votre fidélité!

_Newsletter - ${new Date().toLocaleDateString('fr-FR')}_`;

            await this.whatsappService.sendMessages(senderId, recipients, [message]);
            console.log('Newsletter sent successfully');
            return res.status(200).json({ message: 'Newsletter sent successfully' });
        } catch (error) {
            console.error('Error sending newsletter:', error);
            return res.status(500).json({ error: 'Failed to send newsletter' });
        }
    }

    // Template: Alerte d'urgence
    async sendEmergencyAlert(req, res) {
        const { senderId = 'default', recipients, alertData } = req.body;

        if (!recipients || !alertData || !alertData.message) {
            return res.status(400).json({ 
                error: 'Missing required fields: recipients, alertData.message' 
            });
        }

        try {
            const { message, priority = 'HIGH', contactInfo, instructions } = alertData;

            const priorityText = priority === 'CRITICAL' ? 'CRITIQUE' : priority === 'HIGH' ? 'HAUTE' : 'NORMALE';

            const alertMessage = `*ALERTE ${priorityText}*

${message}

${instructions ? `*Instructions:*\n${instructions}` : ''}

${contactInfo ? `*Contact d'urgence:*\n${contactInfo}` : ''}

*Message envoyé le:* ${new Date().toLocaleString('fr-FR')}

_Veuillez prendre connaissance de ce message rapidement_`;

            await this.whatsappService.sendMessages(senderId, recipients, [alertMessage]);
            console.log('Emergency alert sent successfully');
            return res.status(200).json({ message: 'Emergency alert sent successfully' });
        } catch (error) {
            console.error('Error sending emergency alert:', error);
            return res.status(500).json({ error: 'Failed to send emergency alert' });
        }
    }

    // Template: Vœux d'anniversaire
    async sendBirthdayWishes(req, res) {
        const { senderId = 'default', recipients, birthdayData } = req.body;

        if (!recipients) {
            return res.status(400).json({ 
                error: 'Missing required fields: recipients' 
            });
        }

        try {
            const { customerName, specialOffer, companyName = 'Notre Équipe' } = birthdayData || {};

            const message = `*Joyeux Anniversaire!*

Cher ${customerName || 'client'},

Toute l'équipe de ${companyName} vous souhaite un très joyeux anniversaire!

*Votre cadeau d'anniversaire:*
${specialOffer || 'Réduction spéciale de 15% sur votre prochaine commande!'}

*Profitez de cette journée spéciale:*
• Célébrez avec vos proches
• Faites-vous plaisir
• Créez de beaux souvenirs

Que cette nouvelle année vous apporte joie, santé et succès!

Encore joyeux anniversaire!

_Avec toute notre amitié - ${companyName}_`;

            await this.whatsappService.sendMessages(senderId, recipients, [message]);
            console.log('Birthday wishes sent successfully');
            return res.status(200).json({ message: 'Birthday wishes sent successfully' });
        } catch (error) {
            console.error('Error sending birthday wishes:', error);
            return res.status(500).json({ error: 'Failed to send birthday wishes' });
        }
    }

    // Template: Confirmation de commande
    async sendOrderConfirmation(req, res) {
        const { senderId = 'default', recipients, orderData } = req.body;

        if (!recipients || !orderData || !orderData.orderNumber) {
            return res.status(400).json({ 
                error: 'Missing required fields: recipients, orderData.orderNumber' 
            });
        }

        try {
            const { orderNumber, customerName, items, total, deliveryTime } = orderData;
            
            let itemsList = '';
            if (items && items.length > 0) {
                itemsList = items.map(item => `• ${item.name} (x${item.quantity}) - ${item.price}DH`).join('\n');
            }

            const message = `✅ *Commande Confirmée*

Bonjour ${customerName || 'Cher client'},

Votre commande #${orderNumber} a été confirmée avec succès!

📦 *Détails de la commande:*
${itemsList}

💰 *Total: ${total}DH*

🚚 *Livraison prévue: ${deliveryTime || 'Dans les plus brefs délais'}*

Nous préparons votre commande avec soin. Vous recevrez une notification dès qu'elle sera en route!

Merci pour votre confiance! 🙏`;

            await this.whatsappService.sendMessages(senderId, recipients, [message]);
            console.log('Order confirmation sent successfully');
            return res.status(200).json({ message: 'Order confirmation sent successfully' });
        } catch (error) {
            console.error('Error sending order confirmation:', error);
            return res.status(500).json({ error: 'Failed to send order confirmation' });
        }
    }

    // Template: Notification de livraison
    async sendDeliveryNotification(req, res) {
        const { senderId = 'default', recipients, deliveryData } = req.body;

        if (!recipients || !deliveryData || !deliveryData.orderNumber) {
            return res.status(400).json({ 
                error: 'Missing required fields: recipients, deliveryData.orderNumber' 
            });
        }

        try {
            const { orderNumber, customerName, driverName, driverPhone, estimatedTime, trackingUrl } = deliveryData;

            const message = `🚚 *Votre commande est en route!*

Bonjour ${customerName || 'Cher client'},

Bonne nouvelle! Votre commande #${orderNumber} a quitté notre entrepôt.

👨‍🚚 *Votre livreur:* ${driverName || 'Notre équipe'}
📞 *Contact livreur:* ${driverPhone || 'Disponible via app'}

⏰ *Arrivée estimée:* ${estimatedTime || 'Dans les prochaines heures'}

${trackingUrl ? `🔍 *Suivre votre commande:* ${trackingUrl}` : ''}

Préparez-vous à recevoir votre commande! 📦✨

Merci de votre patience! 🙏`;

            await this.whatsappService.sendMessages(senderId, recipients, [message]);
            console.log('Delivery notification sent successfully');
            return res.status(200).json({ message: 'Delivery notification sent successfully' });
        } catch (error) {
            console.error('Error sending delivery notification:', error);
            return res.status(500).json({ error: 'Failed to send delivery notification' });
        }
    }

    // Template: Promotion spéciale
    async sendPromotion(req, res) {
        const { senderId = 'default', recipients, promoData } = req.body;

        if (!recipients || !promoData || !promoData.title) {
            return res.status(400).json({ 
                error: 'Missing required fields: recipients, promoData.title' 
            });
        }

        try {
            const { title, description, discount, code, validUntil, conditions } = promoData;

            const message = `🎉 *${title}*

${description || 'Offre spéciale limitée!'}

💥 *Réduction: ${discount || '20%'}*
🏷️ *Code promo: ${code || 'SPECIAL2025'}*
⏰ *Valable jusqu'au: ${validUntil || 'Fin du mois'}*

${conditions ? `📋 *Conditions:*\n${conditions}` : ''}

🛒 *Comment utiliser votre code:*
1. Ajoutez vos articles au panier
2. Entrez le code promo
3. Profitez de votre réduction!

Ne manquez pas cette opportunité! ⚡

_Offre limitée dans le temps_`;

            await this.whatsappService.sendMessages(senderId, recipients, [message]);
            console.log('Promotion sent successfully');
            return res.status(200).json({ message: 'Promotion sent successfully' });
        } catch (error) {
            console.error('Error sending promotion:', error);
            return res.status(500).json({ error: 'Failed to send promotion' });
        }
    }

    // Template: Rappel de rendez-vous
    async sendAppointmentReminder(req, res) {
        const { senderId = 'default', recipients, appointmentData } = req.body;

        if (!recipients || !appointmentData || !appointmentData.date) {
            return res.status(400).json({ 
                error: 'Missing required fields: recipients, appointmentData.date' 
            });
        }

        try {
            const { customerName, date, time, location, service, practitioner } = appointmentData;

            const message = `📅 *Rappel de Rendez-vous*

Bonjour ${customerName || 'Cher client'},

Nous vous rappelons votre rendez-vous:

📆 *Date:* ${date}
🕐 *Heure:* ${time || 'À confirmer'}
📍 *Lieu:* ${location || 'Nos locaux'}
🔧 *Service:* ${service || 'Consultation'}
👨‍⚕️ *Avec:* ${practitioner || 'Notre équipe'}

⚠️ *Important:*
• Arrivez 10 minutes avant l'heure
• Apportez vos documents si nécessaire
• En cas d'empêchement, contactez-nous

Pour modifier ou annuler: Répondez à ce message

À bientôt! 🙏`;

            await this.whatsappService.sendMessages(senderId, recipients, [message]);
            console.log('Appointment reminder sent successfully');
            return res.status(200).json({ message: 'Appointment reminder sent successfully' });
        } catch (error) {
            console.error('Error sending appointment reminder:', error);
            return res.status(500).json({ error: 'Failed to send appointment reminder' });
        }
    }

    // Template: Demande de paiement
    async sendPaymentRequest(req, res) {
        const { senderId = 'default', recipients, paymentData } = req.body;

        if (!recipients || !paymentData || !paymentData.amount) {
            return res.status(400).json({ 
                error: 'Missing required fields: recipients, paymentData.amount' 
            });
        }

        try {
            const { customerName, invoiceNumber, amount, dueDate, paymentMethods, paymentLink } = paymentData;

            const message = `💳 *Demande de Paiement*

Bonjour ${customerName || 'Cher client'},

Nous vous informons qu'un paiement est en attente:

🧾 *Facture #${invoiceNumber || 'N/A'}*
💰 *Montant: ${amount}DH*
📅 *Échéance: ${dueDate || 'Immédiate'}*

💳 *Moyens de paiement acceptés:*
${paymentMethods || '• Carte bancaire\n• Virement\n• Espèces'}

${paymentLink ? `🔗 *Payer en ligne:* ${paymentLink}` : ''}

Pour toute question sur cette facture, contactez-nous.

Merci de votre promptitude! 🙏

_Paiement sécurisé garanti_`;

            await this.whatsappService.sendMessages(senderId, recipients, [message]);
            console.log('Payment request sent successfully');
            return res.status(200).json({ message: 'Payment request sent successfully' });
        } catch (error) {
            console.error('Error sending payment request:', error);
            return res.status(500).json({ error: 'Failed to send payment request' });
        }
    }

    // Template: Enquête de satisfaction
    async sendCustomerSatisfaction(req, res) {
        const { senderId = 'default', recipients, surveyData } = req.body;

        if (!recipients) {
            return res.status(400).json({ 
                error: 'Missing required fields: recipients' 
            });
        }

        try {
            const { customerName, serviceDate, surveyLink } = surveyData || {};

            const message = `⭐ *Votre avis compte pour nous!*

Bonjour ${customerName || 'Cher client'},

Comment s'est passé votre expérience ${serviceDate ? `du ${serviceDate}` : 'récente'} avec nous?

🎯 *Votre satisfaction est notre priorité!*

${surveyLink ? `📝 *Répondez à notre enquête:* ${surveyLink}` : ''}

Ou répondez simplement à ce message avec:
⭐⭐⭐⭐⭐ (1 à 5 étoiles)

💬 *Partagez votre expérience:*
• Qu'avez-vous aimé?
• Que pouvons-nous améliorer?
• Recommanderiez-vous nos services?

Votre feedback nous aide à mieux vous servir! 🙏

_Merci de prendre quelques minutes pour nous aider_`;

            await this.whatsappService.sendMessages(senderId, recipients, [message]);
            console.log('Customer satisfaction survey sent successfully');
            return res.status(200).json({ message: 'Customer satisfaction survey sent successfully' });
        } catch (error) {
            console.error('Error sending customer satisfaction survey:', error);
            return res.status(500).json({ error: 'Failed to send customer satisfaction survey' });
        }
    }

    // Template: Newsletter
    async sendNewsletter(req, res) {
        const { senderId = 'default', recipients, newsletterData } = req.body;

        if (!recipients || !newsletterData || !newsletterData.title) {
            return res.status(400).json({ 
                error: 'Missing required fields: recipients, newsletterData.title' 
            });
        }

        try {
            const { title, content, highlights, callToAction, unsubscribeLink } = newsletterData;

            const message = `📰 *${title}*

${content || 'Voici les dernières nouvelles de notre entreprise!'}

✨ *Points forts de ce mois:*
${highlights || '• Nouveaux services disponibles\n• Amélioration de nos processus\n• Événements à venir'}

${callToAction ? `🎯 *${callToAction}*` : ''}

📞 *Restons connectés:*
• Site web: www.example.com
• Email: contact@example.com
• Téléphone: +212 XXX XXX XXX

${unsubscribeLink ? `🚫 *Se désabonner:* ${unsubscribeLink}` : ''}

Merci de votre fidélité! 🙏

_Newsletter - ${new Date().toLocaleDateString('fr-FR')}_`;

            await this.whatsappService.sendMessages(senderId, recipients, [message]);
            console.log('Newsletter sent successfully');
            return res.status(200).json({ message: 'Newsletter sent successfully' });
        } catch (error) {
            console.error('Error sending newsletter:', error);
            return res.status(500).json({ error: 'Failed to send newsletter' });
        }
    }

    // Template: Alerte d'urgence
    async sendEmergencyAlert(req, res) {
        const { senderId = 'default', recipients, alertData } = req.body;

        if (!recipients || !alertData || !alertData.message) {
            return res.status(400).json({ 
                error: 'Missing required fields: recipients, alertData.message' 
            });
        }

        try {
            const { message, priority = 'HIGH', contactInfo, instructions } = alertData;

            const priorityEmoji = priority === 'CRITICAL' ? '🚨' : priority === 'HIGH' ? '⚠️' : '📢';

            const alertMessage = `${priorityEmoji} *ALERTE ${priority}* ${priorityEmoji}

${message}

${instructions ? `📋 *Instructions:*\n${instructions}` : ''}

${contactInfo ? `📞 *Contact d'urgence:*\n${contactInfo}` : ''}

⏰ *Message envoyé le:* ${new Date().toLocaleString('fr-FR')}

_Veuillez prendre connaissance de ce message rapidement_`;

            await this.whatsappService.sendMessages(senderId, recipients, [alertMessage]);
            console.log('Emergency alert sent successfully');
            return res.status(200).json({ message: 'Emergency alert sent successfully' });
        } catch (error) {
            console.error('Error sending emergency alert:', error);
            return res.status(500).json({ error: 'Failed to send emergency alert' });
        }
    }

    // Template: Vœux d'anniversaire
    async sendBirthdayWishes(req, res) {
        const { senderId = 'default', recipients, birthdayData } = req.body;

        if (!recipients) {
            return res.status(400).json({ 
                error: 'Missing required fields: recipients' 
            });
        }

        try {
            const { customerName, specialOffer, companyName = 'Notre Équipe' } = birthdayData || {};

            const message = `🎂 *Joyeux Anniversaire!* 🎉

Cher ${customerName || 'client'},

Toute l'équipe de ${companyName} vous souhaite un très joyeux anniversaire! 🥳

🎁 *Votre cadeau d'anniversaire:*
${specialOffer || 'Réduction spéciale de 15% sur votre prochaine commande!'}

🌟 *Profitez de cette journée spéciale:*
• Célébrez avec vos proches
• Faites-vous plaisir
• Créez de beaux souvenirs

Que cette nouvelle année vous apporte joie, santé et succès! ✨

Encore joyeux anniversaire! 🎈🎊

_Avec toute notre amitié - ${companyName}_`;

            await this.whatsappService.sendMessages(senderId, recipients, [message]);
            console.log('Birthday wishes sent successfully');
            return res.status(200).json({ message: 'Birthday wishes sent successfully' });
        } catch (error) {
            console.error('Error sending birthday wishes:', error);
            return res.status(500).json({ error: 'Failed to send birthday wishes' });
        }
    }

    // Template: Confirmation de réservation taxi
    async sendTaxiBookingConfirmation(req, res) {
        const { senderId = 'default', recipients, bookingData } = req.body;

        if (!recipients || !bookingData) {
            return res.status(400).json({ 
                error: 'Missing required fields: recipients, bookingData' 
            });
        }

        try {
            const { 
                transactionId,
                pickup,
                destination,
                price,
                originalPrice,
                couponCode,
                discount,
                driver,
                passengers,
                luggage,
                specialOffer,
                emergencyNumber,
                estimatedTime,
                bookingTime
            } = bookingData;

            // Calcul du prix avec réduction si applicable
            const finalPrice = price || originalPrice;
            const savings = originalPrice && price ? (originalPrice - price) : 0;

            const message = `🚖 *CONFIRMATION DE RÉSERVATION TAXI*

📋 *Détails de la course:*
🆔 Transaction: #${transactionId || 'N/A'}
📅 Réservé le: ${bookingTime || new Date().toLocaleString('fr-FR')}

📍 *Trajet:*
🟢 Départ: ${pickup?.address || pickup || 'Non spécifié'}
🔴 Arrivée: ${destination?.address || destination || 'Non spécifié'}
⏱️ Durée estimée: ${estimatedTime || 'À déterminer'}

👨‍💼 *Votre chauffeur:*
👤 ${driver?.firstName || ''} ${driver?.lastName || 'Chauffeur assigné'}
📱 Tél: ${driver?.phone || 'Sera communiqué'}
🚗 Véhicule: ${driver?.vehicleType || 'Berline'}

👥 *Informations passagers:*
🧳 Passagers: ${passengers || 1}
💼 Bagages: ${luggage || 0}

💰 *Tarification:*
${originalPrice && savings > 0 ? `💸 Prix initial: ${originalPrice}€
🎟️ Code promo: ${couponCode || 'REDUCTION'}
💚 Économie: -${savings}€
` : ''}💵 *Prix final: ${finalPrice}€*

${specialOffer ? `🎁 *Offre spéciale:*
${specialOffer}

` : ''}🆘 *Urgence:* ${emergencyNumber || '+212 6XX XXX XXX'}

✅ *Votre réservation est confirmée!*

_Merci de votre confiance. Bon voyage!_ 🌟`;

            await this.whatsappService.sendMessages(senderId, recipients, [message]);
            console.log('Taxi booking confirmation sent successfully');
            return res.status(200).json({ 
                message: 'Taxi booking confirmation sent successfully',
                transactionId: transactionId
            });
        } catch (error) {
            console.error('Error sending taxi booking confirmation:', error);
            return res.status(500).json({ error: 'Failed to send taxi booking confirmation' });
        }
    }
}

export default WhatsAppController;