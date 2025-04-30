# Rent vs Buy Calculator

An interactive web application that helps users compare the long-term financial implications of renting versus buying a home. This calculator provides detailed visualizations and breakdowns of costs over time.

Mostly generated via vibe coding in Cursor (https://www.cursor.com/), with claude 3.7-sonnet model.

## Features

- **Interactive Comparison**: Visualize the financial position of renting vs buying over time
- **Detailed Breakdowns**: See year-by-year financial positions with mortgage and investment details
- **Customizable Assumptions**: Adjust all parameters (mortgage rates, property taxes, investment returns, etc.)
- **URL Parameter Sharing**: Share your calculations via URL
- **Preset Scenarios**: Choose from common financial scenarios or create your own
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Mode**: Choose your preferred color theme
- **Interactive Charts**: Click on chart points to see detailed year-specific information

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **UI Library**: Material UI v7 with optimized Next.js integration
- **Charts**: Chart.js with react-chartjs-2
- **Styling**: Emotion (MUI's styling solution)
- **Optimizations**:
  - Dynamic imports and code splitting
  - Tree-shaking for Chart.js
  - CSS optimization with critters
  - Bundle analysis

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm 9.6.0 or later

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/rent-vs-buy.git
   cd rent-vs-buy/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser

## Build and Deployment

### Production Build

```bash
npm run build
npm start
```

### Analyze Bundle

```bash
npm run analyze
```

## Usage

1. Enter your assumptions in the input form (home price, down payment, mortgage details, etc.)
2. Click "Calculate" to see the comparison
3. View the chart showing the financial positions over time
4. Click on specific years in the chart to see detailed breakdowns
5. Share your calculation by copying the URL

## Input Field Explanations

### Property Details
- **Home Price**: The purchase price of the home in dollars
- **Down Payment (%)**: Percentage of the home price you'll pay upfront (affects loan amount and monthly payment)
- **Mortgage Rate (%)**: Annual interest rate on your mortgage loan
- **Mortgage Term (years)**: Length of the mortgage loan (typically 15 or 30 years)

### Ownership Costs
- **Property Tax Rate (%)**: Annual property tax as a percentage of home value (varies by location)
- **Annual Home Insurance**: Yearly cost to insure your home against damage
- **Maintenance (% of home value)**: Estimated annual maintenance costs as a percentage of home value
- **Agent Fee (%)**: Real estate agent commission when selling the home (typically 5-6%)

### Renting & Investment
- **Monthly Rent**: Amount paid monthly to rent a comparable property
- **Rent Increase Rate (%)**: Expected annual percentage increase in rent
- **Investment Return Rate (%)**: Expected annual return on investments (for down payment and monthly savings)
- **Home Appreciation Rate (%)**: Expected annual percentage increase in home value
- **Analysis Period (years)**: Number of years to analyze the rent vs buy comparison

The calculator takes these inputs to simulate two scenarios:
1. **Buying**: Taking a mortgage, paying property tax, insurance, and maintenance, while building equity
2. **Renting**: Paying rent while investing the equivalent of the down payment plus the difference between monthly rent and the total monthly cost of owning

The financial position for each scenario is calculated year by year, accounting for home appreciation, investment returns, mortgage payments, and all associated costs.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Created as a tool to help people make informed housing decisions
- Inspired by the complex financial trade-offs between renting and buying
