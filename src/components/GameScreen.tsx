import React from 'react';
import { Box, Button, Typography, IconButton, useMediaQuery } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import {
  incrementTeam1Score,
  incrementTeam2Score,
  decrementTeam1Score,
  decrementTeam2Score,
  resetScores,
  incrementTeam1Wins,
  incrementTeam2Wins,
  decrementTeam1Wins,
  decrementTeam2Wins,
} from '../store/gameSlice';
import { palette } from '../theme';

const GameScreen: React.FC = () => {
  const { team1, team2, gameWins } = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();
  const isLandscape = useMediaQuery('(orientation: landscape)');

  // Responsive sizing based on viewport
  const buttonSize = {
    xs: 40,
    sm: 48,
    md: 52,
  };

  const resetButtonSize = {
    xs: 48,
    sm: 56,
    md: 64,
  };

  // Portrait: Vertical split layout
  if (!isLandscape) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100dvh',
          width: '100vw',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Team 1 - Red Top Half */}
        <Box
          data-testid="team1-side"
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: palette.team1.main,
            px: { xs: 1, sm: 2 },
            py: { xs: 2, sm: 3 },
            gap: { xs: 1.5, sm: 2 },
          }}
        >
          <Button
            data-testid="team1-score-area"
            onClick={() => dispatch(incrementTeam1Score())}
            sx={{
              px: 0.5,
              minWidth: 0,
              '&:hover': { backgroundColor: 'transparent' },
            }}
          >
            <Typography data-testid="team1-score" variant="score">
              {team1.score}
            </Typography>
          </Button>
          <IconButton
            data-testid="team1-decrement"
            onClick={() => dispatch(decrementTeam1Score())}
            sx={{
              width: buttonSize,
              height: buttonSize,
              backgroundColor: palette.neutral.buttonOverlay,
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.35)' },
            }}
          >
            <Typography variant="controlText">−</Typography>
          </IconButton>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: { xs: 0.5, sm: 0.75 },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
              <IconButton
                data-testid="team1-wins-decrement"
                aria-label="Decrement team 1 games won"
                onClick={() => dispatch(decrementTeam1Wins())}
                sx={{
                  width: { xs: 28, sm: 32 },
                  height: { xs: 28, sm: 32 },
                  backgroundColor: palette.neutral.buttonOverlay,
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.35)' },
                }}
              >
                <Typography variant="smallButtonText">−</Typography>
              </IconButton>

              <Typography data-testid="team1-wins" variant="gamesText" sx={{ minWidth: { xs: 28, sm: 36 }, textAlign: 'center' }}>
                {gameWins.team1}
              </Typography>

              <IconButton
                data-testid="team1-wins-increment"
                aria-label="Increment team 1 games won"
                onClick={() => dispatch(incrementTeam1Wins())}
                sx={{
                  width: { xs: 28, sm: 32 },
                  height: { xs: 28, sm: 32 },
                  backgroundColor: palette.neutral.buttonOverlay,
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.35)' },
                }}
              >
                <Typography variant="smallButtonText">+</Typography>
              </IconButton>
            </Box>
            <Typography variant="gamesLabel">GAMES WON</Typography>
          </Box>
        </Box>

        {/* Team 2 - Blue Bottom Half */}
        <Box
          data-testid="team2-side"
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: palette.team2.main,
            px: { xs: 1, sm: 2 },
            py: { xs: 2, sm: 3 },
            gap: { xs: 1.5, sm: 2 },
          }}
        >
          <Button
            data-testid="team2-score-area"
            onClick={() => dispatch(incrementTeam2Score())}
            sx={{
              px: 0.5,
              minWidth: 0,
              '&:hover': { backgroundColor: 'transparent' },
            }}
          >
            <Typography data-testid="team2-score" variant="score">
              {team2.score}
            </Typography>
          </Button>
          <IconButton
            data-testid="team2-decrement"
            onClick={() => dispatch(decrementTeam2Score())}
            sx={{
              width: buttonSize,
              height: buttonSize,
              backgroundColor: palette.neutral.buttonOverlay,
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.35)' },
            }}
          >
            <Typography variant="controlText">−</Typography>
          </IconButton>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: { xs: 0.5, sm: 0.75 },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
              <IconButton
                data-testid="team2-wins-decrement"
                aria-label="Decrement team 2 games won"
                onClick={() => dispatch(decrementTeam2Wins())}
                sx={{
                  width: { xs: 28, sm: 32 },
                  height: { xs: 28, sm: 32 },
                  backgroundColor: palette.neutral.buttonOverlay,
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.35)' },
                }}
              >
                <Typography variant="smallButtonText">−</Typography>
              </IconButton>

              <Typography data-testid="team2-wins" variant="gamesText" sx={{ minWidth: { xs: 28, sm: 36 }, textAlign: 'center' }}>
                {gameWins.team2}
              </Typography>

              <IconButton
                data-testid="team2-wins-increment"
                aria-label="Increment team 2 games won"
                onClick={() => dispatch(incrementTeam2Wins())}
                sx={{
                  width: { xs: 28, sm: 32 },
                  height: { xs: 28, sm: 32 },
                  backgroundColor: palette.neutral.buttonOverlay,
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.35)' },
                }}
              >
                <Typography variant="smallButtonText">+</Typography>
              </IconButton>
            </Box>
            <Typography variant="gamesLabel">GAMES WON</Typography>
          </Box>
        </Box>

        {/* Top Controls - Tally Badge */}
        <Box
          data-testid="top-controls-container"
          sx={{
            position: 'absolute',
            top: { xs: 12, sm: 16, md: 24 },
            left: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          <Box
            data-testid="portrait-tally-badge"
            sx={{
              backgroundColor: palette.neutral.overlay,
              px: { xs: 1.5, sm: 2, md: 2.5 },
              py: { xs: 0.5, sm: 0.75, md: 1 },
              borderRadius: { xs: 1.5, sm: 2, md: 2.5 },
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography variant="tallyText">
              {gameWins.team1} - {gameWins.team2}
            </Typography>
          </Box>
        </Box>

        {/* Middle Controls - Reset Button at midline */}
        <Box
          data-testid="middle-controls-container"
          sx={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            zIndex: 5,
          }}
        >
          <IconButton
            data-testid="reset-button"
            onClick={() => dispatch(resetScores())}
            sx={{
              width: resetButtonSize,
              height: resetButtonSize,
              backgroundColor: palette.neutral.overlayLight,
              border: `2px solid rgba(0, 0, 0, 0.1)`,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.95)' },
            }}
          >
            <Typography variant="resetIcon">↻</Typography>
          </IconButton>
        </Box>
      </Box>
    );
  }

  // Landscape: Side-by-side layout
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        height: '100dvh',
        width: '100vw',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Team 1 - Red Side */}
      <Box
        data-testid="team1-side"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: palette.team1.main,
          px: { xs: 1, sm: 2 },
          py: { xs: 2, sm: 3 },
          gap: { xs: 1.5, sm: 2 },
        }}
      >
        <Button
          data-testid="team1-score-area"
          onClick={() => dispatch(incrementTeam1Score())}
          sx={{
            px: 0.5,
            minWidth: 0,
            '&:hover': { backgroundColor: 'transparent' },
          }}
        >
          <Typography data-testid="team1-score" variant="score">
            {team1.score}
          </Typography>
        </Button>
        <IconButton
          data-testid="team1-decrement"
          onClick={() => dispatch(decrementTeam1Score())}
          sx={{
            width: buttonSize,
            height: buttonSize,
            backgroundColor: palette.neutral.buttonOverlay,
            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.35)' },
          }}
        >
          <Typography variant="controlText">−</Typography>
        </IconButton>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: { xs: 0.5, sm: 0.75 },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
            <IconButton
              data-testid="team1-wins-decrement"
              aria-label="Decrement team 1 games won"
              onClick={() => dispatch(decrementTeam1Wins())}
              sx={{
                width: { xs: 28, sm: 32 },
                height: { xs: 28, sm: 32 },
                backgroundColor: palette.neutral.buttonOverlay,
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.35)' },
              }}
            >
              <Typography variant="smallButtonText">−</Typography>
            </IconButton>

            <Typography data-testid="team1-wins" variant="gamesText" sx={{ minWidth: { xs: 28, sm: 36 }, textAlign: 'center' }}>
              {gameWins.team1}
            </Typography>

            <IconButton
              data-testid="team1-wins-increment"
              aria-label="Increment team 1 games won"
              onClick={() => dispatch(incrementTeam1Wins())}
              sx={{
                width: { xs: 28, sm: 32 },
                height: { xs: 28, sm: 32 },
                backgroundColor: palette.neutral.buttonOverlay,
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.35)' },
              }}
            >
              <Typography variant="smallButtonText">+</Typography>
            </IconButton>
          </Box>
          <Typography variant="gamesLabel">GAMES WON</Typography>
        </Box>
      </Box>

      {/* Team 2 - Blue Side */}
      <Box
        data-testid="team2-side"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: palette.team2.main,
          px: { xs: 1, sm: 2 },
          py: { xs: 2, sm: 3 },
          gap: { xs: 1.5, sm: 2 },
        }}
      >
        <Button
          data-testid="team2-score-area"
          onClick={() => dispatch(incrementTeam2Score())}
          sx={{
            px: 0.5,
            minWidth: 0,
            '&:hover': { backgroundColor: 'transparent' },
          }}
        >
          <Typography data-testid="team2-score" variant="score">
            {team2.score}
          </Typography>
        </Button>
        <IconButton
          data-testid="team2-decrement"
          onClick={() => dispatch(decrementTeam2Score())}
          sx={{
            width: buttonSize,
            height: buttonSize,
            backgroundColor: palette.neutral.buttonOverlay,
            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.35)' },
          }}
        >
          <Typography variant="controlText">−</Typography>
        </IconButton>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: { xs: 0.5, sm: 0.75 },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
            <IconButton
              data-testid="team2-wins-decrement"
              aria-label="Decrement team 2 games won"
              onClick={() => dispatch(decrementTeam2Wins())}
              sx={{
                width: { xs: 28, sm: 32 },
                height: { xs: 28, sm: 32 },
                backgroundColor: palette.neutral.buttonOverlay,
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.35)' },
              }}
            >
              <Typography variant="smallButtonText">−</Typography>
            </IconButton>

            <Typography data-testid="team2-wins" variant="gamesText" sx={{ minWidth: { xs: 28, sm: 36 }, textAlign: 'center' }}>
              {gameWins.team2}
            </Typography>

            <IconButton
              data-testid="team2-wins-increment"
              aria-label="Increment team 2 games won"
              onClick={() => dispatch(incrementTeam2Wins())}
              sx={{
                width: { xs: 28, sm: 32 },
                height: { xs: 28, sm: 32 },
                backgroundColor: palette.neutral.buttonOverlay,
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.35)' },
              }}
            >
              <Typography variant="smallButtonText">+</Typography>
            </IconButton>
          </Box>
          <Typography variant="gamesLabel">GAMES WON</Typography>
        </Box>
      </Box>

      {/* Top Controls - Tally Badge */}
      <Box
        data-testid="top-controls-container"
        sx={{
          position: 'absolute',
          left: '50%',
          top: { xs: '15%', sm: '20%', md: '25%' },
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          zIndex: 10,
        }}
      >
        <Box
          data-testid="landscape-tally-badge"
          sx={{
            backgroundColor: palette.neutral.overlay,
            px: { xs: 1.5, sm: 2, md: 2.5 },
            py: { xs: 0.5, sm: 0.75, md: 1 },
            borderRadius: { xs: 1.5, sm: 2, md: 2.5 },
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography variant="tallyText">
            {gameWins.team1} - {gameWins.team2}
          </Typography>
        </Box>
      </Box>

      {/* Middle Controls - Reset Button */}
      <Box
        data-testid="middle-controls-container"
        sx={{
          position: 'absolute',
          left: '50%',
          top: { xs: '40%', sm: '42%', md: '45%' },
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <IconButton
          data-testid="reset-button"
          onClick={() => dispatch(resetScores())}
          sx={{
            width: resetButtonSize,
            height: resetButtonSize,
            backgroundColor: palette.neutral.overlayLight,
            border: `2px solid rgba(0, 0, 0, 0.1)`,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.95)' },
          }}
        >
          <Typography variant="resetIcon">↻</Typography>
        </IconButton>
      </Box>
    </Box>
  );
};

export default GameScreen;
