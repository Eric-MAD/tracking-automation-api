import * as templateRepository from "../repositories/templates.repository.js";

export const getAllTemplates = async () => {
  return templateRepository.getAllTemplates();
};

export const getTemplateById = async (id) => {
  return templateRepository.getTemplateById(id);
}
export const createTemplate = async (templateData) => {
  return templateRepository.createTemplate(templateData);
}