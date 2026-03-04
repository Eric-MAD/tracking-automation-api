import { logger } from '../utils/logger.js';
import { sendError } from '../utils/response.js';
import { AppError } from '../utils/error.js';

export const errorMiddleware = (err, req, res, next) => {
  logger.error(`${err.name}: ${err.message}`);

  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode);
  }

  return sendError(res, 'Erreur interne du serveur', 500);
};