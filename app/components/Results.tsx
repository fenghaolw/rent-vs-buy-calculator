'use client';

import { useRef, useEffect, useState } from 'react';
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
import { 
  Typography, 
  Box, 
  Divider, 
  Paper,
  Stack,
  Grid 
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ApartmentIcon from '@mui/icons-material/Apartment';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartProps {
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

interface SummaryProps {
  crossoverYear: number | null;
  finalBuyNetWorth: number;
  finalRentNetWorth: number;
  analysisYears: number;
  selectedYearData?: {
    year: number;
    buyData: {
      financialPosition: number;
      homeValue: number;
      mortgage: number;
      equity: number;
      investments: number;
      costs: number;
      sellingCosts: number;
    };
    rentData: {
      financialPosition: number;
      investments: number;
      costs: number;
    };
  } | null;
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

// Basic chart component
const Chart = ({ chartData, onYearSelect }: ChartProps) => {
  // Create chart options with click handler
  const optionsWithClick = {
    ...chartOptions,
    onClick: (event: any, elements: any) => {
      if (elements && elements.length > 0) {
        const clickedIndex = elements[0].index;
        onYearSelect(clickedIndex);
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
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Line 
        data={chartData} 
        options={optionsWithClick}
      />
    </div>
  );
};

// Summary component
const Summary = ({ 
  crossoverYear, 
  finalBuyNetWorth, 
  finalRentNetWorth, 
  analysisYears,
  selectedYearData
}: SummaryProps) => {

  // If we have selected year data, show the year-specific summary
  if (selectedYearData) {
    const { year, buyData, rentData } = selectedYearData;
    const difference = buyData.financialPosition - rentData.financialPosition;
    const betterOption = difference > 0 ? 'Buying' : 'Renting';
    const absDifference = Math.abs(difference);
    
    return (
      <Stack spacing={2}>
        <Box>
          <Typography variant="subtitle1" color="primary" gutterBottom>
            Year {year} Comparison
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Click anywhere outside the chart to return to the final summary
          </Typography>
          <Divider sx={{ mt: 1 }} />
        </Box>
        
        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Financial Position Difference
          </Typography>
          <Typography variant="h6" fontWeight="medium">
            {betterOption} is better by {formatCurrency(absDifference)}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, mt: 2 }}>
          <Box sx={{ flex: 1, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Buy Position: {formatCurrency(buyData.financialPosition)}
            </Typography>
            <Stack spacing={1} sx={{ mt: 1 }}>
              <Typography variant="body2">
                Home Equity: {formatCurrency(buyData.equity)}
              </Typography>
              <Typography variant="body2" sx={{ pl: 2, fontSize: '0.875rem' }}>
                • Home Value: {formatCurrency(buyData.homeValue)}
              </Typography>
              <Typography variant="body2" sx={{ pl: 2, fontSize: '0.875rem' }}>
                • Mortgage: {formatCurrency(buyData.mortgage)}
              </Typography>
              <Typography variant="body2">
                Accumulated Costs: {formatCurrency(buyData.costs)}
              </Typography>
            </Stack>
          </Box>
          <Box sx={{ flex: 1, p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Rent Position: {formatCurrency(rentData.financialPosition)}
            </Typography>
            <Stack spacing={1} sx={{ mt: 1 }}>
              <Typography variant="body2">
                Investments: {formatCurrency(rentData.investments)}
              </Typography>
              <Typography variant="body2">
                Accumulated Rent: {formatCurrency(rentData.costs)}
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Stack>
    );
  }

  // Otherwise, show the final summary (existing code)
  const difference = Math.abs(finalBuyNetWorth - finalRentNetWorth);
  const percentDifference = ((difference / Math.min(finalBuyNetWorth, finalRentNetWorth)) * 100).toFixed(1);
  const betterOption = finalBuyNetWorth > finalRentNetWorth ? 'Buying' : 'Renting';
  
  return (
    <Stack spacing={2}>
      {crossoverYear && (
        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Crossover Point
          </Typography>
          <Typography variant="h5" fontWeight="medium">
            {crossoverYear.toFixed(1)} years
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Buying becomes more favorable after this period
          </Typography>
          <Divider sx={{ mt: 2 }} />
        </Box>
      )}
      
      <Box>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          After {analysisYears} years
        </Typography>
        <Typography variant="h6" color="primary" fontWeight="medium">
          {betterOption} is better by {formatCurrency(difference)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          ({percentDifference}% difference)
        </Typography>
        <Divider sx={{ mt: 2 }} />
      </Box>
      
      <Box>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Final Financial Position
        </Typography>
        
        <Stack spacing={1.5} sx={{ mt: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <HomeIcon sx={{ color: 'success.main', fontSize: 18, mr: 1 }} />
              <Typography variant="body2">Buy</Typography>
            </Box>
            <Typography variant="body2" fontWeight="medium">
              {formatCurrency(finalBuyNetWorth)}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ApartmentIcon sx={{ color: 'primary.main', fontSize: 18, mr: 1 }} />
              <Typography variant="body2">Rent</Typography>
            </Box>
            <Typography variant="body2" fontWeight="medium">
              {formatCurrency(finalRentNetWorth)}
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
};

// Combined Results with state for selected year
const Results = {
  Chart: ({ chartData, onYearSelect }: ChartProps) => {
    return (
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        <Chart chartData={chartData} onYearSelect={onYearSelect} />
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
  }: SummaryProps & { 
    chartData?: ChartProps['chartData'],
    selectedYearIndex?: number | null
  }) => {
    // If no chart data or no selected year, show regular summary
    if (!chartData || selectedYearIndex === null || selectedYearIndex === undefined) {
      return (
        <Summary
          crossoverYear={crossoverYear}
          finalBuyNetWorth={finalBuyNetWorth}
          finalRentNetWorth={finalRentNetWorth}
          analysisYears={analysisYears}
          selectedYearData={null}
        />
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
      <Summary
        crossoverYear={crossoverYear}
        finalBuyNetWorth={finalBuyNetWorth}
        finalRentNetWorth={finalRentNetWorth}
        analysisYears={analysisYears}
        selectedYearData={selectedYearData}
      />
    );
  }
};

export default Results; 