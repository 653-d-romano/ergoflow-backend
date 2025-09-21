import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import authRouter from './src/routes/auth.js';
import clientsRouter from './src/routes/clients.js';
import projectsRouter from './src/routes/projects.js';
import checklistsRouter from './src/routes/checklists.js';
import evidencesRouter from './src/routes/evidences.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = process.env.STORAGE_LOCAL_PATH || './uploads';
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(path.resolve(__dirname, uploadsDir)));

app.get('/', (_, res) => res.json({ ok: true, service: 'ErgoFlow API' }));

app.use('/api/auth', authRouter);
app.use('/api/clients', clientsRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/checklists', checklistsRouter);
app.use('/api/evidences', evidencesRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`ErgoFlow API corriendo en puerto ${port}`));