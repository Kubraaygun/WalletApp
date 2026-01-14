/**
 * Currency Formatting Utility
 * Provides safe currency formatting with Intl fallback for Android compatibility
 */

export const formatCurrency = (amount) => {
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) return "0,00";

  try {
    if (typeof Intl !== 'undefined' && Intl.NumberFormat) {
      return new Intl.NumberFormat("tr-TR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(numAmount);
    }
    
    // Fallback for systems without Intl support
    return numAmount.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  } catch (error) {
    console.error("Currency formatting error:", error);
    return numAmount.toFixed(2).replace('.', ',');
  }
};

export const formatCompactCurrency = (amount) => {
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) return "0";

  if (numAmount >= 1000000) {
    return (numAmount / 1000000).toFixed(1).replace('.', ',') + "M";
  }
  if (numAmount >= 1000) {
    return (numAmount / 1000).toFixed(1).replace('.', ',') + "K";
  }
  return formatCurrency(numAmount);
};
