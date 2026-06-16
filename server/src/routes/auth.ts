import crypto from 'crypto';
import { Router } from 'express';
import { pool } from '../db.js';
import { sessions } from '../sessions.js';

export const authRouter = Router();

authRouter.post('/login', async (req, res) => {
  const { username, password } = req.body as {
    username: string;
    password: string;
  };

  if (!username || !password) {
    res.status(400).json({ error: 'Missing credentials' });
    return;
  }

  const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

  const { rows } = await pool.query<{ id: string; name: string; password_hash: string }>(
    'SELECT id, name, password_hash FROM users WHERE username = $1',
    [username],
  );

  if (rows.length === 0 || rows[0].password_hash !== passwordHash) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const token = crypto.randomUUID();
  sessions.set(token, { id: rows[0].id, name: rows[0].name });

  res.json({ token, userId: rows[0].id, name: rows[0].name });
});

authRouter.post('/logout', (req, res) => {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    sessions.delete(header.slice(7));
  }
  res.status(204).end();
});
