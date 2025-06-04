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

  test('should calculate maintenance costs correctly with inflation', () => {
    const testFormData: FormData = {
      ...defaultInput,
      home_price: 250000,
      maintenance_percent: 0.8, // 0.8%
      analysis_period_years: 2, // Test for at least 2 years to check month 12 and 24
    };

    const results = calculateResults(testFormData);

    // The INFLATION_RATE is hardcoded in calculations.ts as 0.02 (2%)
    const INFLATION_RATE = 0.02;

    // 1. Calculate expected initial monthly maintenance cost
    const initialMonthlyMaintenanceCost = 
      (testFormData.home_price * (testFormData.maintenance_percent / 100)) / 12;

    // 2. Verify maintenanceCosts[0]
    // Ensure maintenanceCosts is returned and has elements
    expect(results.maintenanceCosts).toBeDefined();
    expect(results.maintenanceCosts.length).toBeGreaterThan(0); 
    expect(results.maintenanceCosts[0]).toBeCloseTo(initialMonthlyMaintenanceCost);

    // 3. Verify maintenanceCosts[12] (end of year 1, which is index 12)
    const monthlyInflationRate = Math.pow(1 + INFLATION_RATE, 1/12) - 1;
    
    // Expected cost at month 12 (index 12)
    const expectedMaintenanceCostMonth12 = 
      initialMonthlyMaintenanceCost * Math.pow(1 + monthlyInflationRate, 12);
      
    expect(results.maintenanceCosts.length).toBeGreaterThan(12);
    expect(results.maintenanceCosts[12]).toBeCloseTo(expectedMaintenanceCostMonth12);

    // 4. Verify maintenanceCosts[24] (end of year 2, which is index 24)
    // This is relevant because the previous implementation used homeValues[i] which appreciated.
    // The corrected version uses formData.home_price as the base for each month's maintenance calculation before inflation.
    const expectedMaintenanceCostMonth24 =
      initialMonthlyMaintenanceCost * Math.pow(1 + monthlyInflationRate, 24);
      
    expect(results.maintenanceCosts.length).toBeGreaterThan(24);
    expect(results.maintenanceCosts[24]).toBeCloseTo(expectedMaintenanceCostMonth24);
  });

  test('should correctly reduce renter investments if yearly rent is higher than yearly ownership costs', () => {
    const testFormData: FormData = {
      ...defaultInput,
      rent_amount: 3000, // High rent
      rent_increase_rate: 1, // Low rent increase to keep it high relative to ownership
      mortgage_rate: 2.5, // Low mortgage rate
      property_tax_rate: 0.5, // Low property tax
      maintenance_percent: 0.25, // Low maintenance
      home_insurance: 500, // Low insurance
      home_price: 400000, // Moderate home price
      down_payment_percent: 20,
      investment_return_rate: 5, // Non-zero investment return
      analysis_period_years: 5, // Sufficient period to observe
    };

    const results = calculateResults(testFormData);

    expect(results.yearlyTotalOwnershipCost).toBeDefined();
    expect(results.yearlyTotalRent).toBeDefined();
    expect(results.chartData.datasets[1].investments).toBeDefined(); // This is yearlyRenterInvestments

    const yearlyRenterInvestments = results.chartData.datasets[1].investments as number[];
    const monthlyInvestmentReturn = Math.pow(1 + testFormData.investment_return_rate / 100, 1/12) - 1;
    const annualInvestmentGrowthFactor = Math.pow(1 + monthlyInvestmentReturn, 12);

    let scenarioVerified = false;

    for (let i = 0; i < testFormData.analysis_period_years; i++) {
      const totalOwnershipCostThisYear = results.yearlyTotalOwnershipCost[i];
      const totalRentThisYear = results.yearlyTotalRent[i];
      
      if (totalRentThisYear > totalOwnershipCostThisYear) {
        const investmentAtStartOfYear = i === 0 
          ? testFormData.home_price * (testFormData.down_payment_percent / 100) // Initial downpayment equivalent
          : yearlyRenterInvestments[i-1];
        
        const expectedInvestmentAfterGrowthOnly = investmentAtStartOfYear * annualInvestmentGrowthFactor;
        const actualNetGrowthOrLossFromDifference = totalOwnershipCostThisYear - totalRentThisYear; // This will be negative
        const expectedInvestmentAtEndOfYear = expectedInvestmentAfterGrowthOnly + actualNetGrowthOrLossFromDifference;
        const actualInvestmentAtEndOfYear = yearlyRenterInvestments[i];

        // Check if the actual investment is close to the expected, considering the negative contribution
        expect(actualInvestmentAtEndOfYear).toBeCloseTo(expectedInvestmentAtEndOfYear);
        
        // More direct check: if rent is higher, investment should be less than if it just grew by returns
        expect(actualInvestmentAtEndOfYear).toBeLessThan(expectedInvestmentAfterGrowthOnly);
        scenarioVerified = true;
        // break; // Found a year, no need to check further for this specific test's purpose
      }
    }
    // Ensure that the scenario we wanted to test actually occurred.
    // If no year had rent > ownership, the test didn't verify the intended logic.
    expect(scenarioVerified).toBe(true, "Test setup did not result in a year where rent was greater than ownership costs.");
  });
}); 