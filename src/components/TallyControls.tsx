import React from 'react';
import { Box } from '@mui/material';
import TotalGameCounter from './TotalGameCounter';

/**
 * TallyControls - Displays the total game counter
 *
 * This component is a simple wrapper around TotalGameCounter that displays
 * which game is currently being played (calculated as team1Wins + team2Wins + 1).
 *
 * Individual team games won controls are located in the TeamWinsTally components
 * at the bottom of each team's side.
 */
interface TallyControlsProps {
  /** Number of games won by team 1 */
  team1Wins: number;
  /** Number of games won by team 2 */
  team2Wins: number;
}

const TallyControls: React.FC<TallyControlsProps> = ({
  team1Wins,
  team2Wins,
}) => {
  const totalGames = team1Wins + team2Wins + 1;

  return (
    <Box
      data-testid="tally-controls-container"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <TotalGameCounter totalGames={totalGames} />
    </Box>
  );
};

export default TallyControls;