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