/**
 * Extracts numeric value from a price string
 * Handles formats like: "N1,000,000.00", "$1,000", "1000", etc.
 */
export const extractPrice = (price: number | string | undefined): number => {
  if (typeof price === 'number') {
    return price;
  }
  
  if (!price) {
    return 0;
  }
  
  // Remove all non-numeric characters except decimal point
  const numericString = price.toString().replace(/[^0-9.]/g, '');
  const numericValue = parseFloat(numericString);
  
  return isNaN(numericValue) ? 0 : numericValue;
};

/**
 * Format price with commas and optional currency symbol
 */
export const formatPrice = (price: number | string, currency: string = 'US$'): string => {
  const numericPrice = extractPrice(price);
  return `${currency}${numericPrice.toLocaleString()}`;
};