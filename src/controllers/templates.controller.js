import * as templateService from "../services/templates.services.js";

export const getTemplates = async (req, res) => {
  try {
    const templates = await templateService.getAllTemplates();

    res.status(200).json({
      success: true,
      data: templates,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch templates",
    });
  }
};

export const getTemplateById = async (req, res) => {
  try {
    const { id } = req.params;
    const template = await templateService.getTemplateById(id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found",
      });
    }

    res.status(200).json({
      success: true,
      data: template,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch template",
    });
  }
};

export const createTemplate = async (req, res) => {
  try {
    const templateData = req.body;
    const newTemplate = await templateService.createTemplate(templateData);

    res.status(201).json({
      success: true,
      data: newTemplate,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create template",
    });
  }
};