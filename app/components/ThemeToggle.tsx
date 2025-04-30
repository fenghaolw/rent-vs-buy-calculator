'use client';

import { useState } from 'react';
import { 
  IconButton, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText,
  Tooltip,
  useTheme
} from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import { useColorMode } from '../theme';

export default function ThemeToggle() {
  const theme = useTheme();
  const { mode, setMode, resolvedMode } = useColorMode();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleModeChange = (newMode: 'light' | 'dark' | 'system') => {
    setMode(newMode);
    handleClose();
  };

  // Get current icon based on mode
  const getCurrentIcon = () => {
    if (mode === 'system') {
      return <BrightnessAutoIcon />;
    }
    return resolvedMode === 'light' ? <LightModeIcon /> : <DarkModeIcon />;
  };

  // Get current mode text
  const getCurrentModeText = () => {
    if (mode === 'system') {
      return 'System';
    }
    return mode === 'light' ? 'Light' : 'Dark';
  };

  return (
    <>
      <Tooltip title={`Theme: ${getCurrentModeText()}`}>
        <IconButton
          onClick={handleClick}
          size="small"
          aria-controls={open ? 'theme-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          sx={{ 
            color: theme.palette.mode === 'dark' ? 'primary.light' : 'inherit' 
          }}
        >
          {getCurrentIcon()}
        </IconButton>
      </Tooltip>
      <Menu
        id="theme-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'theme-button',
          dense: true,
        }}
      >
        <MenuItem 
          onClick={() => handleModeChange('light')}
          selected={mode === 'light'}
        >
          <ListItemIcon>
            <LightModeIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Light</ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => handleModeChange('dark')}
          selected={mode === 'dark'}
        >
          <ListItemIcon>
            <DarkModeIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Dark</ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => handleModeChange('system')}
          selected={mode === 'system'}
        >
          <ListItemIcon>
            <SettingsBrightnessIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>System</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
} 