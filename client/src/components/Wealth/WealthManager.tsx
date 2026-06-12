import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import {
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { AssetLiquidityChart } from '../Charts/AssetLiquidityChart';
import { WealthDistributionChart } from '../Charts/WealthDistributionChart';
import { useFinanceStore } from '../../store/financeStore';
import type {
  AssetKind,
  AssetPosition,
  Liability,
  LiabilityKind,
  LiquidityTier,
} from '../../types';
import {
  formatCurrency,
  getAssetDistributionByKind,
  getAssetLiquidityDays,
  getAssetLiquidityDistribution,
  getAssetTotals,
  getLiabilityDistributionByKind,
  getLiabilityTotals,
  getLiquidAmountWithinDays,
  getNetWorth,
} from '../../utils/finance';

const assetKinds: Array<{ value: AssetKind; label: string; color: string }> = [
  { value: 'checking', label: "עו''ש", color: '#1F7A8C' },
  { value: 'savings', label: 'חיסכון', color: '#3BA99C' },
  { value: 'investment', label: 'השקעות', color: '#4E79A7' },
  { value: 'pension', label: 'קופת גמל/פנסיה', color: '#59A14F' },
  { value: 'cash', label: 'מזומן', color: '#EDC948' },
  { value: 'other', label: 'אחר', color: '#9C755F' },
];

const liabilityKinds: Array<{ value: LiabilityKind; label: string; color: string }> = [
  { value: 'loan', label: 'הלוואה', color: '#CC444B' },
  { value: 'mortgage', label: 'משכנתא', color: '#F28E2B' },
  { value: 'credit', label: 'אשראי', color: '#B07AA1' },
  { value: 'other', label: 'אחר', color: '#9C755F' },
];

const liquidityOptions: Array<{
  value: LiquidityTier;
  label: string;
  defaultDays: number;
  color: string;
}> = [
  { value: 'immediate', label: 'מיידי', defaultDays: 0, color: '#2E7D32' },
  { value: 'days_7', label: 'עד שבוע', defaultDays: 7, color: '#43A047' },
  { value: 'days_30', label: 'עד 30 יום', defaultDays: 30, color: '#1E88E5' },
  { value: 'months_6', label: 'עד חצי שנה', defaultDays: 180, color: '#FB8C00' },
  { value: 'over_6_months', label: 'מעל חצי שנה', defaultDays: 365, color: '#8E24AA' },
];

const assetKindMap = new Map(assetKinds.map((item) => [item.value, item]));
const liabilityKindMap = new Map(liabilityKinds.map((item) => [item.value, item]));
const liquidityMap = new Map(liquidityOptions.map((item) => [item.value, item]));

interface AssetForm {
  id?: string;
  name: string;
  institution: string;
  kind: AssetKind;
  currentBalance: number;
  monthlyContribution: number;
  annualReturnRate: number;
  liquidityTier: LiquidityTier;
  liquidityDays: number;
  lastUpdated: string;
  notes: string;
}

interface LiabilityForm {
  id?: string;
  name: string;
  lender: string;
  kind: LiabilityKind;
  originalAmount: number;
  remainingAmount: number;
  monthlyPayment: number;
  interestRate: number;
  endDate: string;
  notes: string;
}

const createEmptyAssetForm = (): AssetForm => ({
  name: '',
  institution: '',
  kind: 'checking',
  currentBalance: 0,
  monthlyContribution: 0,
  annualReturnRate: 0,
  liquidityTier: 'days_30',
  liquidityDays: 30,
  lastUpdated: dayjs().format('YYYY-MM-DD'),
  notes: '',
});

const createEmptyLiabilityForm = (): LiabilityForm => ({
  name: '',
  lender: '',
  kind: 'loan',
  originalAmount: 0,
  remainingAmount: 0,
  monthlyPayment: 0,
  interestRate: 0,
  endDate: '',
  notes: '',
});

const mapAssetToForm = (asset: AssetPosition): AssetForm => {
  const tier = asset.liquidityTier ?? 'days_30';
  const liquidityDays = getAssetLiquidityDays(asset);

  return {
    id: asset.id,
    name: asset.name,
    institution: asset.institution,
    kind: asset.kind,
    currentBalance: asset.currentBalance,
    monthlyContribution: asset.monthlyContribution ?? 0,
    annualReturnRate: asset.annualReturnRate ?? 0,
    liquidityTier: tier,
    liquidityDays,
    lastUpdated: asset.lastUpdated,
    notes: asset.notes ?? '',
  };
};

const mapLiabilityToForm = (liability: Liability): LiabilityForm => ({
  id: liability.id,
  name: liability.name,
  lender: liability.lender,
  kind: liability.kind,
  originalAmount: liability.originalAmount,
  remainingAmount: liability.remainingAmount,
  monthlyPayment: liability.monthlyPayment ?? 0,
  interestRate: liability.interestRate ?? 0,
  endDate: liability.endDate ?? '',
  notes: liability.notes ?? '',
});

const getLiquidityText = (days: number): string => {
  if (days <= 0) {
    return 'זמין היום';
  }

  if (days <= 30) {
    return `זמין תוך ${days} ימים`;
  }

  const months = Math.ceil(days / 30);
  return `זמין תוך כ-${months} חודשים`;
};

const formatPercent = (value: number) => `${Number(value.toFixed(2))}%`;

export const WealthManager = () => {
  const {
    assets,
    liabilities,
    addAsset,
    updateAsset,
    deleteAsset,
    addLiability,
    updateLiability,
    deleteLiability,
  } = useFinanceStore();

  const [assetForm, setAssetForm] = useState<AssetForm>(createEmptyAssetForm);
  const [liabilityForm, setLiabilityForm] = useState<LiabilityForm>(createEmptyLiabilityForm);
  const [assetDialogOpen, setAssetDialogOpen] = useState(false);
  const [liabilityDialogOpen, setLiabilityDialogOpen] = useState(false);

  const totalAssets = useMemo(() => getAssetTotals(assets), [assets]);
  const totalLiabilities = useMemo(() => getLiabilityTotals(liabilities), [liabilities]);
  const netWorth = useMemo(() => getNetWorth(assets, liabilities), [assets, liabilities]);

  const liquidNow = useMemo(() => getLiquidAmountWithinDays(assets, 0), [assets]);
  const liquidIn30Days = useMemo(() => getLiquidAmountWithinDays(assets, 30), [assets]);
  const lessLiquid = useMemo(() => totalAssets - liquidIn30Days, [totalAssets, liquidIn30Days]);

  const assetDistributionData = useMemo(
    () =>
      getAssetDistributionByKind(assets).map((item) => ({
        name: assetKindMap.get(item.kind as AssetKind)?.label ?? item.kind,
        value: item.value,
        color: assetKindMap.get(item.kind as AssetKind)?.color ?? '#1F7A8C',
      })),
    [assets],
  );

  const liabilityDistributionData = useMemo(
    () =>
      getLiabilityDistributionByKind(liabilities).map((item) => ({
        name: liabilityKindMap.get(item.kind as LiabilityKind)?.label ?? item.kind,
        value: item.value,
        color: liabilityKindMap.get(item.kind as LiabilityKind)?.color ?? '#CC444B',
      })),
    [liabilities],
  );

  const liquidityDistributionData = useMemo(
    () =>
      getAssetLiquidityDistribution(assets)
        .map((item) => ({
          label: liquidityMap.get(item.tier)?.label ?? item.tier,
          value: item.value,
          color: liquidityMap.get(item.tier)?.color ?? '#1E88E5',
        }))
        .sort((a, b) => b.value - a.value),
    [assets],
  );

  const openNewAssetDialog = () => {
    setAssetForm(createEmptyAssetForm());
    setAssetDialogOpen(true);
  };

  const openEditAssetDialog = (asset: AssetPosition) => {
    setAssetForm(mapAssetToForm(asset));
    setAssetDialogOpen(true);
  };

  const openNewLiabilityDialog = () => {
    setLiabilityForm(createEmptyLiabilityForm());
    setLiabilityDialogOpen(true);
  };

  const openEditLiabilityDialog = (liability: Liability) => {
    setLiabilityForm(mapLiabilityToForm(liability));
    setLiabilityDialogOpen(true);
  };

  const saveAsset = async () => {
    if (
      assetForm.name.trim().length < 2 ||
      assetForm.currentBalance < 0 ||
      assetForm.liquidityDays < 0 ||
      assetForm.monthlyContribution < 0 ||
      assetForm.annualReturnRate < -100
    ) {
      return;
    }

    const payload = {
      name: assetForm.name.trim(),
      institution: assetForm.institution.trim() || 'לא צוין',
      kind: assetForm.kind,
      currentBalance: assetForm.currentBalance,
      monthlyContribution: assetForm.monthlyContribution > 0 ? assetForm.monthlyContribution : undefined,
      annualReturnRate: assetForm.annualReturnRate !== 0 ? assetForm.annualReturnRate : undefined,
      liquidityTier: assetForm.liquidityTier,
      liquidityDays: assetForm.liquidityDays,
      lastUpdated: assetForm.lastUpdated,
      notes: assetForm.notes.trim() || undefined,
    };

    if (assetForm.id) {
      await updateAsset(assetForm.id, payload);
    } else {
      await addAsset(payload);
    }

    setAssetDialogOpen(false);
  };

  const saveLiability = async () => {
    if (liabilityForm.name.trim().length < 2 || liabilityForm.remainingAmount < 0) {
      return;
    }

    const payload = {
      name: liabilityForm.name.trim(),
      lender: liabilityForm.lender.trim() || 'לא צוין',
      kind: liabilityForm.kind,
      originalAmount: Math.max(liabilityForm.originalAmount, liabilityForm.remainingAmount),
      remainingAmount: liabilityForm.remainingAmount,
      monthlyPayment: liabilityForm.monthlyPayment > 0 ? liabilityForm.monthlyPayment : undefined,
      interestRate: liabilityForm.interestRate > 0 ? liabilityForm.interestRate : undefined,
      endDate: liabilityForm.endDate || undefined,
      notes: liabilityForm.notes.trim() || undefined,
    };

    if (liabilityForm.id) {
      await updateLiability(liabilityForm.id, payload);
    } else {
      await addLiability(payload);
    }

    setLiabilityDialogOpen(false);
  };

  return (
    <Stack spacing={2.5}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography color="text.secondary">סך כספים יושבים</Typography>
              <Typography variant="h5" fontWeight={800} color="success.main">
                {formatCurrency(totalAssets)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography color="text.secondary">סך התחייבויות</Typography>
              <Typography variant="h5" fontWeight={800} color="error.main">
                {formatCurrency(totalLiabilities)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography color="text.secondary">הון נטו</Typography>
              <Typography
                variant="h5"
                fontWeight={800}
                color={netWorth >= 0 ? 'primary.main' : 'error.main'}
              >
                {formatCurrency(netWorth)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography color="text.secondary">נזיל מיידית</Typography>
              <Typography variant="h6" fontWeight={800} color="success.main">
                {formatCurrency(liquidNow)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography color="text.secondary">נזיל עד 30 יום</Typography>
              <Typography variant="h6" fontWeight={800} color="primary.main">
                {formatCurrency(liquidIn30Days)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography color="text.secondary">פחות נזיל (מעל 30 יום)</Typography>
              <Typography variant="h6" fontWeight={800} color="warning.main">
                {formatCurrency(lessLiquid)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <WealthDistributionChart
            assetsData={assetDistributionData}
            liabilitiesData={liabilityDistributionData}
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <AssetLiquidityChart data={liquidityDistributionData} />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="h6" fontWeight={700}>
                  כספים יושבים לפי מקום
                </Typography>
                <Button variant="contained" onClick={openNewAssetDialog}>
                  הוספת נכס
                </Button>
              </Stack>
              <Stack spacing={1}>
                {assets.length === 0 ? (
                  <Typography color="text.secondary">אין נתונים.</Typography>
                ) : (
                  assets.map((asset) => {
                    const tier = asset.liquidityTier ?? 'days_30';
                    const liquidity = liquidityMap.get(tier);
                    const days = getAssetLiquidityDays(asset);

                    return (
                      <Card key={asset.id} variant="outlined" sx={{ borderRadius: 3 }}>
                        <CardContent sx={{ p: 1.4 }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Stack>
                              <Typography fontWeight={700}>{asset.name}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {asset.institution}
                              </Typography>
                              <Stack direction="row" spacing={1} alignItems="center" mt={0.4}>
                                <Chip
                                  size="small"
                                  label={liquidity?.label ?? 'נזילות לא הוגדרה'}
                                  sx={{ bgcolor: 'action.hover' }}
                                />
                                <Typography variant="caption" color="text.secondary">
                                  {getLiquidityText(days)}
                                </Typography>
                              </Stack>
                              <Typography variant="caption" color="text.secondary" mt={0.4}>
                                הפקדה חודשית: {formatCurrency(asset.monthlyContribution ?? 0)} | צבירה שנתית: {formatPercent(asset.annualReturnRate ?? 0)}
                              </Typography>
                            </Stack>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Typography color="success.main" fontWeight={800}>
                                {formatCurrency(asset.currentBalance)}
                              </Typography>
                              <Button
                                size="small"
                                startIcon={<EditRoundedIcon />}
                                onClick={() => openEditAssetDialog(asset)}
                              >
                                עריכה
                              </Button>
                              <Button
                                size="small"
                                color="error"
                                startIcon={<DeleteOutlineRoundedIcon />}
                                onClick={() => {
                                  void deleteAsset(asset.id);
                                }}
                              >
                                מחק
                              </Button>
                            </Stack>
                          </Stack>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="h6" fontWeight={700}>
                  התחייבויות פתוחות
                </Typography>
                <Button variant="contained" onClick={openNewLiabilityDialog}>
                  הוספת התחייבות
                </Button>
              </Stack>
              <Stack spacing={1}>
                {liabilities.length === 0 ? (
                  <Typography color="text.secondary">אין נתונים.</Typography>
                ) : (
                  liabilities.map((liability) => (
                    <Card key={liability.id} variant="outlined" sx={{ borderRadius: 3 }}>
                      <CardContent sx={{ p: 1.4 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Stack>
                            <Typography fontWeight={700}>{liability.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {liability.lender}
                            </Typography>
                          </Stack>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography color="error.main" fontWeight={800}>
                              {formatCurrency(liability.remainingAmount)}
                            </Typography>
                            <Button
                              size="small"
                              startIcon={<EditRoundedIcon />}
                              onClick={() => openEditLiabilityDialog(liability)}
                            >
                              עריכה
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              startIcon={<DeleteOutlineRoundedIcon />}
                              onClick={() => {
                                void deleteLiability(liability.id);
                              }}
                            >
                              מחק
                            </Button>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={assetDialogOpen} onClose={() => setAssetDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{assetForm.id ? 'עריכת נכס' : 'הוספת נכס'}</DialogTitle>
        <DialogContent>
          <Stack spacing={1.2} mt={0.6}>
            <TextField
              label="שם"
              value={assetForm.name}
              onChange={(event) =>
                setAssetForm((prev) => ({ ...prev, name: event.target.value }))
              }
            />
            <TextField
              label="מקום"
              value={assetForm.institution}
              onChange={(event) =>
                setAssetForm((prev) => ({ ...prev, institution: event.target.value }))
              }
            />
            <TextField
              select
              label="סוג"
              value={assetForm.kind}
              onChange={(event) =>
                setAssetForm((prev) => ({ ...prev, kind: event.target.value as AssetKind }))
              }
            >
              {assetKinds.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="רמת נזילות"
              value={assetForm.liquidityTier}
              onChange={(event) => {
                const nextTier = event.target.value as LiquidityTier;
                setAssetForm((prev) => ({
                  ...prev,
                  liquidityTier: nextTier,
                  liquidityDays: liquidityMap.get(nextTier)?.defaultDays ?? prev.liquidityDays,
                }));
              }}
            >
              {liquidityOptions.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              type="number"
              label="זמן משוער לנזילות (ימים)"
              value={assetForm.liquidityDays === 0 ? '' : assetForm.liquidityDays}
              onChange={(event) =>
                setAssetForm((prev) => ({ ...prev, liquidityDays: Number(event.target.value) }))
              }
              slotProps={{ htmlInput: { min: 0 } }}
            />
            <TextField
              type="number"
              label="יתרה"
              value={assetForm.currentBalance === 0 ? '' : assetForm.currentBalance}
              onChange={(event) =>
                setAssetForm((prev) => ({ ...prev, currentBalance: Number(event.target.value) }))
              }
            />
            <TextField
              type="number"
              label="הפקדה חודשית"
              value={assetForm.monthlyContribution === 0 ? '' : assetForm.monthlyContribution}
              onChange={(event) =>
                setAssetForm((prev) => ({ ...prev, monthlyContribution: Number(event.target.value) }))
              }
              slotProps={{ htmlInput: { min: 0 } }}
            />
            <TextField
              type="number"
              label="צבירה/תשואה שנתית %"
              value={assetForm.annualReturnRate === 0 ? '' : assetForm.annualReturnRate}
              onChange={(event) =>
                setAssetForm((prev) => ({ ...prev, annualReturnRate: Number(event.target.value) }))
              }
              slotProps={{ htmlInput: { min: -100, max: 100 } }}
            />
            <TextField
              type="date"
              label="תאריך עדכון"
              InputLabelProps={{ shrink: true }}
              value={assetForm.lastUpdated}
              onChange={(event) =>
                setAssetForm((prev) => ({ ...prev, lastUpdated: event.target.value }))
              }
            />
            <TextField
              label="הערות"
              multiline
              minRows={2}
              value={assetForm.notes}
              onChange={(event) =>
                setAssetForm((prev) => ({ ...prev, notes: event.target.value }))
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setAssetDialogOpen(false)}>ביטול</Button>
          <Button
            variant="contained"
            onClick={() => {
              void saveAsset();
            }}
          >
            שמירה
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={liabilityDialogOpen}
        onClose={() => setLiabilityDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{liabilityForm.id ? 'עריכת התחייבות' : 'הוספת התחייבות'}</DialogTitle>
        <DialogContent>
          <Stack spacing={1.2} mt={0.6}>
            <TextField
              label="שם"
              value={liabilityForm.name}
              onChange={(event) =>
                setLiabilityForm((prev) => ({ ...prev, name: event.target.value }))
              }
            />
            <TextField
              label="מלווה"
              value={liabilityForm.lender}
              onChange={(event) =>
                setLiabilityForm((prev) => ({ ...prev, lender: event.target.value }))
              }
            />
            <TextField
              select
              label="סוג"
              value={liabilityForm.kind}
              onChange={(event) =>
                setLiabilityForm((prev) => ({ ...prev, kind: event.target.value as LiabilityKind }))
              }
            >
              {liabilityKinds.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              type="number"
              label="סכום מקורי"
              value={liabilityForm.originalAmount === 0 ? '' : liabilityForm.originalAmount}
              onChange={(event) =>
                setLiabilityForm((prev) => ({ ...prev, originalAmount: Number(event.target.value) }))
              }
            />
            <TextField
              type="number"
              label="יתרה לתשלום"
              value={liabilityForm.remainingAmount === 0 ? '' : liabilityForm.remainingAmount}
              onChange={(event) =>
                setLiabilityForm((prev) => ({ ...prev, remainingAmount: Number(event.target.value) }))
              }
            />
            <TextField
              type="number"
              label="תשלום חודשי"
              value={liabilityForm.monthlyPayment === 0 ? '' : liabilityForm.monthlyPayment}
              onChange={(event) =>
                setLiabilityForm((prev) => ({ ...prev, monthlyPayment: Number(event.target.value) }))
              }
            />
            <TextField
              type="number"
              label="ריבית %"
              value={liabilityForm.interestRate === 0 ? '' : liabilityForm.interestRate}
              onChange={(event) =>
                setLiabilityForm((prev) => ({ ...prev, interestRate: Number(event.target.value) }))
              }
            />
            <TextField
              type="date"
              label="תאריך סיום"
              InputLabelProps={{ shrink: true }}
              value={liabilityForm.endDate}
              onChange={(event) =>
                setLiabilityForm((prev) => ({ ...prev, endDate: event.target.value }))
              }
            />
            <TextField
              label="הערות"
              multiline
              minRows={2}
              value={liabilityForm.notes}
              onChange={(event) =>
                setLiabilityForm((prev) => ({ ...prev, notes: event.target.value }))
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setLiabilityDialogOpen(false)}>ביטול</Button>
          <Button
            variant="contained"
            onClick={() => {
              void saveLiability();
            }}
          >
            שמירה
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};
