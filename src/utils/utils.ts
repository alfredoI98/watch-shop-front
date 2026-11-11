export const sanitizePriceInput = (value: string): string => {
  const sanitizedValue = value.replace(/[^\d.]/g, '');

  if (!sanitizedValue) return '';
  if (sanitizedValue === '.') return '0.';

  const [wholePart, decimalPart = ''] = sanitizedValue.split('.');
  const normalizedWholePart = wholePart.replace(/^0+(?=\d)/, '') || '0';
  const normalizedDecimalPart = decimalPart.replace(/\./g, '').slice(0, 2);

  return sanitizedValue.includes('.')
    ? `${normalizedWholePart}.${normalizedDecimalPart}`
    : normalizedWholePart;
};
