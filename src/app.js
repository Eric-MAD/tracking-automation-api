import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import indexRouter from './routes/index.routes.js';
import { errorMiddleware } from './middlwares/error.middleware.js';

const app = express();

// Middlewares globaux
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api', indexRouter);

// Middleware erreurs
app.use(errorMiddleware);

export default app;