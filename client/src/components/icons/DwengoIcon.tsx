import { Box } from '@mui/material';

function DwengoIcon({ href }: { href: string }) {
  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <a href={href} style={{ height: '100%' }}>
        <img
          src="/dwengo-groen-zwart.svg" // Path to the icon in the public folder
          alt="Dwengo Icon"
          style={{ height: '100%' }} // 75% of the parent container's height
        />
      </a>
    </Box>
  );
}

export default DwengoIcon;
