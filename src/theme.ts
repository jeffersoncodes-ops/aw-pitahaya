import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2D6A4F',
      light: '#40916C',
      dark: '#1B4332',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#E07A5F',
      light: '#E8917A',
      dark: '#C0533A',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F8F9FA',
    },
  },
  typography: {
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiAppBar: {
      defaultProps: { color: 'primary' },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontWeight: 400,
        },
      },
    },
  },
});

export default theme;
