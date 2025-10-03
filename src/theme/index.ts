import { createTheme } from '@mui/material/styles';
import { palette } from './palette';
import { typography } from './typography';
import { breakpoints } from './breakpoints';
import { components } from './components';

export const theme = createTheme({
  palette: {
    primary: {
      main: palette.team1.main,
    },
    secondary: {
      main: palette.team2.main,
    },
  },
  typography,
  breakpoints,
  components,
});

export { palette };
