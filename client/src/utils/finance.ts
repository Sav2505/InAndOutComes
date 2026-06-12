import dayjs from 'dayjs';
import type { AssetPosition, Category, Liability, LiquidityTier, Transaction } from '../types';

const liquidityTierDefaultDays: Record<LiquidityTier, number> = {
  immediate: 0,
  days_7: 7,
  days_30: 30,
  months_6: 180,
  over_6_months: 365,
};

export interface FutureForecastPoint {
  monthKey: string;
  label: string;
  income: number;
  expenses: number;
  liabilityPayments: number;
  assetContributions: number;
  assetGrowth: number;
  netCashflow: number;
  balance: number;
  remainingLiabilities: number;
  netBalance: number;
}

export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    maximumFractionDigits: 0,
  }).format(amount);

export const getMonthKey = (date: string): string => dayjs(date).format('YYYY-MM');

export const transactionAppliesToMonth = (transaction: Transaction, targetMonth: dayjs.Dayjs): boolean => {
  const sourceMonth = dayjs(transaction.date).startOf('month');

  if (sourceMonth.isAfter(targetMonth)) {
    return false;
  }

  if (!transaction.isRecurring || transaction.recurringType === 'none') {
    return sourceMonth.isSame(targetMonth, 'month');
  }

  if (transaction.recurringType === 'monthly') {
    return true;
  }

  return sourceMonth.month() === targetMonth.month();
};

export const getMonthlySummary = (transactions: Transaction[], month: string) => {
  const target = dayjs(month);
  const monthlyTransactions = transactions.filter((t) => transactionAppliesToMonth(t, target));

  const totalIncome = monthlyTransactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const totalExpenses = monthlyTransactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  return {
    totalIncome,
    totalExpenses,
    remainingBalance: totalIncome - totalExpenses,
  };
};

export const getExpensesByCategory = (
  transactions: Transaction[],
  categories: Category[],
  month: string,
) => {
  const map = new Map<string, number>();

  const target = dayjs(month);
  transactions
    .filter((transaction) => transaction.type === 'expense' && transactionAppliesToMonth(transaction, target))
    .forEach((transaction) => {
      map.set(transaction.category, (map.get(transaction.category) ?? 0) + transaction.amount);
    });

  return categories
    .map((category) => ({
      name: category.name,
      value: map.get(category.id) ?? 0,
      color: category.color,
    }))
    .filter((item) => item.value > 0);
};

export const getMonthlyTrend = (transactions: Transaction[], monthsBack = 6) => {
  const now = dayjs();

  return Array.from({ length: monthsBack }, (_, index) => {
    const month = now.subtract(monthsBack - index - 1, 'month');
    const monthKey = month.format('YYYY-MM');
    const monthLabel = month.format('MMM YY');

    const income = transactions
      .filter((transaction) => transaction.type === 'income' && getMonthKey(transaction.date) === monthKey)
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const expenses = transactions
      .filter((transaction) => transaction.type === 'expense' && getMonthKey(transaction.date) === monthKey)
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    return {
      month: monthLabel,
      income,
      expenses,
      balance: income - expenses,
    };
  });
};

export const getAssetTotals = (assets: AssetPosition[]) =>
  assets.reduce((sum, asset) => sum + asset.currentBalance, 0);

export const getLiabilityTotals = (liabilities: Liability[]) =>
  liabilities.reduce((sum, liability) => sum + liability.remainingAmount, 0);

export const getNetWorth = (assets: AssetPosition[], liabilities: Liability[]) =>
  getAssetTotals(assets) - getLiabilityTotals(liabilities);

export const getAssetDistributionByKind = (assets: AssetPosition[]) => {
  const grouped = new Map<string, number>();

  assets.forEach((asset) => {
    grouped.set(asset.kind, (grouped.get(asset.kind) ?? 0) + asset.currentBalance);
  });

  return [...grouped.entries()].map(([kind, value]) => ({ kind, value }));
};

export const getLiabilityDistributionByKind = (liabilities: Liability[]) => {
  const grouped = new Map<string, number>();

  liabilities.forEach((liability) => {
    grouped.set(liability.kind, (grouped.get(liability.kind) ?? 0) + liability.remainingAmount);
  });

  return [...grouped.entries()].map(([kind, value]) => ({ kind, value }));
};

