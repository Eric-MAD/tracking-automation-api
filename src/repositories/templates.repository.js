import prisma from "../config/database.js";

export const getAllTemplates = async () => {
  return prisma.templates.findMany({
    orderBy: {
      created_at: "desc",
    },
  });
};