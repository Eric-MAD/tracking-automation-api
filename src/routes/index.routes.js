import { Router } from 'express';
import { sendSuccess } from '../utils/response.js';

const router = Router();

router.get('/health', (req, res) => {
  sendSuccess(res, { status: 'ok', env: process.env.NODE_ENV }, '🟢 Serveur opérationnel');
});

export default router;