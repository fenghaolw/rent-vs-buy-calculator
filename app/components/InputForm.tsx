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
                <TextField
                  fullWidth
                  label="Home Price"
                  name="home_price"
                  type="number"
                  variant="outlined"
                  size="small"
                  value={formData.home_price}
                  onChange={onInputChange}
                  InputProps={{ inputProps: { min: 0 } }}
                />

                <TextField
                  fullWidth
                  label="Down Payment (%)"
                  name="down_payment_percent"
                  type="number"
                  variant="outlined"
                  size="small"
                  value={formData.down_payment_percent}
                  onChange={onInputChange}
                  InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
                />

                <TextField
                  fullWidth
                  label="Mortgage Rate (%)"
                  name="mortgage_rate"
                  type="number"
                  variant="outlined"
                  size="small"
                  value={formData.mortgage_rate}
                  onChange={onInputChange}
                  InputProps={{ inputProps: { min: 0, step: 0.1 } }}
                />

                <TextField
                  fullWidth
                  label="Mortgage Term (years)"
                  name="mortgage_term_years"
                  type="number"
                  variant="outlined"
                  size="small"
                  value={formData.mortgage_term_years}
                  onChange={onInputChange}
                  InputProps={{ inputProps: { min: 1 } }}
                />
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="primary" gutterBottom sx={{ mt: 1 }}>
                Ownership Costs
              </Typography>
              <Divider />
              
              <Stack spacing={2} sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Property Tax Rate (%)"
                  name="property_tax_rate"
                  type="number"
                  variant="outlined"
                  size="small"
                  value={formData.property_tax_rate}
                  onChange={onInputChange}
                  InputProps={{ inputProps: { min: 0, step: 0.001 } }}
                />

                <TextField
                  fullWidth
                  label="Annual Home Insurance"
                  name="home_insurance"
                  type="number"
                  variant="outlined"
                  size="small"
                  value={formData.home_insurance}
                  onChange={onInputChange}
                  InputProps={{ inputProps: { min: 0 } }}
                />

                <TextField
                  fullWidth
                  label="Maintenance (% of home value)"
                  name="maintenance_percent"
                  type="number"
                  variant="outlined"
                  size="small"
                  value={formData.maintenance_percent}
                  onChange={onInputChange}
                  InputProps={{ inputProps: { min: 0, step: 0.1 } }}
                />

                <TextField
                  fullWidth
                  label="Agent Fee (%)"
                  name="agent_fee_percent"
                  type="number"
                  variant="outlined"
                  size="small"
                  value={formData.agent_fee_percent}
                  onChange={onInputChange}
                  InputProps={{ inputProps: { min: 0, step: 0.1 } }}
                />
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="primary" gutterBottom sx={{ mt: 1 }}>
                Renting & Investment
              </Typography>
              <Divider />
              
              <Stack spacing={2} sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Monthly Rent"
                  name="rent_amount"
                  type="number"
                  variant="outlined"
                  size="small"
                  value={formData.rent_amount}
                  onChange={onInputChange}
                  InputProps={{ inputProps: { min: 0 } }}
                />

                <TextField
                  fullWidth
                  label="Rent Increase Rate (%)"
                  name="rent_increase_rate"
                  type="number"
                  variant="outlined"
                  size="small"
                  value={formData.rent_increase_rate}
                  onChange={onInputChange}
                  InputProps={{ inputProps: { min: 0, step: 0.1 } }}
                />

                <TextField
                  fullWidth
                  label="Investment Return Rate (%)"
                  name="investment_return_rate"
                  type="number"
                  variant="outlined"
                  size="small"
                  value={formData.investment_return_rate}
                  onChange={onInputChange}
                  InputProps={{ inputProps: { min: 0, step: 0.1 } }}
                />

                <TextField
                  fullWidth
                  label="Home Appreciation Rate (%)"
                  name="home_appreciation_rate"
                  type="number"
                  variant="outlined"
                  size="small"
                  value={formData.home_appreciation_rate}
                  onChange={onInputChange}
                  InputProps={{ inputProps: { min: 0, step: 0.1 } }}
                />

                <TextField
                  fullWidth
                  label="Analysis Period (years)"
                  name="analysis_period_years"
                  type="number"
                  variant="outlined"
                  size="small"
                  value={formData.analysis_period_years}
                  onChange={onInputChange}
                  InputProps={{ inputProps: { min: 1 } }}
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