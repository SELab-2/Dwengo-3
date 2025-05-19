import { Box, Link, Typography } from '@mui/material';

function FooterBar() {
  return (
    <Box
      sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        py: 2,
        width: '100%',
        mt: 'auto',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          maxWidth: '1200px',
          mx: 'auto',
        }}
      >
        <Typography variant="body2" textAlign={'center'}>
          © {new Date().getFullYear()} Dwengo. All rights reserved.
        </Typography>
        <Typography variant="body2" textAlign={'center'}>
          Contact us:{' '}
          <Link href="mailto:info@dwengo.org" color="inherit" underline="always">
            info@dwengo.org
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}

export default FooterBar;
