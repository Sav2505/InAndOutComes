import 'dotenv/config';
import { pool } from './db.js';

// ─── DDL ───────────────────────────────────────────────────────────────────

const createTables = `
  CREATE TABLE IF NOT EXISTS categories (
    id    TEXT PRIMARY KEY,
    name  TEXT NOT NULL,
    color TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id             TEXT PRIMARY KEY,
    title          TEXT NOT NULL,
    amount         NUMERIC(14,2) NOT NULL,
    type           TEXT NOT NULL CHECK (type IN ('income','expense')),
    category       TEXT NOT NULL,
    date           DATE NOT NULL,
    is_recurring   BOOLEAN NOT NULL DEFAULT FALSE,
    recurring_type TEXT NOT NULL CHECK (recurring_type IN ('monthly','yearly','none')),
    notes          TEXT
  );

  CREATE TABLE IF NOT EXISTS assets (
    id                   TEXT PRIMARY KEY,
    name                 TEXT NOT NULL,
    institution          TEXT NOT NULL,
    kind                 TEXT NOT NULL CHECK (kind IN ('checking','savings','investment','pension','cash','other')),
    current_balance      NUMERIC(14,2) NOT NULL,
    monthly_contribution NUMERIC(14,2),
    annual_return_rate   NUMERIC(5,2),
    liquidity_tier       TEXT NOT NULL CHECK (liquidity_tier IN ('immediate','days_7','days_30','months_6','over_6_months')),
    liquidity_days       INTEGER,
    last_updated         DATE NOT NULL,
    notes                TEXT
  );

  CREATE TABLE IF NOT EXISTS liabilities (
    id               TEXT PRIMARY KEY,
    name             TEXT NOT NULL,
    lender           TEXT NOT NULL,
    kind             TEXT NOT NULL CHECK (kind IN ('loan','mortgage','credit','other')),
    original_amount  NUMERIC(14,2) NOT NULL,
    remaining_amount NUMERIC(14,2) NOT NULL,
    monthly_payment  NUMERIC(14,2),
    interest_rate    NUMERIC(5,2),
    end_date         DATE,
    notes            TEXT
  );
`;

// ─── Seed data (from db.json) ──────────────────────────────────────────────

const categories = [
  { id: 'housing',        name: 'דיור',     color: '#1F7A8C' },
  { id: 'food',           name: 'מזון',     color: '#3BA99C' },
  { id: 'transportation', name: 'תחבורה',   color: '#4E79A7' },
  { id: 'subscriptions',  name: 'מנויים',   color: '#76B7B2' },
  { id: 'entertainment',  name: 'בילוי',    color: '#59A14F' },
  { id: 'health',         name: 'בריאות',   color: '#EDC948' },
  { id: 'shopping',       name: 'קניות',    color: '#F28E2B' },
  { id: 'other',          name: 'אחר',      color: '#9C755F' },
];

