'use client';

import { Container, Typography, Box, Paper, Divider, Link, Button, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useRouter } from 'next/navigation';

export default function FAQ() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Paper elevation={2} sx={{ p: { xs: 2, sm: 4 }, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" component="h1" gutterBottom>
            Rent vs Buy Calculator FAQ
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'primary.main' }}>
            Motivation
          </Typography>
          <Typography paragraph>
            The rent vs buy decision is one of the most significant financial choices many people make. Conventional 
            wisdom often suggests that "buying is always better than renting" or that "renting is throwing money away," 
            but the reality is much more nuanced and depends on numerous factors.
          </Typography>
          <Typography paragraph>
            This calculator was created to help you make an informed decision based on your specific financial situation 
            and local housing market. It considers factors that many simplified calculators ignore, such as opportunity costs, 
            home appreciation, maintenance costs, and the time value of money.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'primary.main' }}>
            Understanding the Inputs
          </Typography>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" fontWeight="bold">Property Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Home Price</Typography>
              <Typography paragraph>
                The current market value or purchase price of the home you're considering buying. This is the starting point for all calculations and affects mortgage payments, property taxes, and more.
              </Typography>
              
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Down Payment (%)</Typography>
              <Typography paragraph>
                The percentage of the home price you'll pay upfront. A higher down payment typically results in lower mortgage rates and monthly payments. Down payments under 20% often require private mortgage insurance (PMI), though this calculator doesn't currently factor in PMI costs.
              </Typography>
              
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Mortgage Rate (%)</Typography>
              <Typography paragraph>
                The annual interest rate on your mortgage loan. This rate significantly affects your monthly payment and total interest paid over time. Even small differences in mortgage rates can have a large impact on the long-term costs of homeownership.
              </Typography>
              
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Mortgage Term (years)</Typography>
              <Typography paragraph>
                The length of your mortgage loan in years. Common terms are 15 or 30 years. Shorter terms have higher monthly payments but lower total interest costs and faster equity building.
              </Typography>
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" fontWeight="bold">Ownership Costs</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Property Tax Rate (%)</Typography>
              <Typography paragraph>
                Annual property tax as a percentage of home value. This varies significantly by location and is typically paid monthly as part of your mortgage payment. The calculator assumes property taxes increase with home appreciation.
              </Typography>
              
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Annual Home Insurance</Typography>
              <Typography paragraph>
                Annual cost to insure your home against damage and liability. Usually required by mortgage lenders and can vary based on location, home value, and coverage levels.
              </Typography>
              
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Maintenance (%)</Typography>
              <Typography paragraph>
                Estimated annual cost for home repairs and maintenance as a percentage of home value. A common rule of thumb is 1% of home value per year, though this can vary based on the age and condition of the home. This includes both routine maintenance and occasional major repairs.
              </Typography>
              
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Agent Fee (%)</Typography>
              <Typography paragraph>
                Real estate agent commission when selling the home, typically 5-6% of the sale price. This is factored into the final net worth calculation as a selling cost at the end of the analysis period.
              </Typography>
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" fontWeight="bold">Renting & Investment</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Monthly Rent</Typography>
              <Typography paragraph>
                Monthly cost to rent a comparable property in the same area. This is the baseline cost for the renting scenario and should reflect current market rates for a similar property.
              </Typography>
              
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Rent Increase Rate (%)</Typography>
              <Typography paragraph>
                Expected annual percentage increase in rent. Historically, rent increases 3-5% per year on average, though this can vary significantly by location and market conditions.
              </Typography>
              
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Investment Return Rate (%)</Typography>
              <Typography paragraph>
                Expected annual return rate on investments for the money saved by renting versus buying. This is a key factor in the rent vs buy comparison as it represents the opportunity cost of the down payment and the potential investment of the difference between renting and buying costs.
              </Typography>
              
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Home Appreciation Rate (%)</Typography>
              <Typography paragraph>
                Expected annual increase in home value. This varies by location and market conditions. The historical average in the U.S. is around 3-4% per year, but can be higher or lower depending on the specific market.
              </Typography>
              
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Analysis Period (years)</Typography>
              <Typography paragraph>
                Number of years to compare the financial outcomes of renting versus buying. This should reflect your expected time horizon - how long you plan to live in the area or keep the property.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'primary.main' }}>
            The Algorithm
          </Typography>
          <Typography paragraph>
            The calculator uses a year-by-year simulation approach to compare the financial outcomes of renting versus buying:
          </Typography>
          
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            For the buying scenario:
          </Typography>
          <Typography component="div">
            <ul>
              <li>Calculates monthly mortgage payments based on the loan amount, interest rate, and term</li>
              <li>Tracks principal and interest portions of each payment to calculate equity buildup</li>
              <li>Includes property taxes, insurance, and maintenance costs</li>
              <li>Models home appreciation over time</li>
              <li>At the end of the analysis period, calculates financial position as home value minus remaining mortgage balance, minus selling costs (agent fees)</li>
            </ul>
          </Typography>
          
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            For the renting scenario:
          </Typography>
          <Typography component="div">
            <ul>
              <li>Models monthly rent payments with annual increases</li>
              <li>Invests the initial down payment amount at the specified investment return rate</li>
              <li>Invests the monthly difference between total homeownership costs and rent</li>
              <li>Compounds investment returns over time</li>
              <li>At the end of the analysis period, the renter's financial position is the total investment portfolio value</li>
            </ul>
          </Typography>
          
          <Typography paragraph sx={{ mt: 2 }}>
            The calculator also identifies the "crossover year" - the point at which one option becomes financially better than the other. This helps you understand if the timeframe of your decision affects which option is better.
          </Typography>
          
          <Typography paragraph sx={{ mt: 2, fontWeight: 'medium' }}>
            Unlike many simplified calculators, this tool accounts for <strong>all accumulated costs</strong> over the years, including ongoing expenses like maintenance, property taxes, insurance for homeowners, and rising rent for renters. This provides a more comprehensive and fair comparison of both options.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'primary.main' }}>
            Interpreting the Results
          </Typography>
          
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            The Chart:
          </Typography>
          <Typography paragraph>
            The main chart displays the financial position over time for both buying (blue) and renting (green). The point where these lines cross (if they do) is the "crossover year" - the point at which one option becomes better than the other. If the blue line ends up higher than the green line, buying is projected to be financially advantageous over the analysis period. If the green line ends higher, renting would be the better financial choice.
          </Typography>
          
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Year-by-Year Breakdown:
          </Typography>
          <Typography paragraph>
            Clicking on any point in the chart shows a detailed breakdown for that specific year, including:
          </Typography>
          <Typography component="div">
            <ul>
              <li><strong>For buying:</strong> Home value, remaining mortgage balance, equity, and cumulative costs (including maintenance, property taxes, and insurance)</li>
              <li><strong>For renting:</strong> Investment portfolio value, cumulative rent paid, and costs saved</li>
            </ul>
          </Typography>
          
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Final Summary:
          </Typography>
          <Typography paragraph>
            The final summary provides the difference in financial position at the end of the analysis period and indicates whether buying or renting comes out ahead financially. It also shows the crossover year if applicable.
          </Typography>
          
          <Typography paragraph>
            What makes this calculator particularly valuable is that the financial position comparison accounts for <strong>all accumulated costs over time</strong>. This includes often-overlooked expenses such as ongoing home maintenance, property taxes, insurance premiums, and rental increases, providing a much more accurate picture than simple mortgage vs. rent comparisons.
          </Typography>
          
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Important Considerations:
          </Typography>
          <Typography paragraph>
            The calculator provides a financial analysis, but there are non-financial factors to consider:
          </Typography>
          <Typography component="div">
            <ul>
              <li>Flexibility and mobility that comes with renting</li>
              <li>Pride of homeownership and ability to customize your living space</li>
              <li>Security of having fixed housing costs (with a fixed-rate mortgage) versus potentially rising rent</li>
              <li>Responsibilities of home maintenance</li>
              <li>Neighborhood factors and quality of life considerations</li>
            </ul>
          </Typography>
          
          <Typography paragraph sx={{ fontWeight: 'bold', mt: 2 }}>
            Remember that this calculator is a tool to help inform your decision, not make it for you. The results are based on assumptions and projections that may not perfectly match your actual experience.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'primary.main' }}>
            Open Source
          </Typography>
          <Typography paragraph>
            This calculator is open source software. The complete source code is available on GitHub at:{' '}
            <Link href="https://github.com/fenghaolw/rent-vs-buy-calculator" target="_blank" rel="noopener noreferrer">
              https://github.com/fenghaolw/rent-vs-buy-calculator
            </Link>
          </Typography>
          <Typography paragraph>
            If you encounter any bugs or have suggestions for improvements, please feel free to file an issue on the GitHub repository. 
            Contributions in the form of pull requests are also welcome!
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
} 