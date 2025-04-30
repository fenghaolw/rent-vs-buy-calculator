import { Line } from 'react-chartjs-2';
import { CalculationResults, FormData } from '../types';

interface ResultsChartProps {
  results: CalculationResults | null;
  formData: FormData;
}

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