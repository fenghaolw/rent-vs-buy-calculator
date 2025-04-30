'use client';

import { 
  Typography, 
  Box, 
  Divider, 
  Stack,
  Tooltip,
  IconButton
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ApartmentIcon from '@mui/icons-material/Apartment';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface YearData {
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
}

export interface ResultsSummaryProps {
  crossoverYear: number | null;
  finalBuyNetWorth: number;
  finalRentNetWorth: number;
  analysisYears: number;
  selectedYearData?: YearData | null;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
};

export default function ResultsSummary({ 
  crossoverYear, 
  finalBuyNetWorth, 
  finalRentNetWorth, 
  analysisYears,
  selectedYearData
}: ResultsSummaryProps) {

  // If we have selected year data, show the year-specific summary
  if (selectedYearData) {
    const { year, buyData, rentData } = selectedYearData;
    const difference = buyData.financialPosition - rentData.financialPosition;
    const betterOption = difference > 0 ? 'Buying' : 'Renting';
    const absDifference = Math.abs(difference);
    
    return (
      <Stack spacing={1.5} sx={{ 
        '& .MuiTypography-root': {
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          overflow: 'hidden'
        }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="body2" fontWeight="medium">
            {betterOption} is better by {formatCurrency(absDifference)}
          </Typography>
          <Tooltip title="Click anywhere outside the chart to return to the final summary">
            <IconButton size="small">
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        
        <Divider sx={{ my: 0.5 }} />
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mt: 0.5 }}>
          <Box sx={{ 
            flex: 1, 
            p: 1.5, 
            bgcolor: 'success.light', 
            borderRadius: 1,
            overflow: 'hidden',
            '& .MuiTypography-root': {
              whiteSpace: 'normal',
              wordBreak: 'break-word'
            }
          }}>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
              Buy: {formatCurrency(buyData.financialPosition)}
            </Typography>
            <Stack spacing={0.5}>
              <Typography variant="body2" fontSize="0.875rem">
                Equity: {formatCurrency(buyData.equity)}
              </Typography>
              <Typography variant="body2" sx={{ pl: 1.5, fontSize: '0.8rem' }}>
                Value: {formatCurrency(buyData.homeValue)}
              </Typography>
              <Typography variant="body2" sx={{ pl: 1.5, fontSize: '0.8rem' }}>
                Mortgage: {formatCurrency(buyData.mortgage)}
              </Typography>
              <Typography variant="body2" fontSize="0.875rem">
                Costs: {formatCurrency(buyData.costs)}
              </Typography>
            </Stack>
          </Box>
          <Box sx={{ 
            flex: 1, 
            p: 1.5, 
            bgcolor: 'primary.light', 
            borderRadius: 1,
            overflow: 'hidden',
            '& .MuiTypography-root': {
              whiteSpace: 'normal',
              wordBreak: 'break-word'
            }
          }}>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
              Rent: {formatCurrency(rentData.financialPosition)}
            </Typography>
            <Stack spacing={0.5}>
              <Typography variant="body2" fontSize="0.875rem">
                Investments: {formatCurrency(rentData.investments)}
              </Typography>
              <Typography variant="body2" fontSize="0.875rem">
                Rent Paid: {formatCurrency(rentData.costs)}
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Stack>
    );
  }

  // Otherwise, show the final summary
  const difference = Math.abs(finalBuyNetWorth - finalRentNetWorth);
  const percentDifference = ((difference / Math.min(finalBuyNetWorth, finalRentNetWorth)) * 100).toFixed(1);
  const betterOption = finalBuyNetWorth > finalRentNetWorth ? 'Buying' : 'Renting';
  
  return (
    <Stack spacing={1.5} sx={{ 
      '& .MuiTypography-root': {
        whiteSpace: 'normal',
        wordBreak: 'break-word',
        overflow: 'hidden'
      }
    }}>
      {crossoverYear && (
        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Crossover: {crossoverYear.toFixed(1)} years
          </Typography>
          <Divider />
        </Box>
      )}
      
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
          After {analysisYears} years:
        </Typography>
        <Typography variant="body1" fontWeight="medium" color="primary">
          {betterOption} is better by {formatCurrency(difference)} ({percentDifference}%)
        </Typography>
        <Divider sx={{ mt: 1 }} />
      </Box>
      
      <Box>
        <Stack spacing={1} sx={{ mt: 0.5 }}>
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
} 