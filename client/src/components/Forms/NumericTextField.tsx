import { TextField, type TextFieldProps } from '@mui/material';
import { useEffect, useState } from 'react';

const formatWithCommas = (n: number): string =>
  new Intl.NumberFormat('he-IL', { maximumFractionDigits: 4 }).format(n);

const parseRaw = (raw: string, allowDecimals: boolean): number => {
  const cleaned = allowDecimals
    ? raw.replace(/[^\d.]/g, '').replace(/(\.\d*)\./, '$1')
    : raw.replace(/\D/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

interface NumericTextFieldProps extends Omit<TextFieldProps, 'onChange' | 'value' | 'type'> {
  value: number;
  onChange: (value: number) => void;
  allowDecimals?: boolean;
}

export const NumericTextField = ({
  value,
  onChange,
  allowDecimals = false,
  ...rest
}: NumericTextFieldProps) => {
  const [display, setDisplay] = useState<string>(value === 0 ? '' : formatWithCommas(value));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) {
      setDisplay(value === 0 ? '' : formatWithCommas(value));
    }
  }, [value, focused]);

  const handleFocus = () => {
    setFocused(true);
    setDisplay(value === 0 ? '' : String(value));
  };

  const handleBlur = () => {
    setFocused(false);
    const num = parseRaw(display, allowDecimals);
    onChange(num);
    setDisplay(num === 0 ? '' : formatWithCommas(num));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const cleaned = allowDecimals
      ? raw.replace(/[^\d.]/g, '').replace(/(\.\d*)\./, '$1')
      : raw.replace(/\D/g, '');
    setDisplay(cleaned);
    onChange(parseRaw(cleaned, allowDecimals));
  };

  return (
    <TextField
      {...rest}
      type="text"
      inputMode={allowDecimals ? 'decimal' : 'numeric'}
      value={display}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
};
