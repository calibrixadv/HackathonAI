import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);   // login/register
app.use('/api', chatRoutes);        // chat endpoint (JWT protected)

export default app;
