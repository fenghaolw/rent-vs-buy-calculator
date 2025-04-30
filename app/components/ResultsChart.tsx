'use client';

import { useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { CalculationResults, FormData } from '../types';

// Register only the chart components we need
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Props for the Optimized Chart component
export interface OptimizedChartProps {
  chartData: {
    labels: number[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      tension: number;
      homeEquity?: number[];
      investments?: number[];
      accumulatedCosts?: number[];
      sellingCosts?: number[];
      homeValues?: number[];
      remainingMortgage?: number[];
    }[];
  };
  onYearSelect: (yearIndex: number | null) => void;
}

// Props for the wrapper component
interface ResultsChartProps {
  results: CalculationResults | null;
  formData: FormData;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
};

// Simplify chart options to prevent re-rendering issues
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  plugins: {
    tooltip: {
      mode: 'index' as const,
      intersect: false,
      callbacks: {
        // Enhanced tooltip that shows a breakdown of financial position components
        title: function(tooltipItems: any[]) {
          if (tooltipItems.length > 0) {
            const item = tooltipItems[0];
            return `Year ${item.label}`;
          }
          return '';
        },
        label: function(context: any) {
          const label = context.dataset.label || '';
          const value = formatCurrency(context.parsed.y);
          
          // Return the basic label first
          return `${label} Financial Position: ${value}`;
        },
        afterLabel: function(context: any) {
          const dataset = context.dataset;
          const index = context.dataIndex;
          
          // Create a breakdown for each scenario
          if (dataset.label === 'Buy') {
            const homeValue = dataset.homeValues?.[index] || 0;
            const mortgage = dataset.remainingMortgage?.[index] || 0;
            const equity = dataset.homeEquity?.[index] || 0;
            const costs = dataset.accumulatedCosts?.[index] || 0;
            const sellingCosts = dataset.sellingCosts?.[index] || 0;
            
            return [
              `Home Equity: ${formatCurrency(equity)}`,
              `  • Home Value: ${formatCurrency(homeValue)}`,
              `  • Mortgage: ${formatCurrency(mortgage)}`,
              `Selling Costs: ${formatCurrency(sellingCosts)} (if sold)`,
              `Accumulated Costs: ${formatCurrency(costs)} (total paid over ${index + 1} years)`
            ];
          } else if (dataset.label === 'Rent') {
            const investments = dataset.investments?.[index] || 0;
            const costs = dataset.accumulatedCosts?.[index] || 0;
            
            return [
              `Investments: ${formatCurrency(investments)} (savings + growth)`,
              `Accumulated Rent: ${formatCurrency(costs)} (total paid over ${index + 1} years)`
            ];
          }
          
          return '';
        }
      }
    },
    legend: {
      position: 'top' as const,
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Financial Position ($)'
      },
      ticks: {
        callback: function(value: any) {
          return formatCurrency(value as number);
        }
      }
    },
    x: {
      min: 1,
      title: {
        display: true,
        text: 'Years'
      },
      ticks: {
        callback: function(value: any) {
          if (Number.isInteger(Number(value)) && Number(value) >= 1) {
            return `Year ${value}`;
          }
          return '';
        }
      }
    }
  }
};

// Optimized chart component that can be dynamically imported
export const OptimizedChart = ({ chartData, onYearSelect }: OptimizedChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  
  // Create chart options with click handler
  const optionsWithClick = {
    ...chartOptions,
    onClick: (event: any, elements: any) => {
      if (elements && elements.length > 0) {
        const clickedIndex = elements[0].index;
        onYearSelect(clickedIndex);
        
        // Force maintain the chart dimensions after click
        if (chartRef.current) {
          const currentHeight = chartRef.current.offsetHeight;
          if (currentHeight > 0) {
            chartRef.current.style.minHeight = `${currentHeight}px`;
          }
        }
      }
    }
  };

  // Set up click outside detection
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // Find chart canvas
      const canvas = document.querySelector('canvas');
      
      // If click is outside canvas, reset selection
      if (canvas && !canvas.contains(e.target as Node)) {
        onYearSelect(null);
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [onYearSelect]);

  return (
    <div ref={chartRef} style={{ 
      width: '100%', 
      height: '100%', 
      position: 'relative',
      minHeight: '350px',  // Ensure minimum height
    }}>
      <Line 
        data={chartData} 
        options={optionsWithClick}
      />
    </div>
  );
};

// Original component is just a wrapper that imports and uses OptimizedChart
export default function ResultsChart({ results, formData }: ResultsChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD', 
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      {results ? (
        <div className="space-y-4">
          <div className="w-full" style={{ height: '400px', position: 'relative' }}>
            <Line
              data={results.chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                  mode: 'index',
                  intersect: false,
                },
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                  title: {
                    display: true,
                    text: 'Rent vs. Buy Comparison'
                  },
                  tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                      label: function(context) {
                        return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Net Worth ($)'
                    },
                    ticks: {
                      callback: function(value) {
                        return formatCurrency(value as number);
                      }
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Months'
                    },
                    ticks: {
                      stepSize: 12,
                      callback: function(value) {
                        return value;
                      }
                    }
                  }
                }
              }}
            />
          </div>
          
          <div className="mt-4 space-y-2">
            {results.crossover_year && (
              <p className="text-lg">
                Buying becomes more favorable after{' '}
                <span className="font-bold">{results.crossover_year.toFixed(1)} years</span>
              </p>
            )}
            <p className="text-lg">
              Final net worth after {formData.analysis_period_years} years:
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">Buy Scenario</p>
                <p className="text-xl font-bold text-green-900">
                  {formatCurrency(results.final_buy_net_worth)}
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">Rent Scenario</p>
                <p className="text-xl font-bold text-blue-900">
                  {formatCurrency(results.final_rent_net_worth)}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[400px] flex items-center justify-center text-gray-500">
          Enter your assumptions and click Calculate to see the comparison
        </div>
      )}
    </div>
  );
} 