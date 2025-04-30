// Only export the Chart.js components we actually use
// This allows for better tree shaking than importing from the main package

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  TooltipCallbacks,
  ScaleOptions
} from 'chart.js';

// Register only the components we need
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Export the runtime components
export {
  ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
};

// Export the types properly
export type { ChartOptions, TooltipCallbacks, ScaleOptions };

// Also export a helper for currency formatting
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
}; 