import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    custom: { [key: string]: string };
  }
  interface PaletteOptions {
    custom?: { [key: string]: string };
  }
}

/**
 * Dwengo color palette
 */
const dwengoColors = {
  color1: 'rgb(208, 38, 37)',
  color2: 'rgb(242, 142, 120)',
  color3: 'rgb(250, 182, 60)',
  color4: 'rgb(255, 221, 4)',
  color5: 'rgb(136, 189, 40)',
  color6: 'rgb(74, 146, 52)',
  color7: 'rgb(14, 105, 66)',
  color8: 'rgb(10, 109, 97)',
  color9: 'rgb(9, 111, 128)',
  color10: 'rgb(11, 117, 187)',
  color11: 'rgb(232, 56, 93)',
  color12: 'rgb(226, 43, 65)',
  color13: 'rgb(236, 96, 106)',
  color14: 'rgb(255, 255, 255)',
};

const theme = createTheme({
  palette: {
    primary: {
      main: 'rgb(136, 189, 40)',
    },
    secondary: {
      main: 'rgb(0, 0, 0)',
    },
    background: {
      default: 'rgb(246, 250, 242)',
    },
    text: {
      primary: 'rgb(0, 0, 0)',
      secondary: 'rgb(73, 73, 73)',
    },
    custom: dwengoColors,
  },
});

export default theme;
