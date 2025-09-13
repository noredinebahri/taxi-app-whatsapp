import express from 'express';
import WhatsAppController from '../controllers/whatsappController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
const whatsappController = new WhatsAppController();

console.log('🛣️ WhatsApp routes initialized');

// Routes essentielles pour l'envoi de messages
router.post('/send-simple', whatsappController.sendSimpleMessage.bind(whatsappController));

// Gestion des sessions
router.get('/session/:senderId/status', whatsappController.getSessionStatus.bind(whatsappController));
router.get('/sessions/status', whatsappController.getAllSessionStatuses.bind(whatsappController));
router.post('/sessions/create', whatsappController.createSession.bind(whatsappController));
router.post('/sessions/restore', whatsappController.restoreStoredSessions.bind(whatsappController));
router.delete('/session/:senderId/disconnect', whatsappController.disconnectSession.bind(whatsappController));
router.delete('/session/:senderId/clear', whatsappController.clearSession.bind(whatsappController));

// Template Routes
router.post('/templates/welcome', whatsappController.sendWelcomeMessage.bind(whatsappController));
router.post('/templates/order-confirmation', whatsappController.sendOrderConfirmation.bind(whatsappController));
router.post('/templates/delivery-notification', whatsappController.sendDeliveryNotification.bind(whatsappController));
router.post('/templates/promotion', whatsappController.sendPromotion.bind(whatsappController));
router.post('/templates/emergency-alert', whatsappController.sendEmergencyAlert.bind(whatsappController));
export default router;
 