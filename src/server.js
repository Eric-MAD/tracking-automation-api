import app from './app.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

app.listen(env.PORT, () => {
  logger.info(`🚀 Serveur démarré sur http://localhost:${env.PORT}`);
  logger.info(`📦 Environnement : ${env.NODE_ENV}`);
});