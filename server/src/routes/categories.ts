import { Router } from 'express';
import { pool } from '../db.js';

export const categoriesRouter = Router();

categoriesRouter.get('/', async (_req, res) => {
  const { rows } = await pool.query('SELECT id, name, color FROM categories ORDER BY name');
  res.json(rows);
});

categoriesRouter.post('/', async (req, res) => {
  const { id, name, color } = req.body as { id: string; name: string; color: string };
  const { rows } = await pool.query(
    'INSERT INTO categories (id, name, color) VALUES ($1, $2, $3) RETURNING id, name, color',
    [id, name, color],
  );
  res.status(201).json(rows[0]);
});

categoriesRouter.put('/:id', async (req, res) => {
  const { name, color } = req.body as { name: string; color: string };
  const { rows } = await pool.query(
    'UPDATE categories SET name=$1, color=$2 WHERE id=$3 RETURNING id, name, color',
    [name, color, req.params.id],
  );
  if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

categoriesRouter.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM categories WHERE id=$1', [req.params.id]);
  res.status(204).end();
});
