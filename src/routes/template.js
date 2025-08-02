import express from 'express';
import TemplateController from '../controllers/templateController.js';

const router = express.Router();
const templateController = new TemplateController();

// Route to add a custom template
router.post('/', templateController.addTemplate.bind(templateController));

// Route to retrieve all custom templates (optional)
router.get('/', templateController.getTemplates.bind(templateController));

export default router;