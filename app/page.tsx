'use client';

import { useState, useMemo, useCallback, Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import InputForm from './components/InputForm';
import Results from './components/Results';
import ThemeToggle from './components/ThemeToggle';
import { calculateResults } from './utils/calculations';
import { encodeFormData } from './utils/urlEncoder';
import { FormData } from './types';
import { Container, Typography, Paper, Box, useMediaQuery, useTheme, AppBar, Toolbar, Button, Snackbar, IconButton, Collapse, Tooltip } from '@mui/material';
import { presets } from './data/presets';
import ShareIcon from '@mui/icons-material/Share';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import UrlParamsHandler from './components/UrlParamsHandler';

export default function Home() {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [inputsExpanded, setInputsExpanded] = useState(false);
  
  useEffect(() => {
    setInputsExpanded(!isMobile);
  }, [isMobile]);

  const [formData, setFormData] = useState<FormData>({
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
  });

  const [results, setResults] = useState<ReturnType<typeof calculateResults> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');

  // Helper function to calculate results
  const calculateAndSetResults = (data: FormData) => {
    setIsLoading(true);
    const calculatedResults = calculateResults(data);
    setResults(calculatedResults);
    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Allow empty string for input clearing
    if (value === '') {
      setFormData(prev => ({
        ...prev,
        [name]: '',
      }));
      return;
    }
    
    // Parse as float and check if it's a valid number
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setFormData(prev => ({
        ...prev,
        [name]: numValue,
      }));
    }
  };

  const handlePresetSelect = (presetData: FormData, presetId?: string) => {
    setFormData(presetData);
    
    // Update selected preset ID
    if (presetId) {
      setSelectedPresetId(presetId);
    }
    
    // Calculate and update results
    calculateAndSetResults(presetData);
    
    // Update URL with form data and preset ID if available
    updateURL(presetData, presetId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate results first
    setIsLoading(true);
    const calculatedResults = calculateResults(formData);
    
    // Update URL with query parameters
    updateURL(formData);
    
    // Finally, update the results state (only do this once)
    setResults(calculatedResults);
    setIsLoading(false);
  };
  
  // Function to update URL with form data as query parameters
  const updateURL = (data: FormData, presetId?: string) => {
    // Use the encoder to get a shorter URL string
    const encodedParams = encodeFormData(data, presetId);
    
    // Update the URL without causing a page refresh
    const url = `${window.location.pathname}?${encodedParams}`;
    window.history.pushState({ path: url }, '', url);
  };

  // Function to handle URL sharing
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        setSnackbarOpen(true);
      })
      .catch(err => {
        console.error('Failed to copy URL: ', err);
      });
  };

  const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  // Calculate a consistent height for the containers
  const CONTENT_HEIGHT = 'auto';

  // State to track the selected year for detailed view
  const [selectedYearIndex, setSelectedYearIndex] = useState<number | null>(null);

  // Handler for year selection from chart, wrapped in useCallback
  const handleYearSelect = useCallback((yearIndex: number | null) => {
    setSelectedYearIndex(yearIndex);
  }, []);
  
  // Only create chart component when results exist
  const chartComponent = useMemo(() => {
    if (!results) return null;
    
    // Dynamically import Results.Chart with code splitting
    const ResultsChart = () => (
      <Suspense fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Typography>Loading chart...</Typography>
        </Box>
      }>
        <Results.Chart 
          chartData={results.chartData} 
          onYearSelect={handleYearSelect}
        />
      </Suspense>
    );
    
    return <ResultsChart />;
  }, [results, handleYearSelect]);

  // Memoize the summary component as well
  const summaryComponent = useMemo(() => {
    if (!results) return null;
    
    return (
      <Results.Summary 
        crossoverYear={results.crossover_year}
        finalBuyNetWorth={results.final_buy_net_worth}
        finalRentNetWorth={results.final_rent_net_worth}
        analysisYears={formData.analysis_period_years}
        chartData={results.chartData}
        selectedYearIndex={selectedYearIndex}
      />
    );
  }, [results, formData.analysis_period_years, selectedYearIndex]);

  // Handlers for the UrlParamsHandler
  const handleFormDataUpdate = useCallback((data: FormData) => {
    setFormData(data);
  }, []);

  const handleResultsUpdate = useCallback((calculatedResults: any) => {
    setResults(calculatedResults);
  }, []);

  const handlePresetIdUpdate = useCallback((presetId: string) => {
    setSelectedPresetId(presetId);
  }, []);

  return (
    <Box sx={{ 
      backgroundColor: 'background.default', 
      minHeight: '100vh', 
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Wrap useSearchParams in Suspense boundary */}
      <Suspense fallback={null}>
        <UrlParamsHandler 
          formData={formData}
          onFormDataUpdate={handleFormDataUpdate}
          onResultsUpdate={handleResultsUpdate}
          onPresetSelect={handlePresetIdUpdate}
        />
      </Suspense>

      {/* App Bar with Theme Toggle */}
      <AppBar position="static" color="default" elevation={1} sx={{ backgroundColor: 'background.paper' }}>
        <Toolbar>
          <Typography variant="h5" component="h1" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Rent vs Buy Calculator
          </Typography>
          <Button 
            color="primary"
            onClick={() => router.push('/faq')}
            sx={{ mr: 2 }}
            startIcon={<HelpOutlineIcon />}
          >
            FAQ
          </Button>
          <ThemeToggle />
          <Tooltip title="Buy me a coffee">
            <IconButton 
              color="inherit"
              onClick={() => window.open('https://paypal.me/fenghaolw', '_blank')}
            >
              <LocalCafeIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ flex: 1, display: 'flex', flexDirection: 'column', py: { xs: 2, md: 3 } }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
          flex: 1
        }}>
          {/* Input Form - Left Column */}
          <Box sx={{ 
            width: { xs: '100%', md: 300 },
            flexShrink: 0,
            height: CONTENT_HEIGHT
          }}>
            {/* Mobile toggle button */}
            {isMobile && (
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 2, 
                  mb: 2, 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Typography variant="h6">Input Parameters</Typography>
                <IconButton 
                  onClick={() => setInputsExpanded(!inputsExpanded)}
                  size="small"
                >
                  {inputsExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Paper>
            )}
            
            {/* Collapsible input form - forced visible on desktop */}
            <Collapse in={inputsExpanded} timeout="auto">
              <InputForm
                formData={formData}
                isLoading={isLoading}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                onPresetSelect={handlePresetSelect}
                selectedPresetId={selectedPresetId}
              />
            </Collapse>

            {/* Mobile Calculate button outside collapse when inputs are hidden */}
            {isMobile && !inputsExpanded && (
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSubmit}
                disabled={isLoading}
                sx={{ mb: 2 }}
              >
                {isLoading ? 'Calculating...' : 'Calculate'}
              </Button>
            )}
          </Box>
          
          {/* Results Content */}
          {results && (
            <Box sx={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              minWidth: 0,
              height: CONTENT_HEIGHT
            }}>
              {/* Chart - Takes most of the space */}
              <Paper elevation={3} sx={{ 
                p: 3, 
                mb: 3, 
                flex: 3, 
                position: 'relative',
                height: isMobile ? '420px' : '500px', // Fixed height for both mobile and desktop
                overflow: 'hidden',
                minHeight: isMobile ? '420px' : '500px', // Ensure minimum height is maintained even when selected
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Financial Position Comparison</Typography>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    startIcon={<ShareIcon />} 
                    onClick={handleShare}
                  >
                    Share
                  </Button>
                </Box>
                
                {/* Fixed height chart container for consistent sizing */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '60px', // Space for header
                    left: '24px',
                    right: '24px',
                    bottom: '24px',
                    overflow: 'hidden',
                    minHeight: isMobile ? '350px' : '400px', // Minimum height in case of layout shifts
                  }}
                >
                  {/* Chart container with fixed dimensions */}
                  <div id="chart-container" style={{ 
                    width: '100%', 
                    height: '100%',  // Always use 100% and let the parent control sizing
                    pointerEvents: 'auto', // Ensure clicks are captured
                  }}>
                    {chartComponent}
                  </div>
                </Box>
              </Paper>
              
              {/* Summary - Takes less space at the bottom */}
              <Paper elevation={3} sx={{ 
                p: { xs: 2, sm: 2.5 },  // Reduced padding
                flex: 1,
                minHeight: isMobile ? '200px' : '250px', // Ensure summary has stable minimum height
                overflow: 'auto', // Add scrolling if content is too large
                maxHeight: isMobile ? '400px' : '500px', // Limit maximum height to prevent excessive growth
              }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {selectedYearIndex !== null 
                    ? `Year ${results.chartData.labels[selectedYearIndex]}` 
                    : 'Summary'}
                </Typography>
                {summaryComponent}
              </Paper>
            </Box>
          )}
          
          {/* Empty State */}
          {!results && (
            <Box sx={{ 
              flex: 1,
              height: { xs: 300, md: 'auto' }
            }}>
              <Paper elevation={3} sx={{ 
                p: 4, 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <Typography variant="body1" color="text.secondary" align="center">
                  Enter your assumptions and click "Calculate" to see the comparison between renting and buying.
                </Typography>
              </Paper>
            </Box>
          )}
        </Box>
      </Container>

      {/* Snackbar for copy confirmation */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message="URL copied to clipboard!"
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={handleCloseSnackbar}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
} 