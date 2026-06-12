import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import {
    Button,
    Card,
    CardContent,
    MenuItem,
    Stack,
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
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={2}
                    alignItems={{ xs: 'stretch', md: 'center' }}
                >
                    <Typography minWidth={120} fontWeight={800}>
                        סינון ומיון
                    </Typography>

                    <TextField
                        label="חודש"
                        type="month"
                        value={filters.month}
                        onChange={(event) => onChange({ month: event.target.value })}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                    />

                    <TextField
                        label="סוג"
                        select
                        size="small"
                        value={filters.type}
                        onChange={(event) =>
                            onChange({ type: event.target.value as Filters['type'] })
                        }
                        sx={{ minWidth: 140 }}
                    >
                        <MenuItem value="all">הכל</MenuItem>
                        <MenuItem value="income">הכנסה</MenuItem>
                        <MenuItem value="expense">הוצאה</MenuItem>
                    </TextField>

                    <TextField
                        label="קטגוריה"
                        select
                        size="small"
                        value={filters.category}
                        onChange={(event) => onChange({ category: event.target.value })}
                        sx={{ minWidth: 180 }}
                    >
                        <MenuItem value="all">כל הקטגוריות</MenuItem>
                        {categories.map((category) => (
                            <MenuItem key={category.id} value={category.id}>
                                {category.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="מיון לפי"
                        select
                        size="small"
                        value={filters.sortBy}
                        onChange={(event) =>
                            onChange({ sortBy: event.target.value as Filters['sortBy'] })
                        }
                        sx={{ minWidth: 140 }}
                    >
                        <MenuItem value="date">תאריך</MenuItem>
                        <MenuItem value="amount">סכום</MenuItem>
                    </TextField>

                    <TextField
                        label="כיוון"
                        select
                        size="small"
                        value={filters.sortDirection}
                        onChange={(event) =>
                            onChange({
                                sortDirection: event.target.value as Filters['sortDirection'],
                            })
                        }
                        sx={{ minWidth: 140 }}
                    >
                        <MenuItem value="desc">מהחדש לישן</MenuItem>
                        <MenuItem value="asc">מהישן לחדש</MenuItem>
                    </TextField>

                    <Button
                        variant="text"
                        endIcon={<RestartAltRoundedIcon />}
                        onClick={onReset}
                        sx={{ ml: { md: 'auto' }, gap: "8px", padding: globalButtonPaddings  }}
                    >
                        איפוס
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
};
