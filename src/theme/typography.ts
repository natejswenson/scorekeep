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
    fontSize: 'clamp(80px, 20vw, 240px)',
    fontWeight: 900,
    lineHeight: 1,
    color: '#FFFFFF',
  },
  gamesText: {
    fontSize: 'clamp(20px, 4vw, 28px)',
    fontWeight: 700,
    color: '#FFFFFF',
  },
  gamesLabel: {
    fontSize: 'clamp(8px, 1.5vw, 10px)',
    fontWeight: 700,
    color: '#FFFFFF',
    letterSpacing: '1.5px',
    opacity: 0.6,
  },
  tallyText: {
    fontSize: 'clamp(14px, 3vw, 18px)',
    fontWeight: 700,
    color: '#333',
    letterSpacing: '1px',
  },
  controlText: {
    fontSize: 'clamp(24px, 5vw, 36px)',
    fontWeight: 700,
    color: '#FFFFFF',
  },
  resetIcon: {
    fontSize: 'clamp(20px, 4vw, 28px)',
    fontWeight: 600,
    color: '#333',
  },
  smallButtonText: {
    fontSize: 'clamp(16px, 3vw, 20px)',
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
