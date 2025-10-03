import { Components, Theme } from '@mui/material/styles';
import { palette } from './palette';

export const components: Components<Theme> = {
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        borderRadius: '50%',
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        color: palette.neutral.white,
      },
    },
  },
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        margin: 0,
        padding: 0,
        overflow: 'hidden',
      },
      '#root': {
        width: '100vw',
        height: '100vh',
      },
    },
  },
};
