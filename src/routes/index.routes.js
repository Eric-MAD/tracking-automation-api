import { Router } from 'express';
import { sendSuccess } from '../utils/response.js';
import templateRoutes from './templates.routes.js';
import googleAuthRoutes from './googleAuth.routes.js';
import googleRoutes from './google.routes.js';

const router = Router();

router.get('/health', (req, res) => {
  sendSuccess(res, { status: 'ok', env: process.env.NODE_ENV }, '🟢 Serveur opérationnel');
});
router.use('/templates', templateRoutes);
router.use('/auth', googleAuthRoutes);
router.use('/google', googleRoutes);
export default router;