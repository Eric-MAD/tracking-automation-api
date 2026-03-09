import prisma from "../config/database.js";

export const getAllTemplates = async () => {
  return prisma.templates.findMany({
    orderBy: {
      created_at: "desc",
    },
  });
};

export const getTemplateById = async (id) => {
  return prisma.templates.findUnique({
    where: { id },
  });
}

export const createTemplate = async (templateData) => {
  return prisma.templates.create({
    data: templateData,
  });
};