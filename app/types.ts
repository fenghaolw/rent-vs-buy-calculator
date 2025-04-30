export interface FormData {
  home_price: number;
  down_payment_percent: number;
  mortgage_rate: number;
  mortgage_term_years: number;
  property_tax_rate: number;
  home_insurance: number;
  maintenance_percent: number;
  home_appreciation_rate: number;
  rent_amount: number;
  rent_increase_rate: number;
  investment_return_rate: number;
  analysis_period_years: number;
  agent_fee_percent: number;
}

export interface CalculationResults {
  chartData: {
    labels: number[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      tension: number;
    }[];
  };
  crossover_year: number | null;
  final_buy_net_worth: number;
  final_rent_net_worth: number;
} 