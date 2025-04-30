'use client';

import { FormData } from '../types';
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  IconButton,
  SelectChangeEvent,
  useMediaQuery,
  useTheme
} from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { presets, Preset } from '../data/presets';

// Tooltip explanations for each input field
const tooltips = {
  home_price: "The current market value or purchase price of the home you're considering buying.",
  down_payment_percent: "Percentage of the home price you plan to pay upfront. Higher down payments typically result in lower mortgage rates and monthly payments.",
  mortgage_rate: "Annual interest rate on your mortgage loan. This rate significantly affects your monthly payment and total interest paid over time.",
  mortgage_term_years: "Length of your mortgage loan in years. Common terms are 15 or 30 years. Shorter terms have higher monthly payments but lower total interest costs.",
  
  property_tax_rate: "Annual property tax as a percentage of home value. This varies significantly by location and is typically paid monthly as part of your mortgage payment.",
  home_insurance: "Annual cost to insure your home against damage and liability. Usually required by mortgage lenders.",
  maintenance_percent: "Estimated annual cost for home repairs and maintenance as a percentage of home value. A common rule of thumb is 1% of home value per year.",
  agent_fee_percent: "Real estate agent commission when selling the home, typically 5-6% of the sale price.",
  
  rent_amount: "Monthly cost to rent a comparable property in the same area.",
  rent_increase_rate: "Expected annual percentage increase in rent. Historically, rent increases 3-5% per year on average.",
  investment_return_rate: "Expected annual return rate on investments for the money saved by renting versus buying.",
  home_appreciation_rate: "Expected annual increase in home value. This varies by location and market conditions.",
  analysis_period_years: "Number of years to compare the financial outcomes of renting versus buying."
};

// Helper component for field with tooltip
const FieldWithTooltip = ({ 
  name, 
  label, 
  value, 
  onChange, 
  inputProps = {} 
}: { 
  name: string, 
  label: string, 
  value: any, 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, 
  inputProps?: any 
}) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <TextField
      fullWidth
      label={label}
      name={name}
      type="number"
      variant="outlined"
      size="small"
      value={value}
      onChange={onChange}
      InputProps={{ inputProps }}
    />
    <Tooltip title={tooltips[name as keyof typeof tooltips]} arrow placement="right">
      <IconButton size="small" sx={{ p: 0 }}>
        <InfoOutlinedIcon fontSize="small" color="action" />
      </IconButton>
    </Tooltip>
  </Box>
);

interface InputFormProps {
  formData: FormData;
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onPresetSelect: (preset: FormData, presetId?: string) => void;
  selectedPresetId?: string;
}

