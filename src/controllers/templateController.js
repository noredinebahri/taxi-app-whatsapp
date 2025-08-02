import TemplateService from '../services/templateService.js';

class TemplateController {
    constructor() {
        this.templateService = new TemplateService();
    }

    addTemplate(req, res) {
        const { templateId, template } = req.body;

        if (!templateId || !template) {
            return res.status(400).json({ error: 'Template ID and template content are required.' });
        }

        this.templateService.addTemplate(templateId, template);
        return res.status(201).json({ message: 'Template added successfully.' });
    }

    getTemplates(req, res) {
        const templates = this.templateService.getAllTemplates();
        return res.status(200).json({ templates });
    }

    getTemplate(req, res) {
        const { templateId } = req.params;

        const template = this.templateService.getTemplate(templateId);
        if (!template) {
            return res.status(404).json({ error: 'Template not found.' });
        }

        return res.status(200).json({ template });
    }
}

export default TemplateController;