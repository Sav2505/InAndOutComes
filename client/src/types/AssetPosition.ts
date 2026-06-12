export type AssetKind = 'checking' | 'savings' | 'investment' | 'pension' | 'cash' | 'other';

export type LiquidityTier =
  | 'immediate'
  | 'days_7'
  | 'days_30'
  | 'months_6'
  | 'over_6_months';

export interface AssetPosition {
  id: string;
  name: string;
  institution: string;
  kind: AssetKind;
  currentBalance: number;
  monthlyContribution?: number;
  annualReturnRate?: number;
  liquidityTier: LiquidityTier;
  liquidityDays?: number;
  lastUpdated: string;
  notes?: string;
}
