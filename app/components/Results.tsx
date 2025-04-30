'use client';

import { Suspense, lazy } from 'react';
import { Box, Typography } from '@mui/material';

// Import types from the extracted components
import { OptimizedChartProps } from './ResultsChart';
import { ResultsSummaryProps } from './ResultsSummary';

// Dynamically import heavyweight components
const OptimizedChart = lazy(() => import('./ResultsChart').then(mod => ({ default: mod.OptimizedChart })));
const ResultsSummary = lazy(() => import('./ResultsSummary'));

interface ChartProps extends OptimizedChartProps {}

interface SummaryProps extends ResultsSummaryProps {
  chartData?: ChartProps['chartData'];
  selectedYearIndex?: number | null;
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

// Combined Results with state for selected year
const Results = {
  Chart: ({ chartData, onYearSelect }: ChartProps) => {
    return (
      <div style={{ 
        width: '100%', 
        height: '100%', 
        position: 'relative',
        minHeight: '350px' // Ensure minimum height
      }}>
        <Suspense fallback={
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography>Loading chart...</Typography>
          </Box>
        }>
          <OptimizedChart chartData={chartData} onYearSelect={onYearSelect} />
        </Suspense>
      </div>
    );
  },
  Summary: ({ 
    crossoverYear, 
    finalBuyNetWorth, 
    finalRentNetWorth, 
    analysisYears,
    chartData,
    selectedYearIndex
  }: SummaryProps) => {
    // If no chart data or no selected year, show regular summary
    if (!chartData || selectedYearIndex === null || selectedYearIndex === undefined) {
      return (
        <Suspense fallback={<Box sx={{ p: 2 }}><Typography>Loading summary...</Typography></Box>}>
          <ResultsSummary
            crossoverYear={crossoverYear}
            finalBuyNetWorth={finalBuyNetWorth}
            finalRentNetWorth={finalRentNetWorth}
            analysisYears={analysisYears}
            selectedYearData={null}
          />
        </Suspense>
      );
    }
    
    // Extract data for the selected year
    const selectedYear = chartData.labels[selectedYearIndex];
    const buyDataset = chartData.datasets[0];
    const rentDataset = chartData.datasets[1];
    
    const selectedYearData = {
      year: selectedYear,
      buyData: {
        financialPosition: buyDataset.data[selectedYearIndex],
        homeValue: buyDataset.homeValues?.[selectedYearIndex] || 0,
        mortgage: buyDataset.remainingMortgage?.[selectedYearIndex] || 0,
        equity: buyDataset.homeEquity?.[selectedYearIndex] || 0,
        investments: buyDataset.investments?.[selectedYearIndex] || 0,
        costs: buyDataset.accumulatedCosts?.[selectedYearIndex] || 0,
        sellingCosts: buyDataset.sellingCosts?.[selectedYearIndex] || 0
      },
      rentData: {
        financialPosition: rentDataset.data[selectedYearIndex],
        investments: rentDataset.investments?.[selectedYearIndex] || 0,
        costs: rentDataset.accumulatedCosts?.[selectedYearIndex] || 0
      }
    };
    
    return (
      <Suspense fallback={<Box sx={{ p: 2 }}><Typography>Loading summary...</Typography></Box>}>
        <ResultsSummary
          crossoverYear={crossoverYear}
          finalBuyNetWorth={finalBuyNetWorth}
          finalRentNetWorth={finalRentNetWorth}
          analysisYears={analysisYears}
          selectedYearData={selectedYearData}
        />
      </Suspense>
    );
  }
};

export default Results; 