import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#6c63ff' },
    secondary: { main: '#43a047' },
    background: { default: '#f4f5fa' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600 },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: { backgroundColor: '#f4f5fa' },
      },
    },
  },
});

export default theme;