export const getAssetLiquidityDays = (asset: AssetPosition): number => {
  if (typeof asset.liquidityDays === 'number' && asset.liquidityDays >= 0) {
    return asset.liquidityDays;
  }

  return liquidityTierDefaultDays[asset.liquidityTier] ?? 30;
};

export const getLiquidAmountWithinDays = (assets: AssetPosition[], maxDays: number): number =>
  assets
    .filter((asset) => getAssetLiquidityDays(asset) <= maxDays)
    .reduce((sum, asset) => sum + asset.currentBalance, 0);

export const getAssetLiquidityDistribution = (assets: AssetPosition[]) => {
  const grouped = new Map<LiquidityTier, number>();

  assets.forEach((asset) => {
    const tier = asset.liquidityTier ?? 'days_30';
    grouped.set(tier, (grouped.get(tier) ?? 0) + asset.currentBalance);
  });

  return [...grouped.entries()].map(([tier, value]) => ({ tier, value }));
};

const getMonthlyRateFromAnnual = (annualReturnRate?: number): number => {
  const annual = (annualReturnRate ?? 0) / 100;

  if (annual <= -1) {
    return -1;
  }

  return Math.pow(1 + annual, 1 / 12) - 1;
};

export const getFutureBalanceForecast = (
  transactions: Transaction[],
  assets: AssetPosition[],
  liabilities: Liability[],
  monthsAhead = 240,
): FutureForecastPoint[] => {
  const safeMonthsAhead = Math.min(Math.max(monthsAhead, 1), 240);
  const startMonth = dayjs().startOf('month');
  const liabilityState = liabilities.map((liability) => ({
    ...liability,
    remainingAmount: Math.max(liability.remainingAmount, 0),
  }));
  const assetState = assets.map((asset) => ({
    ...asset,
    balance: Math.max(asset.currentBalance, 0),
    monthlyContribution: Math.max(asset.monthlyContribution ?? 0, 0),
    monthlyRate: getMonthlyRateFromAnnual(asset.annualReturnRate),
  }));

  let cumulativeCashflow = 0;

  return Array.from({ length: safeMonthsAhead }, (_, index) => {
    const month = startMonth.add(index, 'month');

    const income = transactions
      .filter((transaction) => transaction.type === 'income' && transactionAppliesToMonth(transaction, month))
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const expenses = transactions
      .filter((transaction) => transaction.type === 'expense' && transactionAppliesToMonth(transaction, month))
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const liabilityPayments = liabilityState.reduce((sum, liability) => {
      const hasPayment = typeof liability.monthlyPayment === 'number' && liability.monthlyPayment > 0;
      const endDate = liability.endDate ? dayjs(liability.endDate).endOf('month') : null;

      if (!hasPayment || liability.remainingAmount <= 0) {
        return sum;
      }

      if (endDate && month.isAfter(endDate)) {
        return sum;
      }

      const payment = Math.min(liability.monthlyPayment ?? 0, liability.remainingAmount);
      liability.remainingAmount -= payment;

      return sum + payment;
    }, 0);

    const { assetContributions, assetGrowth } = assetState.reduce(
      (sum, asset) => {
        const preGrowthBalance = asset.balance + asset.monthlyContribution;
        const growth = preGrowthBalance * asset.monthlyRate;

        asset.balance = Math.max(preGrowthBalance + growth, 0);

        return {
          assetContributions: sum.assetContributions + asset.monthlyContribution,
          assetGrowth: sum.assetGrowth + growth,
        };
      },
      { assetContributions: 0, assetGrowth: 0 },
    );

    const netCashflow = income - expenses - liabilityPayments - assetContributions;
    cumulativeCashflow += netCashflow;

    const totalAssetBalance = assetState.reduce((sum, asset) => sum + asset.balance, 0);

    const remainingLiabilities = liabilityState.reduce(
      (sum, liability) => sum + liability.remainingAmount,
      0,
    );

    const balance = totalAssetBalance + cumulativeCashflow;

    return {
      monthKey: month.format('YYYY-MM'),
      label: month.format('MM/YY'),
      income,
      expenses,
      liabilityPayments,
      assetContributions,
      assetGrowth,
      netCashflow,
      balance,
      remainingLiabilities,
      netBalance: balance - remainingLiabilities,
    };
  });
};
