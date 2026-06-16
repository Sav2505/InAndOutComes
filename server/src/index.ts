import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { pool } from './db.js';
import { authRouter } from './routes/auth.js';
import { assetsRouter } from './routes/assets.js';
import { categoriesRouter } from './routes/categories.js';
import { liabilitiesRouter } from './routes/liabilities.js';
import { transactionsRouter } from './routes/transactions.js';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);
app.use('/categories', categoriesRouter);
app.use('/transactions', transactionsRouter);
app.use('/assets', assetsRouter);
app.use('/liabilities', liabilitiesRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Keep-alive: prevent Render free tier from spinning down
setInterval(async () => {
  try {
    await pool.query('SELECT 1');
    console.log('[keep-alive] ping ok');
  } catch (err) {
    console.error('[keep-alive] ping failed:', err);
  }
}, 10 * 60 * 1000);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
