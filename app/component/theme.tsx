import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      light: '#fff',
      main: '#039be5',
      dark: '#01579b',
      contrastText: '#000',
    },
    secondary: {
      light: '#cfd8dc',
      main: '#607d8b',
      dark: '#37474f',
      contrastText: '#000',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

export default theme;
