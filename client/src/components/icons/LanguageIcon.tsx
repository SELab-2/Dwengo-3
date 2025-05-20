import React, { useState, MouseEvent } from 'react';
import { Menu, MenuItem, IconButton, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import LanguageIcon from '@mui/icons-material/Language';
import { IconSize } from '../../util/size';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation(); // Hook to access and change the language
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // State to control menu open/close
  const theme = useTheme(); // Hook to access the theme

  // Open the menu when the icon is clicked
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Close the menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handle language change
  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang); // Change language
    setAnchorEl(null); // Close the menu after selecting a language
  };

  return (
    <div>
      {/* Language Icon Button to open the language menu */}
      <IconButton onClick={handleClick} color="primary">
        <LanguageIcon
          sx={{
            color: theme.palette.secondary.main,
          }}
        />
      </IconButton>

      {/* Dropdown Menu for Language Selection */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => handleLanguageChange('en')}>English</MenuItem>
        <MenuItem onClick={() => handleLanguageChange('nl')}>Nederlands</MenuItem>
        <MenuItem onClick={() => handleLanguageChange('fr')}>Français</MenuItem>
      </Menu>
    </div>
  );
};

export default LanguageSwitcher;