export default function InputForm({ 
  formData, 
  isLoading, 
  onInputChange, 
  onSubmit, 
  onPresetSelect, 
  selectedPresetId = '' 
}: InputFormProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const handlePresetChange = (event: SelectChangeEvent) => {
    const selectedPresetId = event.target.value;
    const selectedPreset = presets.find(preset => preset.id === selectedPresetId);
    if (selectedPreset) {
      onPresetSelect(selectedPreset.data, selectedPreset.id);
    }
  };

  return (
    <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ p: 3, flexGrow: 1, overflow: 'auto' }}>
        {/* Don't show title on mobile view - it's in the toggle header */}
        {!isMobile && <Typography variant="h6" gutterBottom>Input Assumptions</Typography>}
        
        {/* Preset Selector */}
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="preset-select-label">Presets</InputLabel>
            <Select
              labelId="preset-select-label"
              id="preset-select"
              label="Presets"
              onChange={handlePresetChange}
              value={selectedPresetId}
              defaultValue=""
            >
              <MenuItem value="" disabled>
                <em>Select a preset</em>
              </MenuItem>
              {presets.map((preset) => (
                <MenuItem key={preset.id} value={preset.id}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <Typography variant="body2">{preset.name}</Typography>
                    <Tooltip title={preset.description} arrow placement="right">
                      <IconButton size="small" sx={{ ml: 1, p: 0 }}>
                        <InfoOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        <form onSubmit={onSubmit} style={{ height: '100%' }}>
          <Stack spacing={isMobile ? 2 : 3} sx={{ pb: 2 }}>
            <Box>
              <Typography variant="subtitle2" color="primary" gutterBottom sx={{ mt: 1 }}>
                Property Details
              </Typography>
              <Divider />
              
              <Stack spacing={2} sx={{ mt: 2 }}>
                <FieldWithTooltip
                  name="home_price"
                  label="Home Price"
                  value={formData.home_price}
                  onChange={onInputChange}
                  inputProps={{ min: 0 }}
                />

                <FieldWithTooltip
                  name="down_payment_percent"
                  label="Down Payment (%)"
                  value={formData.down_payment_percent}
                  onChange={onInputChange}
                  inputProps={{ min: 0, max: 100, step: 0.1 }}
                />

                <FieldWithTooltip
                  name="mortgage_rate"
                  label="Mortgage Rate (%)"
                  value={formData.mortgage_rate}
                  onChange={onInputChange}
                  inputProps={{ min: 0, step: 0.1 }}
                />

                <FieldWithTooltip
                  name="mortgage_term_years"
                  label="Mortgage Term (years)"
                  value={formData.mortgage_term_years}
                  onChange={onInputChange}
                  inputProps={{ min: 1 }}
                />
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="primary" gutterBottom sx={{ mt: 1 }}>
                Ownership Costs
              </Typography>
              <Divider />
              
              <Stack spacing={2} sx={{ mt: 2 }}>
                <FieldWithTooltip
                  name="property_tax_rate"
                  label="Property Tax Rate (%)"
                  value={formData.property_tax_rate}
                  onChange={onInputChange}
                  inputProps={{ min: 0, step: 0.001 }}
                />

                <FieldWithTooltip
                  name="home_insurance"
                  label="Annual Home Insurance"
                  value={formData.home_insurance}
                  onChange={onInputChange}
                  inputProps={{ min: 0 }}
                />

                <FieldWithTooltip
                  name="maintenance_percent"
                  label="Maintenance (% of home value)"
                  value={formData.maintenance_percent}
                  onChange={onInputChange}
                  inputProps={{ min: 0, step: 0.1 }}
                />

                <FieldWithTooltip
                  name="agent_fee_percent"
                  label="Agent Fee (%)"
                  value={formData.agent_fee_percent}
                  onChange={onInputChange}
                  inputProps={{ min: 0, step: 0.1 }}
                />
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="primary" gutterBottom sx={{ mt: 1 }}>
                Renting & Investment
              </Typography>
              <Divider />
              
              <Stack spacing={2} sx={{ mt: 2 }}>
                <FieldWithTooltip
                  name="rent_amount"
                  label="Monthly Rent"
                  value={formData.rent_amount}
                  onChange={onInputChange}
                  inputProps={{ min: 0 }}
                />

                <FieldWithTooltip
                  name="rent_increase_rate"
                  label="Rent Increase Rate (%)"
                  value={formData.rent_increase_rate}
                  onChange={onInputChange}
                  inputProps={{ min: 0, step: 0.1 }}
                />

                <FieldWithTooltip
                  name="investment_return_rate"
                  label="Investment Return Rate (%)"
                  value={formData.investment_return_rate}
                  onChange={onInputChange}
                  inputProps={{ min: 0, step: 0.1 }}
                />

                <FieldWithTooltip
                  name="home_appreciation_rate"
                  label="Home Appreciation Rate (%)"
                  value={formData.home_appreciation_rate}
                  onChange={onInputChange}
                  inputProps={{ min: 0, step: 0.1 }}
                />

                <FieldWithTooltip
                  name="analysis_period_years"
                  label="Analysis Period (years)"
                  value={formData.analysis_period_years}
                  onChange={onInputChange}
                  inputProps={{ min: 1 }}
                />
              </Stack>
            </Box>
          </Stack>
          
          {/* Only show button if we're not on mobile or if on mobile and expanded */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isLoading}
            startIcon={<CalculateIcon />}
            sx={{ mt: 2 }}
          >
            {isLoading ? 'Calculating...' : 'Calculate'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 