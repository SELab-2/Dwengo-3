import { Box, Typography } from '@mui/material';

function FooterBar() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        textAlign: 'center',
        py: 2, // Padding on the y-axis
        width: '100%',
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} Dwengo. All rights reserved.
      </Typography>
      <Typography variant="body2">Contact us: info@dwengo.org</Typography>
    </Box>
  );
}

export default FooterBar;
