// export const formatCurrency = (value?: number | null): string => {
//   if (typeof value !== 'number' || isNaN(value)) {
//     return '$0.00'; // fallback
//   }

//   if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
//   if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
//   if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
//   if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;

//   return `$${value.toFixed(2)}`;
// };


// export const formatNumber = (value: number): string => {
//   if (value >= 1e12) {
//     return `${(value / 1e12).toFixed(2)}T`;
//   }
//   if (value >= 1e9) {
//     return `${(value / 1e9).toFixed(2)}B`;
//   }
//   if (value >= 1e6) {
//     return `${(value / 1e6).toFixed(2)}M`;
//   }
//   if (value >= 1e3) {
//     return `${(value / 1e3).toFixed(2)}K`;
//   }
//   return value.toLocaleString();
// };

// export const formatPercentage = (value: number): string => {
//   return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
// };

// export const formatDate = (dateString: string): string => {
//   return new Date(dateString).toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric',
//   });
// };

// export const getChangeColor = (change: number): string => {
//   return change >= 0 ? 'text-green-400' : 'text-red-400';
// };

// export const getChangeColorBg = (change: number): string => {
//   return change >= 0 ? 'bg-green-500/20' : 'bg-red-500/20';
// };


// Format number as currency string like $1.23K, $4.56M, etc.
export const formatCurrency = (value?: number | null): string => {
  if (typeof value !== 'number' || isNaN(value)) return '$0.00';

  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;

  return `$${value.toFixed(2)}`;
};

// Format large numbers like 1234 => 1.23K
export const formatNumber = (value?: number | null): string => {
  if (typeof value !== 'number' || isNaN(value)) return '0';

  if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;

  return value.toLocaleString(); // e.g., 999 => "999"
};

// Format percentage with + or - sign, like +2.34%
export const formatPercentage = (value?: number | null): string => {
  if (typeof value !== 'number' || isNaN(value)) return '0.00%';
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
};

// Format a date string to readable date like Jul 18, 2025
export const formatDate = (dateString?: string): string => {
  const date = new Date(dateString ?? '');
  return isNaN(date.getTime())
    ? 'Invalid Date'
    : date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
};

// Get color class for percentage changes
export const getChangeColor = (change?: number | null): string => {
  if (typeof change !== 'number' || isNaN(change)) return 'text-gray-400';
  return change >= 0 ? 'text-green-400' : 'text-red-400';
};

// Get background color class for percentage changes
export const getChangeColorBg = (change?: number | null): string => {
  if (typeof change !== 'number' || isNaN(change)) return 'bg-gray-300/20';
  return change >= 0 ? 'bg-green-500/20' : 'bg-red-500/20';
};
