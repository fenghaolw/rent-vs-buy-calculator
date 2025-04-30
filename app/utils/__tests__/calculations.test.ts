import { calculateResults, calculateMonthlyMortgage } from '../calculations';
import { FormData } from '../../types';

describe('calculateResults', () => {
  const defaultInput: FormData = {
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
  };

  test('should calculate correct monthly mortgage payment', () => {
    const loanAmount = defaultInput.home_price * (1 - defaultInput.down_payment_percent / 100);
    const monthlyRate = defaultInput.mortgage_rate / 100 / 12;
    const numPayments = defaultInput.mortgage_term_years * 12;
    
    const monthlyPayment = calculateMonthlyMortgage(loanAmount, monthlyRate, numPayments);
    
    // For a $500,000 home with 20% down payment and 6% interest rate
    // Monthly payment should be approximately $2,398
    expect(Math.abs(monthlyPayment - 2398)).toBeLessThan(100);
  });

  test('should show higher net worth for buying when home appreciation is high', () => {
    const input = {
      ...defaultInput,
      home_appreciation_rate: 5,
      investment_return_rate: 3,
    };
    const results = calculateResults(input);
    
    expect(results.final_buy_net_worth).toBeGreaterThan(results.final_rent_net_worth);
  });

  test('should show higher net worth for renting when investment returns are high', () => {
    const input = {
      ...defaultInput,
      home_appreciation_rate: 2,
      investment_return_rate: 8,
    };
    const results = calculateResults(input);
    
    expect(results.final_rent_net_worth).toBeGreaterThan(results.final_buy_net_worth);
  });

  test('should calculate correct crossover point when scenarios cross', () => {
    const input = {
      ...defaultInput,
      home_price: 400000,
      down_payment_percent: 20,
      mortgage_rate: 4,
      rent_amount: 2500,
      home_appreciation_rate: 5,
      investment_return_rate: 3,
      property_tax_rate: 1.0,
      maintenance_percent: 0.5,
      analysis_period_years: 30,
    };
    const results = calculateResults(input);
    
    // The crossover point should be a reasonable number of years
    expect(results.crossover_year).toBeGreaterThan(0);
    expect(results.crossover_year).toBeLessThan(input.analysis_period_years);
  });

  test('should handle zero down payment', () => {
    const input = {
      ...defaultInput,
      down_payment_percent: 0,
    };
    const results = calculateResults(input);
    
    // Initial net worth should be negative for buy scenario (due to agent fee)
    // and 0 for rent scenario
    expect(results.chartData.datasets[0].data[0]).toBeLessThan(0);
    expect(results.chartData.datasets[1].data[0]).toBe(0);
  });

  test('should handle zero rent increase', () => {
    const input = {
      ...defaultInput,
      rent_increase_rate: 0,
    };
    const results = calculateResults(input);
    
    // Rent scenario should have linear growth
    const rentData = results.chartData.datasets[1].data;
    const rentGrowth = rentData[rentData.length - 1] - rentData[0];
    expect(rentGrowth).toBeGreaterThan(0);
  });

  test('should handle zero home appreciation', () => {
    const input = {
      ...defaultInput,
      home_appreciation_rate: 0,
    };
    const results = calculateResults(input);
    
    // Buy scenario should still show some growth due to equity building
    const buyData = results.chartData.datasets[0].data;
    expect(buyData[buyData.length - 1]).toBeGreaterThan(buyData[0]);
  });
}); 