const transactions = [
  { id: 'inc-001',                                title: 'משכורת ראשית',    amount: 24000, type: 'income',  category: 'משכורת',         date: '2026-03-01', isRecurring: true,  recurringType: 'monthly', notes: 'הכנסה חודשית' },
  { id: 'inc-003',                                title: 'דיבידנד',         amount: 240,   type: 'income',  category: 'השקעות',         date: '2026-02-18', isRecurring: true,  recurringType: 'yearly',  notes: 'תשלום רבעוני' },
  { id: 'exp-001',                                title: 'שכר דירה',        amount: 6000,  type: 'expense', category: 'housing',         date: '2026-03-01', isRecurring: true,  recurringType: 'monthly', notes: 'תשלום חודשי לדירה' },
  { id: 'exp-005',                                title: 'בדיקת שיניים',    amount: 180,   type: 'expense', category: 'health',          date: '2026-02-25', isRecurring: false, recurringType: 'none',    notes: 'בדיקה תקופתית' },
  { id: 'c6694a5e-5406-4f57-aa08-1b3831d1a550',  title: 'ארנונה',          amount: 732,   type: 'expense', category: 'housing',         date: '2026-03-02', isRecurring: true,  recurringType: 'monthly', notes: 'תשלום ארנונה כל חודשיים' },
  { id: '984d0c0c-ca8d-4d37-ba60-7eee1066cbad',  title: 'דלק',             amount: 1000,  type: 'expense', category: 'transportation',  date: '2026-03-01', isRecurring: true,  recurringType: 'monthly', notes: 'הוצאות דלק' },
  { id: 'd65eedc7-5bea-4aa1-b79d-0256cb00ce9c',  title: 'FreeTv',           amount: 40,    type: 'expense', category: 'subscriptions',   date: '2026-03-10', isRecurring: true,  recurringType: 'monthly', notes: 'מנוי לFreeTv' },
  { id: 'd0a3ccd4-3182-40c7-b0db-8dfb22c6f95e',  title: 'חשבון חשמל',      amount: 400,   type: 'expense', category: 'housing',         date: '2026-03-01', isRecurring: true,  recurringType: 'monthly', notes: null },
  { id: 'caed1f74-6326-45b9-8956-0093bd14664b',  title: 'חשבון מים',       amount: 200,   type: 'expense', category: 'housing',         date: '2026-03-01', isRecurring: true,  recurringType: 'monthly', notes: null },
  { id: '739b672b-2088-40f7-8ccb-167bcf44ac7b',  title: 'חשבון גז',        amount: 60,    type: 'expense', category: 'housing',         date: '2026-03-01', isRecurring: true,  recurringType: 'monthly', notes: null },
  { id: 'a57a609f-4c10-450a-a806-25bd5d0be4d5',  title: 'אינטרנט Hot',     amount: 95,    type: 'expense', category: 'subscriptions',   date: '2026-03-01', isRecurring: true,  recurringType: 'monthly', notes: null },
  { id: '11305574-c304-4bc6-bd79-1241623cee6c',  title: 'ועד בית',         amount: 305,   type: 'expense', category: 'housing',         date: '2026-03-02', isRecurring: true,  recurringType: 'monthly', notes: null },
  { id: 'e2763777-46a3-45f7-bc3b-2c32df420829',  title: 'הלוואת רכב',      amount: 1132,  type: 'expense', category: 'other',           date: '2026-03-10', isRecurring: true,  recurringType: 'monthly', notes: null },
  { id: 'c5a4542b-7ae8-4c84-b887-bd1a5b814bd8',  title: 'קניות סופר',      amount: 1800,  type: 'expense', category: 'food',            date: '2026-03-10', isRecurring: true,  recurringType: 'monthly', notes: null },
  { id: '7f1d9cc4-3a26-472e-966e-cd3889384da3',  title: 'Apple Music',      amount: 34,    type: 'expense', category: 'subscriptions',   date: '2026-03-10', isRecurring: true,  recurringType: 'monthly', notes: null },
  { id: '8e69b62a-bc25-41ed-a170-1a5484951f69',  title: 'ICloud',           amount: 12,    type: 'expense', category: 'subscriptions',   date: '2026-03-10', isRecurring: true,  recurringType: 'monthly', notes: null },
  { id: 'e005b197-7c9f-451b-b795-839e0331286f',  title: 'בילויים',         amount: 1000,  type: 'expense', category: 'entertainment',   date: '2026-03-31', isRecurring: true,  recurringType: 'monthly', notes: null },
  { id: '2f6207e5-11f3-47b7-90d4-b8fba3766394',  title: 'שולחן עבודה',     amount: 650,   type: 'expense', category: 'shopping',        date: '2026-03-05', isRecurring: false, recurringType: 'none',    notes: 'קניית שולחן עבודה לבית' },
];

