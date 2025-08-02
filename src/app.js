import express from 'express';
import dotenv from 'dotenv';
import whatsappRoutes from './routes/whatsapp.js';
import templateRoutes from './routes/template.js';
import authMiddleware from './middleware/auth.js';
import logger from './utils/logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(authMiddleware);

app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/template', templateRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'WhatsApp Transfer VVIP is running' });
});

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});