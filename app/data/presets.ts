import { FormData } from '../types';

export interface Preset {
  id: string;
  name: string;
  description: string;
  data: FormData;
}

export const presets: Preset[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Balanced assumptions for a typical market',
    data: {
      home_price: 500000,
      down_payment_percent: 20,
      mortgage_rate: 6,
      mortgage_term_years: 30,
      property_tax_rate: 1.2,
      home_insurance: 1200,
      maintenance_percent: 1,
      home_appreciation_rate: 3,
      rent_amount: 2500,
      rent_increase_rate: 2,
      investment_return_rate: 7,
      analysis_period_years: 30,
      agent_fee_percent: 6,
    }
  },
  {
    id: 'hot-market',
    name: 'Hot Market',
    description: 'High appreciation, high rent increases',
    data: {
      home_price: 600000,
      down_payment_percent: 20,
      mortgage_rate: 5.5,
      mortgage_term_years: 30,
      property_tax_rate: 1.1,
      home_insurance: 1500,
      maintenance_percent: 1,
      home_appreciation_rate: 5,
      rent_amount: 3000,
      rent_increase_rate: 4,
      investment_return_rate: 7,
      analysis_period_years: 30,
      agent_fee_percent: 5,
    }
  },
  {
    id: 'conservative',
    name: 'Conservative',
    description: 'Lower appreciation, higher investment returns',
    data: {
      home_price: 450000,
      down_payment_percent: 25,
      mortgage_rate: 6.5,
      mortgage_term_years: 30,
      property_tax_rate: 1.5,
      home_insurance: 1400,
      maintenance_percent: 1.5,
      home_appreciation_rate: 2,
      rent_amount: 2200,
      rent_increase_rate: 2,
      investment_return_rate: 8,
      analysis_period_years: 30,
      agent_fee_percent: 6,
    }
  },
  {
    id: 'high-cost',
    name: 'High Cost Area',
    description: 'Expensive market with high prices and rent',
    data: {
      home_price: 1000000,
      down_payment_percent: 20,
      mortgage_rate: 6,
      mortgage_term_years: 30,
      property_tax_rate: 1.2,
      home_insurance: 2400,
      maintenance_percent: 1,
      home_appreciation_rate: 4,
      rent_amount: 4500,
      rent_increase_rate: 3,
      investment_return_rate: 7,
      analysis_period_years: 30,
      agent_fee_percent: 5,
    }
  },
  {
    id: 'extreme-high-cost',
    name: 'Extra High Cost Area',
    description: 'Ultra premium market with very high home prices',
    data: {
      home_price: 4500000,
      down_payment_percent: 25,
      mortgage_rate: 6.5,
      mortgage_term_years: 30,
      property_tax_rate: 1.125,
      home_insurance: 2250,
      maintenance_percent: 0.1,
      home_appreciation_rate: 8,
      rent_amount: 7000,
      rent_increase_rate: 3,
      investment_return_rate: 10,
      analysis_period_years: 30,
      agent_fee_percent: 6,
    }
  }
]; 