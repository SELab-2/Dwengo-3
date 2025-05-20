import { Box } from '@mui/material';

function DwengoIcon({ href }: { href: string }) {
  return (
    <a href={href}>
      <Box
        component="img"
        src="/dwengo-groen-zwart.svg"
        alt="Dwengo Icon"
        sx={{
          height: { xs: 60, sm: 70, md: 80 }, // Responsive heights in px
          width: 'auto',
          display: 'block',
        }}
      />
    </a>
  );
}

export default DwengoIcon;
