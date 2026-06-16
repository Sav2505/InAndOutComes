import { Router } from 'express';
import { pool } from '../db.js';

export const transactionsRouter = Router();

interface TransactionRow {
  id: string;
  title: string;
  amount: string;
  type: string;
  category: string;
  date: Date;
  is_recurring: boolean;
  recurring_type: string;
  notes: string | null;
}

const toClient = (row: TransactionRow) => ({
  id: row.id,
  title: row.title,
  amount: parseFloat(row.amount),
  type: row.type,
  category: row.category,
  date: row.date.toISOString().slice(0, 10),
  isRecurring: row.is_recurring,
  recurringType: row.recurring_type,
  ...(row.notes != null ? { notes: row.notes } : {}),
});

transactionsRouter.get('/', async (_req, res) => {
  const { rows } = await pool.query<TransactionRow>(
    'SELECT * FROM transactions ORDER BY date DESC',
  );
  res.json(rows.map(toClient));
});

transactionsRouter.post('/', async (req, res) => {
  const { id, title, amount, type, category, date, isRecurring, recurringType, notes } =
    req.body as {
      id: string;
      title: string;
      amount: number;
      type: string;
      category: string;
      date: string;
      isRecurring: boolean;
      recurringType: string;
      notes?: string;
    };

  const { rows } = await pool.query<TransactionRow>(
    `INSERT INTO transactions (id, title, amount, type, category, date, is_recurring, recurring_type, notes)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     RETURNING *`,
    [id, title, amount, type, category, date, isRecurring, recurringType, notes ?? null],
  );
  res.status(201).json(toClient(rows[0]));
});

transactionsRouter.put('/:id', async (req, res) => {
  const { title, amount, type, category, date, isRecurring, recurringType, notes } =
    req.body as {
      title: string;
      amount: number;
      type: string;
      category: string;
      date: string;
      isRecurring: boolean;
      recurringType: string;
      notes?: string;
    };

  const { rows } = await pool.query<TransactionRow>(
    `UPDATE transactions
     SET title=$1, amount=$2, type=$3, category=$4, date=$5,
         is_recurring=$6, recurring_type=$7, notes=$8
     WHERE id=$9
     RETURNING *`,
    [title, amount, type, category, date, isRecurring, recurringType, notes ?? null, req.params.id],
  );
  if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
  res.json(toClient(rows[0]));
});

transactionsRouter.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM transactions WHERE id=$1', [req.params.id]);
  res.status(204).end();
});