const assets = [
  { id: '30890578-3cae-4b00-8281-9ea445a3ea87', name: "עו''ש",                   institution: 'בנק לאומי',         kind: 'checking',   currentBalance: 22000,  monthlyContribution: 0,    annualReturnRate: 0,   liquidityTier: 'immediate',     liquidityDays: 0,   lastUpdated: '2026-03-15', notes: null },
  { id: '70281b7a-42de-4079-b574-3b4b2bc42488', name: 'קרן השתלמות',            institution: "מיטב ד''ש",         kind: 'pension',    currentBalance: 200000, monthlyContribution: 2650, annualReturnRate: 4.2, liquidityTier: 'months_6',      liquidityDays: 180, lastUpdated: '2026-03-15', notes: null },
  { id: '682f40a9-7841-44c3-b690-515becfad3e6', name: 'קופת גמל להשקעה',        institution: 'הראל',              kind: 'pension',    currentBalance: 65000,  monthlyContribution: 1500, annualReturnRate: 6.5, liquidityTier: 'days_30',       liquidityDays: 30,  lastUpdated: '2026-03-15', notes: null },
  { id: '073d0d17-8fa5-4575-92c4-55841e23eaca', name: 'השקעה ששי',              institution: 'ששי יזמות',         kind: 'investment', currentBalance: 500000, monthlyContribution: 0,    annualReturnRate: 0,   liquidityTier: 'over_6_months', liquidityDays: 365, lastUpdated: '2026-03-15', notes: null },
  { id: '1a239f07-1188-4a49-8e3e-a4c6acf02ec9', name: "השקעה ששי אצל אבא",     institution: 'אבא',               kind: 'investment', currentBalance: 50000,  monthlyContribution: 0,    annualReturnRate: 0,   liquidityTier: 'months_6',      liquidityDays: 180, lastUpdated: '2026-03-15', notes: null },
  { id: 'bfdac73a-c6c6-487e-96b3-5462aa15f13f', name: 'קופת גמל להשקעה',        institution: 'אלטשולר - S&P',     kind: 'pension',    currentBalance: 111000, monthlyContribution: null, annualReturnRate: null,liquidityTier: 'days_7',        liquidityDays: 7,   lastUpdated: '2026-03-15', notes: null },
  { id: '954ada1a-deca-40d6-9530-933897334463', name: 'קופה בבנק אוצר החייל',   institution: 'אוצר החייל',        kind: 'savings',    currentBalance: 16000,  monthlyContribution: null, annualReturnRate: null,liquidityTier: 'days_7',        liquidityDays: 7,   lastUpdated: '2026-03-15', notes: null },
  { id: '14268e9a-05c2-450f-a954-6b93e4f016f0', name: "עו''ש - שחר",            institution: 'בנק אוצר החייל',   kind: 'checking',   currentBalance: 4000,   monthlyContribution: null, annualReturnRate: null,liquidityTier: 'immediate',     liquidityDays: 0,   lastUpdated: '2026-03-15', notes: null },
];

// ─── Runner ────────────────────────────────────────────────────────────────

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    console.log('Creating tables...');
    await client.query(createTables);

    console.log('Seeding categories...');
    for (const c of categories) {
      await client.query(
        'INSERT INTO categories (id, name, color) VALUES ($1,$2,$3) ON CONFLICT (id) DO NOTHING',
        [c.id, c.name, c.color],
      );
    }

    console.log('Seeding transactions...');
    for (const t of transactions) {
      await client.query(
        `INSERT INTO transactions (id, title, amount, type, category, date, is_recurring, recurring_type, notes)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT (id) DO NOTHING`,
        [t.id, t.title, t.amount, t.type, t.category, t.date, t.isRecurring, t.recurringType, t.notes],
      );
    }

    console.log('Seeding assets...');
    for (const a of assets) {
      await client.query(
        `INSERT INTO assets (id, name, institution, kind, current_balance, monthly_contribution,
          annual_return_rate, liquidity_tier, liquidity_days, last_updated, notes)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) ON CONFLICT (id) DO NOTHING`,
        [a.id, a.name, a.institution, a.kind, a.currentBalance, a.monthlyContribution,
          a.annualReturnRate, a.liquidityTier, a.liquidityDays, a.lastUpdated, a.notes],
      );
    }

    await client.query('COMMIT');
    console.log('✓ Seed complete');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
