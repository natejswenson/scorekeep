import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';

// Reduced margin for tighter vertical spacing in landscape mode
const TALLY_MARGIN_TOP = 8;

// Landscape positioning: offset from left/right edges
const LANDSCAPE_TALLY_OFFSET = 10;

// Touch target minimum size for accessibility
const BUTTON_SIZE = 44;

// Spacing between controls
const CONTROL_SPACING = 8;

/**
 * Displays the number of games won by a team with inline increment/decrement controls
 *
 * Layout:
 * - Label: "Games Won" text displayed above controls
 * - Controls: Inline layout with decrement button (-), wins count, and increment button (+)
 * - Width constraint: Control group width never exceeds label width for visual alignment
 *
 * Position behavior:
 * - Portrait mode: Positioned at bottom of team section (default flow)
 * - Landscape mode: Absolutely positioned on left (team1) or right (team2) side,
 *   vertically centered for better space utilization
 *
 * Accessibility:
 * - Minimum 44x44 touch targets for buttons
 * - Proper accessibility labels and roles for screen readers
 * - High contrast white text on team color backgrounds
 */
interface TeamWinsTallyProps {
  /** Team identifier: 'team1' (red) or 'team2' (blue) */
  teamId: 'team1' | 'team2';
  /** Number of games won by the team */
  wins: number;
  /** Whether device is in landscape orientation */
  isLandscape?: boolean;
  /** Handler called when increment button is pressed */
  onIncrement?: () => void;
  /** Handler called when decrement button is pressed */
  onDecrement?: () => void;
}

const TeamWinsTally: React.FC<TeamWinsTallyProps> = ({
  teamId,
  wins,
  isLandscape = false,
  onIncrement,
  onDecrement,
}) => {
  const getAccessibilityLabel = () => {
    const teamName = teamId === 'team1' ? 'Team 1' : 'Team 2';
    const gameText = wins === 1 ? 'game' : 'games';
    return `${teamName} ${gameText} won: ${wins}`;
  };

  const teamNumber = teamId === 'team1' ? '1' : '2';

  // Apply landscape-specific positioning
  const landscapeStyles = isLandscape ? {
    position: 'absolute',
    top: '50%',
    [teamId === 'team1' ? 'left' : 'right']: `${LANDSCAPE_TALLY_OFFSET}px`,
    transform: 'translateY(-40px)',
  } : {};

  return (
    <Box
      data-testid={`${teamId}-wins-container`}
      aria-label={getAccessibilityLabel()}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: `${TALLY_MARGIN_TOP}px`,
        ...landscapeStyles,
      }}
    >
      <Typography
        data-testid={`${teamId}-wins-label`}
        sx={{
          fontSize: 16,
          fontWeight: 'normal',
          mb: 0.5,
          color: '#FFFFFF',
        }}
      >
        Games Won
      </Typography>
      <Box
        data-testid={`${teamId}-wins-controls-container`}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'center',
        }}
      >
        <IconButton
          data-testid={`${teamId}-wins-decrement-button`}
          onClick={onDecrement}
          aria-label={`Decrement team ${teamNumber} games won`}
          sx={{
            minWidth: BUTTON_SIZE,
            minHeight: BUTTON_SIZE,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            },
          }}
        >
          <Typography
            data-testid={`${teamId}-wins-decrement-text`}
            sx={{
              fontSize: 18,
              color: 'rgba(255, 255, 255, 0.8)',
              fontWeight: 'bold',
            }}
          >
            -
          </Typography>
        </IconButton>
        <Typography
          data-testid={`${teamId}-wins-count`}
          sx={{
            fontSize: 24,
            fontWeight: 'bold',
            color: '#FFFFFF',
            textAlign: 'center',
            mx: `${CONTROL_SPACING}px`,
          }}
        >
          {wins}
        </Typography>
        <IconButton
          data-testid={`${teamId}-wins-increment-button`}
          onClick={onIncrement}
          aria-label={`Increment team ${teamNumber} games won`}
          sx={{
            minWidth: BUTTON_SIZE,
            minHeight: BUTTON_SIZE,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            },
          }}
        >
          <Typography
            data-testid={`${teamId}-wins-increment-text`}
            sx={{
              fontSize: 18,
              color: 'rgba(255, 255, 255, 0.8)',
              fontWeight: 'bold',
            }}
          >
            +
          </Typography>
        </IconButton>
      </Box>
    </Box>
  );
};

export default TeamWinsTally;