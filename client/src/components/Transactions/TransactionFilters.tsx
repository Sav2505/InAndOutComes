import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import {
    Button,
    Card,
    CardContent,
    Grid,
    InputAdornment,
    MenuItem,
    TextField,
    Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import type { Category } from '../../types';
import type { TransactionFilters as Filters } from '../../store/financeStore';
import { globalButtonPaddings } from '../../utils/globals';

interface TransactionFiltersProps {
    filters: Filters;
    categories: Category[];
    onChange: (filters: Partial<Filters>) => void;
    onReset: () => void;
}

export const TransactionFilters = ({
    filters,
    categories,
    onChange,
    onReset,
}: TransactionFiltersProps) => {
    return (
        <Card
            component={motion.div}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            sx={{ borderRadius: 4.5 }}
        >
            <CardContent>
                <Grid container spacing={1.5} alignItems="center">
                    <Grid size={12}>
                        <Typography fontWeight={800}>
                            סינון ומיון
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 'auto' }} sx={{ minWidth: { md: 240 } }}>
                        <TextField
                            fullWidth
                            label="חיפוש חופשי"
                            placeholder="לדוגמא: בילויים"
                            value={filters.search}
                            onChange={(event) => onChange({ search: event.target.value })}
                            size="small"
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchRoundedIcon fontSize="small" />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 'auto' }}>
                        <TextField
                            fullWidth
                            label="חודש"
                            type="month"
                            value={filters.month}
                            onChange={(event) => onChange({ month: event.target.value })}
                            InputLabelProps={{ shrink: true }}
                            size="small"
                        />
                    </Grid>

                    <Grid size={{ xs: 6, sm: 4, md: 'auto' }}>
                        <TextField
                            fullWidth
                            label="סוג"
                            select
                            size="small"
                            value={filters.type}
                            onChange={(event) =>
                                onChange({ type: event.target.value as Filters['type'] })
                            }
                            sx={{ minWidth: { md: 140 } }}
                        >
                            <MenuItem value="all">הכל</MenuItem>
                            <MenuItem value="income">הכנסה</MenuItem>
                            <MenuItem value="expense">הוצאה</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid size={{ xs: 6, sm: 4, md: 'auto' }}>
                        <TextField
                            fullWidth
                            label="קטגוריה"
                            select
                            size="small"
                            value={filters.category}
                            onChange={(event) => onChange({ category: event.target.value })}
                            sx={{ minWidth: { md: 180 } }}
                        >
                            <MenuItem value="all">כל הקטגוריות</MenuItem>
                            {categories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid size={{ xs: 6, sm: 4, md: 'auto' }}>
                        <TextField
                            fullWidth
                            label="מיון לפי"
                            select
                            size="small"
                            value={filters.sortBy}
                            onChange={(event) =>
                                onChange({ sortBy: event.target.value as Filters['sortBy'] })
                            }
                            sx={{ minWidth: { md: 140 } }}
                        >
                            <MenuItem value="date">תאריך</MenuItem>
                            <MenuItem value="amount">סכום</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid size={{ xs: 6, sm: 4, md: 'auto' }}>
                        <TextField
                            fullWidth
                            label="כיוון"
                            select
                            size="small"
                            value={filters.sortDirection}
                            onChange={(event) =>
                                onChange({
                                    sortDirection: event.target.value as Filters['sortDirection'],
                                })
                            }
                            sx={{ minWidth: { md: 140 } }}
                        >
                            <MenuItem value="desc">מהחדש לישן</MenuItem>
                            <MenuItem value="asc">מהישן לחדש</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4, md: 'auto' }} sx={{ mr: { md: 'auto' } }}>
                        <Button
                            fullWidth
                            variant="text"
                            endIcon={<RestartAltRoundedIcon />}
                            onClick={onReset}
                            sx={{ gap: '8px', padding: globalButtonPaddings }}
                        >
                            איפוס
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};
