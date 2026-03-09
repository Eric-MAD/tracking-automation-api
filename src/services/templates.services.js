import * as templateRepository from "../repositories/templates.repository.js";

export const getAllTemplates = async () => {
  return templateRepository.getAllTemplates();
};