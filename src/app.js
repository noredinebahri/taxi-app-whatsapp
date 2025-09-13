import express from 'express';
import dotenv from 'dotenv';
import whatsappRoutes from './routes/whatsapp.js';
import templateRoutes from './routes/template.js';
import authMiddleware from './middleware/auth.js';
import logger from './utils/logger.js';
import whatsappService from './services/whatsappService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Apply auth middleware to template routes
app.use('/api/template', authMiddleware, templateRoutes);

// WhatsApp routes (some may have individual auth)
app.use('/api/whatsapp', whatsappRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'WhatsApp Transfer VVIP is running' });
});

app.listen(PORT, async () => {
    logger.info(`Server is running on port ${PORT}`);
    
    // Initialiser automatiquement la session WhatsApp par défaut
    try {
        console.log('🚀 Initializing default WhatsApp session...');
        const result = await whatsappService.createClient('default');
        if (result.success) {
            console.log('✅ Default WhatsApp session initialized successfully');
        } else {
            console.error('❌ Failed to initialize default WhatsApp session:', result.error);
        }
    } catch (error) {
        console.error('❌ Error during WhatsApp initialization:', error.message);
    }
});