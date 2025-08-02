import express from 'express';
import WhatsAppController from '../controllers/whatsappController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
const whatsappController = new WhatsAppController();

// Message sending
router.post('/send', authMiddleware, whatsappController.sendMessage.bind(whatsappController));

// Session management
router.get('/session/:senderId/status', whatsappController.getSessionStatus.bind(whatsappController));
router.get('/sessions/status', whatsappController.getAllSessionStatuses.bind(whatsappController));
router.post('/sessions/restore', whatsappController.restoreStoredSessions.bind(whatsappController));
router.delete('/session/:senderId/disconnect', whatsappController.disconnectSession.bind(whatsappController));
router.delete('/session/:senderId/clear', whatsappController.clearSession.bind(whatsappController));

// Routes pour les fonctionnalités avancées
router.post('/send-poll', authMiddleware, whatsappController.sendPoll.bind(whatsappController));
router.post('/send-media', authMiddleware, whatsappController.sendMedia.bind(whatsappController));
router.post('/send-location', authMiddleware, whatsappController.sendLocation.bind(whatsappController));
router.post('/send-contact', authMiddleware, whatsappController.sendContactCard.bind(whatsappController));
router.post('/send-message-with-reaction', authMiddleware, whatsappController.sendMessageWithReaction.bind(whatsappController));
router.post('/send-rich-message', authMiddleware, whatsappController.sendRichMessage.bind(whatsappController));

// Template Routes
router.post('/templates/welcome', authMiddleware, (req, res) => whatsappController.sendWelcomeMessage(req, res));
router.post('/templates/order-confirmation', authMiddleware, (req, res) => whatsappController.sendOrderConfirmation(req, res));
router.post('/templates/delivery-notification', authMiddleware, (req, res) => whatsappController.sendDeliveryNotification(req, res));
router.post('/templates/promotion', authMiddleware, (req, res) => whatsappController.sendPromotion(req, res));
router.post('/templates/appointment-reminder', authMiddleware, (req, res) => whatsappController.sendAppointmentReminder(req, res));
router.post('/templates/payment-request', authMiddleware, (req, res) => whatsappController.sendPaymentRequest(req, res));
router.post('/templates/customer-satisfaction', authMiddleware, (req, res) => whatsappController.sendCustomerSatisfaction(req, res));
router.post('/templates/newsletter', authMiddleware, (req, res) => whatsappController.sendNewsletter(req, res));
router.post('/templates/emergency-alert', authMiddleware, (req, res) => whatsappController.sendEmergencyAlert(req, res));
router.post('/templates/birthday-wishes', authMiddleware, (req, res) => whatsappController.sendBirthdayWishes(req, res));

export default router;