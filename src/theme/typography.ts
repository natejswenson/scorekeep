import { TypographyOptions } from '@mui/material/styles/createTypography';

export const typography: TypographyOptions = {
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
  ].join(','),
  score: {
    fontSize: '240px',
    fontWeight: 900,
    lineHeight: 1,
    color: '#FFFFFF',
  },
  gamesText: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#FFFFFF',
  },
  gamesLabel: {
    fontSize: '9px',
    fontWeight: 700,
    color: '#FFFFFF',
    letterSpacing: '1.5px',
    opacity: 0.6,
  },
  tallyText: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#333',
    letterSpacing: '1px',
  },
  controlText: {
    fontSize: '36px',
    fontWeight: 700,
    color: '#FFFFFF',
  },
  resetIcon: {
    fontSize: '24px',
    fontWeight: 600,
    color: '#333',
  },
  smallButtonText: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#FFFFFF',
  },
};

declare module '@mui/material/styles' {
  interface TypographyVariants {
    score: React.CSSProperties;
    gamesText: React.CSSProperties;
    gamesLabel: React.CSSProperties;
    tallyText: React.CSSProperties;
    controlText: React.CSSProperties;
    resetIcon: React.CSSProperties;
    smallButtonText: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    score?: React.CSSProperties;
    gamesText?: React.CSSProperties;
    gamesLabel?: React.CSSProperties;
    tallyText?: React.CSSProperties;
    controlText?: React.CSSProperties;
    resetIcon?: React.CSSProperties;
    smallButtonText?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    score: true;
    gamesText: true;
    gamesLabel: true;
    tallyText: true;
    controlText: true;
    resetIcon: true;
    smallButtonText: true;
  }
}
