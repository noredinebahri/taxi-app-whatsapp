class TemplateService {
    constructor() {
        this.templates = new Map();
    }

    addTemplate(name, template) {
        this.templates.set(name, template);
    }

    getTemplate(name) {
        return this.templates.get(name);
    }

    getAllTemplates() {
        return Array.from(this.templates.entries()).map(([name, template]) => ({ name, template }));
    }
}

export default TemplateService;