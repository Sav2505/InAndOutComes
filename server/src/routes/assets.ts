import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { pool } from '../db.js';

export const assetsRouter = Router();
assetsRouter.use(requireAuth);

interface AssetRow {
  id: string;
  name: string;
  institution: string;
  kind: string;
  current_balance: string;
  monthly_contribution: string | null;
  annual_return_rate: string | null;
  liquidity_tier: string;
  liquidity_days: number | null;
  last_updated: Date;
  notes: string | null;
}

const toClient = (row: AssetRow) => ({
  id: row.id,
  name: row.name,
  institution: row.institution,
  kind: row.kind,
  currentBalance: parseFloat(row.current_balance),
  ...(row.monthly_contribution != null ? { monthlyContribution: parseFloat(row.monthly_contribution) } : {}),
  ...(row.annual_return_rate != null ? { annualReturnRate: parseFloat(row.annual_return_rate) } : {}),
  liquidityTier: row.liquidity_tier,
  ...(row.liquidity_days != null ? { liquidityDays: row.liquidity_days } : {}),
  lastUpdated: row.last_updated.toISOString().slice(0, 10),
  ...(row.notes != null ? { notes: row.notes } : {}),
});

assetsRouter.get('/', async (req, res) => {
  const { rows } = await pool.query<AssetRow>('SELECT * FROM assets WHERE user_id = $1 ORDER BY current_balance DESC', [req.user.id]);
  res.json(rows.map(toClient));
});

assetsRouter.post('/', async (req, res) => {
  const { id, name, institution, kind, currentBalance, monthlyContribution, annualReturnRate,
    liquidityTier, liquidityDays, lastUpdated, notes } = req.body as {
      id: string; name: string; institution: string; kind: string;
      currentBalance: number; monthlyContribution?: number; annualReturnRate?: number;
      liquidityTier: string; liquidityDays?: number; lastUpdated: string; notes?: string;
    };

  const { rows } = await pool.query<AssetRow>(
    `INSERT INTO assets (id, user_id, name, institution, kind, current_balance, monthly_contribution,
      annual_return_rate, liquidity_tier, liquidity_days, last_updated, notes)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
    [id, req.user.id, name, institution, kind, currentBalance, monthlyContribution ?? null,
      annualReturnRate ?? null, liquidityTier, liquidityDays ?? null, lastUpdated, notes ?? null],
  );
  res.status(201).json(toClient(rows[0]));
});

assetsRouter.put('/:id', async (req, res) => {
  const { name, institution, kind, currentBalance, monthlyContribution, annualReturnRate,
    liquidityTier, liquidityDays, lastUpdated, notes } = req.body as {
      name: string; institution: string; kind: string; currentBalance: number;
      monthlyContribution?: number; annualReturnRate?: number; liquidityTier: string;
      liquidityDays?: number; lastUpdated: string; notes?: string;
    };

  const { rows } = await pool.query<AssetRow>(
    `UPDATE assets SET name=$1, institution=$2, kind=$3, current_balance=$4,
      monthly_contribution=$5, annual_return_rate=$6, liquidity_tier=$7,
      liquidity_days=$8, last_updated=$9, notes=$10
     WHERE id=$11 AND user_id=$12 RETURNING *`,
    [name, institution, kind, currentBalance, monthlyContribution ?? null,
      annualReturnRate ?? null, liquidityTier, liquidityDays ?? null, lastUpdated,
      notes ?? null, req.params.id, req.user.id],
  );
  if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
  res.json(toClient(rows[0]));
});

assetsRouter.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM assets WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
  res.status(204).end();
});
