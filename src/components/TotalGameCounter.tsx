import React from 'react';
import { Box, Typography } from '@mui/material';

interface TotalGameCounterProps {
  totalGames: number;
}

const TotalGameCounter: React.FC<TotalGameCounterProps> = ({ totalGames }) => {
  const getAccessibilityLabel = () => {
    return `Game ${totalGames} of match`;
  };

  return (
    <Box
      data-testid="total-game-container"
      aria-label={getAccessibilityLabel()}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mb: 1.25,
      }}
    >
      <Typography
        data-testid="total-game-label"
        sx={{
          fontSize: 14,
          color: 'rgba(255, 255, 255, 0.8)',
          mb: 0.25,
        }}
      >
        Game
      </Typography>
      <Typography
        data-testid="total-game-counter"
        sx={{
          fontSize: 28,
          fontWeight: 'bold',
          color: '#FFFFFF',
        }}
      >
        {totalGames}
      </Typography>
    </Box>
  );
};

export default TotalGameCounter;