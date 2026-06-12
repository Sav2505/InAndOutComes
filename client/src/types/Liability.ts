export type LiabilityKind = 'loan' | 'mortgage' | 'credit' | 'other';

export interface Liability {
  id: string;
  name: string;
  lender: string;
  kind: LiabilityKind;
  originalAmount: number;
  remainingAmount: number;
  monthlyPayment?: number;
  interestRate?: number;
  endDate?: string;
  notes?: string;
}
