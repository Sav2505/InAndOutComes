import { Router } from 'express';
import { pool } from '../db.js';

export const liabilitiesRouter = Router();

interface LiabilityRow {
  id: string;
  name: string;
  lender: string;
  kind: string;
  original_amount: string;
  remaining_amount: string;
  monthly_payment: string | null;
  interest_rate: string | null;
  end_date: Date | null;
  notes: string | null;
}

const toClient = (row: LiabilityRow) => ({
  id: row.id,
  name: row.name,
  lender: row.lender,
  kind: row.kind,
  originalAmount: parseFloat(row.original_amount),
  remainingAmount: parseFloat(row.remaining_amount),
  ...(row.monthly_payment != null ? { monthlyPayment: parseFloat(row.monthly_payment) } : {}),
  ...(row.interest_rate != null ? { interestRate: parseFloat(row.interest_rate) } : {}),
  ...(row.end_date != null ? { endDate: row.end_date.toISOString().slice(0, 10) } : {}),
  ...(row.notes != null ? { notes: row.notes } : {}),
});

liabilitiesRouter.get('/', async (_req, res) => {
  const { rows } = await pool.query<LiabilityRow>(
    'SELECT * FROM liabilities ORDER BY remaining_amount DESC',
  );
  res.json(rows.map(toClient));
});

liabilitiesRouter.post('/', async (req, res) => {
  const { id, name, lender, kind, originalAmount, remainingAmount,
    monthlyPayment, interestRate, endDate, notes } = req.body as {
      id: string; name: string; lender: string; kind: string;
      originalAmount: number; remainingAmount: number; monthlyPayment?: number;
      interestRate?: number; endDate?: string; notes?: string;
    };

  const { rows } = await pool.query<LiabilityRow>(
    `INSERT INTO liabilities (id, name, lender, kind, original_amount, remaining_amount,
      monthly_payment, interest_rate, end_date, notes)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
    [id, name, lender, kind, originalAmount, remainingAmount,
      monthlyPayment ?? null, interestRate ?? null, endDate ?? null, notes ?? null],
  );
  res.status(201).json(toClient(rows[0]));
});

liabilitiesRouter.put('/:id', async (req, res) => {
  const { name, lender, kind, originalAmount, remainingAmount,
    monthlyPayment, interestRate, endDate, notes } = req.body as {
      name: string; lender: string; kind: string; originalAmount: number;
      remainingAmount: number; monthlyPayment?: number; interestRate?: number;
      endDate?: string; notes?: string;
    };

  const { rows } = await pool.query<LiabilityRow>(
    `UPDATE liabilities SET name=$1, lender=$2, kind=$3, original_amount=$4,
      remaining_amount=$5, monthly_payment=$6, interest_rate=$7, end_date=$8, notes=$9
     WHERE id=$10 RETURNING *`,
    [name, lender, kind, originalAmount, remainingAmount,
      monthlyPayment ?? null, interestRate ?? null, endDate ?? null,
      notes ?? null, req.params.id],
  );
  if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
  res.json(toClient(rows[0]));
});

liabilitiesRouter.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM liabilities WHERE id=$1', [req.params.id]);
  res.status(204).end();
});
