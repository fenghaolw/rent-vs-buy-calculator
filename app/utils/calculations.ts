import { FormData, CalculationResults } from '../types';

export const calculateMonthlyMortgage = (loanAmount: number, monthlyRate: number, numPayments: number) => {
  return loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
};

export const calculateRemainingPrincipal = (loanAmount: number, monthlyRate: number, monthlyPayment: number, months: number) => {
  const remaining = new Array(months + 1);
  remaining[0] = loanAmount;
  
  for (let i = 1; i <= months; i++) {
    const interestPayment = remaining[i-1] * monthlyRate;
    const principalPayment = Math.min(monthlyPayment - interestPayment, remaining[i-1]);
    remaining[i] = remaining[i-1] - principalPayment;
  }
  
  return remaining;
};

export const calculateResults = (formData: FormData): CalculationResults => {
  // Constants
  const PROPERTY_TAX_ANNUAL_INCREASE = 0.02; // 2% annual increase for property tax (CA prop 13)
  const INFLATION_RATE = 0.02; // 2% for insurance and maintenance cost growth

  // --- SETUP ---
  const months = formData.analysis_period_years * 12;
  const timePoints = Array.from({ length: months + 1 }, (_, i) => i);
  const monthlyInvestmentReturn = Math.pow(1 + formData.investment_return_rate / 100, 1/12) - 1;
  const downPayment = formData.home_price * (formData.down_payment_percent / 100);
  
  // --- MORTGAGE CALCULATIONS ---
  const loanAmount = formData.home_price * (1 - formData.down_payment_percent / 100);
  const monthlyRate = formData.mortgage_rate / 100 / 12;
  const numPayments = formData.mortgage_term_years * 12;
  const monthlyMortgage = calculateMonthlyMortgage(loanAmount, monthlyRate, numPayments);
  const remainingPrincipal = calculateRemainingPrincipal(loanAmount, monthlyRate, monthlyMortgage, months);
  
  // --- HOME PRICE APPRECIATION ---
  const monthlyAppreciationRate = Math.pow(1 + formData.home_appreciation_rate / 100, 1/12) - 1;
  const homeValues = new Array(months + 1);
  homeValues[0] = formData.home_price;
  for (let i = 1; i <= months; i++) {
    homeValues[i] = homeValues[i-1] * (1 + monthlyAppreciationRate);
  }
  
  // --- MONTHLY HOUSING COSTS OVER TIME ---
  const monthlyHousingCosts = new Array(months + 1);
  const propertyTaxes = new Array(months + 1);
  const maintenanceCosts = new Array(months + 1);
  const insuranceCosts = new Array(months + 1);
  
  // Calculate initial monthly values
  propertyTaxes[0] = (formData.home_price * (formData.property_tax_rate / 100)) / 12;
  maintenanceCosts[0] = (formData.home_price * (formData.maintenance_percent / 100)) / 12;
  insuranceCosts[0] = formData.home_insurance / 12;
  monthlyHousingCosts[0] = propertyTaxes[0] + maintenanceCosts[0] + insuranceCosts[0];
  
  const monthlyPropTaxIncrease = Math.pow(1 + PROPERTY_TAX_ANNUAL_INCREASE, 1/12) - 1;
  const monthlyInflationRate = Math.pow(1 + INFLATION_RATE, 1/12) - 1;
  
  for (let i = 1; i <= months; i++) {
    // Property tax increases at fixed rate (2% annually in CA)
    propertyTaxes[i] = propertyTaxes[i-1] * (1 + monthlyPropTaxIncrease);
    
    // Maintenance cost increases with inflation, but also scales with home value
    // This balances between inflation growth and the fact that maintaining a more expensive home costs more
    maintenanceCosts[i] = (formData.home_price * (formData.maintenance_percent / 100) / 12) * 
                          Math.pow(1 + monthlyInflationRate, i);
    
    // Insurance costs increase with inflation
    insuranceCosts[i] = insuranceCosts[i-1] * (1 + monthlyInflationRate);
    
    // Total monthly cost for owning (excluding mortgage principal & interest)
    monthlyHousingCosts[i] = propertyTaxes[i] + maintenanceCosts[i] + insuranceCosts[i];
  }
  
  // --- RENT INCREASES OVER TIME ---
  const monthlyRentIncrease = Math.pow(1 + formData.rent_increase_rate / 100, 1/12) - 1;
  const monthlyRent = new Array(months + 1);
  monthlyRent[0] = formData.rent_amount;
  for (let i = 1; i <= months; i++) {
    monthlyRent[i] = monthlyRent[i-1] * (1 + monthlyRentIncrease);
  }
  
  // --- BUYER SCENARIO ---
  const buyerCashFlow = new Array(months + 1);
  const buyerAccumulatedCosts = new Array(months + 1);
  const buyerEquity = new Array(months + 1);
  const buyerInvestments = new Array(months + 1);
  const buyerFinancialPosition = new Array(months + 1);
  
  // Initial values
  buyerCashFlow[0] = -downPayment; // Initial down payment
  buyerAccumulatedCosts[0] = downPayment; // Initial cost is down payment
  buyerEquity[0] = downPayment; // Initial equity is the down payment
  buyerInvestments[0] = 0; // No investments initially
  
  // Calculate initial selling costs (if the property was sold immediately)
  const initialSellingCosts = homeValues[0] * (formData.agent_fee_percent / 100);
  
  // Financial position at time 0 should account for accumulated costs and selling costs
  buyerFinancialPosition[0] = buyerEquity[0] + buyerInvestments[0] - buyerAccumulatedCosts[0] - initialSellingCosts;
  
  for (let i = 1; i <= months; i++) {
    // Monthly cash flow for buyer = -(mortgage + housing costs)
    const totalOwnershipCost = monthlyMortgage + monthlyHousingCosts[i];
    buyerCashFlow[i] = -totalOwnershipCost;
    
    // Accumulate all costs paid so far (down payment + monthly costs)
    buyerAccumulatedCosts[i] = buyerAccumulatedCosts[i-1] + totalOwnershipCost;
    
    // Home equity = home value - remaining principal
    buyerEquity[i] = homeValues[i] - remainingPrincipal[i];
    
    // Update investments (no additional investments for the buyer in the standard model)
    buyerInvestments[i] = buyerInvestments[i-1] * (1 + monthlyInvestmentReturn);
    
    // Calculate potential selling costs at this point in time
    const sellingCosts = homeValues[i] * (formData.agent_fee_percent / 100);
    
    // Financial position = home equity + investments - accumulated costs - selling costs
    // This represents what the buyer would net if they sold at this point
    buyerFinancialPosition[i] = buyerEquity[i] + buyerInvestments[i] - buyerAccumulatedCosts[i] - sellingCosts;
  }
  
  // --- RENTER SCENARIO ---
  const renterCashFlow = new Array(months + 1);
  const renterAccumulatedCosts = new Array(months + 1);
  const renterInvestments = new Array(months + 1);
  const renterFinancialPosition = new Array(months + 1);
  
  // Initial values
  renterCashFlow[0] = 0; // No initial cash flow
  renterAccumulatedCosts[0] = 0; // No accumulated costs initially
  renterInvestments[0] = downPayment; // Initial investment is downpayment equivalent
  renterFinancialPosition[0] = downPayment; // Initially, financial position is just the investments
  
  for (let i = 1; i <= months; i++) {
    // Monthly cash flow for renter = -rent
    renterCashFlow[i] = -monthlyRent[i];
    
    // Accumulate rent costs
    renterAccumulatedCosts[i] = renterAccumulatedCosts[i-1] + monthlyRent[i];
    
    // Grow the previous month's investments
    renterInvestments[i] = renterInvestments[i-1] * (1 + monthlyInvestmentReturn);
    
    // Add the difference between total ownership cost and rent to investments
    // If rent < total cost of ownership, the renter can invest the difference.
    // If rent > total cost of ownership, this will be negative, reducing the investment.
    const additionalInvestment = monthlyMortgage + monthlyHousingCosts[i] - monthlyRent[i];
    renterInvestments[i] += additionalInvestment;
    
    // Financial position = investments - accumulated costs
    renterFinancialPosition[i] = renterInvestments[i] - renterAccumulatedCosts[i];
  }
  
  // Calculate crossover point (in months)
  let crossoverMonth = null;
  for (let i = 0; i < timePoints.length; i++) {
    if (buyerFinancialPosition[i] > renterFinancialPosition[i]) {
      crossoverMonth = i;
      break;
    }
  }
  
  // Calculate crossover year (1-based instead of 0-based)
  const crossoverYear = crossoverMonth ? Math.max(1, crossoverMonth / 12) : null;
  
  // Ensure we have exactly one data point per year
  const numYears = formData.analysis_period_years;
  
  // Generate exact arrays of length matching our year range (1 to analysis_period_years)
  const yearlyBuyerData = new Array(numYears);
  const yearlyRenterData = new Array(numYears);
  const yearlyBuyerEquity = new Array(numYears);
  const yearlyBuyerInvestments = new Array(numYears);
  const yearlyBuyerCosts = new Array(numYears);
  const yearlyBuyerSellingCosts = new Array(numYears);
  const yearlyRenterInvestments = new Array(numYears);
  const yearlyRenterCosts = new Array(numYears);
  const yearlyHomeValues = new Array(numYears);
  const yearlyRemainingMortgage = new Array(numYears);
  const yearlyTotalOwnershipCost = new Array(numYears); // Added
  const yearlyTotalRent = new Array(numYears);         // Added
  
  // Populate with data from years 1 through analysis_period_years
  for (let year = 1; year <= numYears; year++) {
    const monthIndex = year * 12;
    const arrayIndex = year - 1; // Convert to 0-based index for arrays
    
    // Buy scenario data
    yearlyBuyerData[arrayIndex] = buyerFinancialPosition[monthIndex];
    yearlyBuyerEquity[arrayIndex] = buyerEquity[monthIndex];
    yearlyBuyerInvestments[arrayIndex] = buyerInvestments[monthIndex];
    yearlyBuyerCosts[arrayIndex] = buyerAccumulatedCosts[monthIndex];
    yearlyBuyerSellingCosts[arrayIndex] = homeValues[monthIndex] * (formData.agent_fee_percent / 100);
    yearlyHomeValues[arrayIndex] = homeValues[monthIndex];
    yearlyRemainingMortgage[arrayIndex] = remainingPrincipal[monthIndex];
    
    // Rent scenario data
    yearlyRenterData[arrayIndex] = renterFinancialPosition[monthIndex];
    yearlyRenterInvestments[arrayIndex] = renterInvestments[monthIndex];
    yearlyRenterCosts[arrayIndex] = renterAccumulatedCosts[monthIndex];

    // Calculate yearly total ownership cost and rent for this year
    let currentYearTotalOwnershipCost = 0;
    let currentYearTotalRent = 0;
    for (let m = 1; m <= 12; m++) {
      const currentMonthIndex = (year - 1) * 12 + m;
      currentYearTotalOwnershipCost += (monthlyMortgage + monthlyHousingCosts[currentMonthIndex]);
      currentYearTotalRent += monthlyRent[currentMonthIndex];
    }
    yearlyTotalOwnershipCost[arrayIndex] = currentYearTotalOwnershipCost;
    yearlyTotalRent[arrayIndex] = currentYearTotalRent;
  }
  
  // Prepare chart data with yearly points from 1 to analysis_period_years
  const chartData = {
    labels: Array.from({ length: numYears }, (_, i) => i + 1),
    datasets: [
      {
        label: 'Buy',
        data: yearlyBuyerData,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.1,
        // Custom properties for tooltip
        homeEquity: yearlyBuyerEquity,
        investments: yearlyBuyerInvestments,
        accumulatedCosts: yearlyBuyerCosts,
        sellingCosts: yearlyBuyerSellingCosts,
        homeValues: yearlyHomeValues,
        remainingMortgage: yearlyRemainingMortgage
      },
      {
        label: 'Rent',
        data: yearlyRenterData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.1,
        // Custom properties for tooltip
        investments: yearlyRenterInvestments,
        accumulatedCosts: yearlyRenterCosts
      }
    ]
  };
  
  return {
    chartData,
    crossover_year: crossoverYear,
    final_buy_net_worth: buyerFinancialPosition[months],
    final_rent_net_worth: renterFinancialPosition[months],
    maintenanceCosts: maintenanceCosts,
    yearlyTotalOwnershipCost: yearlyTotalOwnershipCost, // Added
    yearlyTotalRent: yearlyTotalRent                   // Added
  };
}; 