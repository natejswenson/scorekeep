import React from 'react';
import { Box, Button, Typography, IconButton } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '@mui/material/styles';
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
import { useIsLandscape } from '../hooks/useOrientation';
import { palette } from '../theme';

const GameScreen: React.FC = () => {
  const { team1, team2, gameWins } = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();
  const isLandscape = useIsLandscape();
  const theme = useTheme();

  const handleIncrementTeam1Wins = () => {
    dispatch(incrementTeam1Wins());
  };

  const handleIncrementTeam2Wins = () => {
    dispatch(incrementTeam2Wins());
  };

  const handleDecrementTeam1Wins = () => {
    dispatch(decrementTeam1Wins());
  };

  const handleDecrementTeam2Wins = () => {
    dispatch(decrementTeam2Wins());
  };

  // Portrait: Vertical split layout
  if (!isLandscape) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          width: '100vw',
          position: 'relative',
        }}
      >
        {/* Team 1 - Red Top Half */}
        <Box
          data-testid="team1-side"
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: palette.team1.main,
            px: 2.5,
            pt: 5,
            pb: 5,
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
              width: 52,
              height: 52,
              backgroundColor: palette.neutral.buttonOverlay,
              mt: -3.375,
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
              mt: 'auto',
              mb: '15%',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.75 }}>
              <IconButton
                data-testid="team1-wins-decrement"
                aria-label="Decrement team 1 games won"
                onClick={handleDecrementTeam1Wins}
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: palette.neutral.buttonOverlay,
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.35)' },
                }}
              >
                <Typography variant="smallButtonText">−</Typography>
              </IconButton>

              <Typography data-testid="team1-wins" variant="gamesText" sx={{ mx: 1.5, minWidth: 36, textAlign: 'center' }}>
                {gameWins.team1}
              </Typography>

              <IconButton
                data-testid="team1-wins-increment"
                aria-label="Increment team 1 games won"
                onClick={handleIncrementTeam1Wins}
                sx={{
                  width: 32,
                  height: 32,
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
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: palette.team2.main,
            px: 2.5,
            pt: 5,
            pb: 5,
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
              width: 52,
              height: 52,
              backgroundColor: palette.neutral.buttonOverlay,
              mt: -3.375,
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
              mt: 'auto',
              mb: '15%',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.75 }}>
              <IconButton
                data-testid="team2-wins-decrement"
                aria-label="Decrement team 2 games won"
                onClick={handleDecrementTeam2Wins}
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: palette.neutral.buttonOverlay,
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.35)' },
                }}
              >
                <Typography variant="smallButtonText">−</Typography>
              </IconButton>

              <Typography data-testid="team2-wins" variant="gamesText" sx={{ mx: 1.5, minWidth: 36, textAlign: 'center' }}>
                {gameWins.team2}
              </Typography>

              <IconButton
                data-testid="team2-wins-increment"
                aria-label="Increment team 2 games won"
                onClick={handleIncrementTeam2Wins}
                sx={{
                  width: 32,
                  height: 32,
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
            top: 24,
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
              px: 2.5,
              py: 1,
              borderRadius: 2.5,
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
              width: 56,
              height: 56,
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

  // Landscape: Minimalist side-by-side layout
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        height: '100vh',
        width: '100vw',
        position: 'relative',
      }}
    >
      {/* Team 1 - Red Side */}
      <Box
        data-testid="team1-side"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: palette.team1.main,
          pt: 5,
          pb: 5,
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
            width: 52,
            height: 52,
            backgroundColor: palette.neutral.buttonOverlay,
            mt: -3.375,
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
            mt: 'auto',
            mb: '15%',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.75 }}>
            <IconButton
              data-testid="team1-wins-decrement"
              aria-label="Decrement team 1 games won"
              onClick={handleDecrementTeam1Wins}
              sx={{
                width: 32,
                height: 32,
                backgroundColor: palette.neutral.buttonOverlay,
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.35)' },
              }}
            >
              <Typography variant="smallButtonText">−</Typography>
            </IconButton>

            <Typography data-testid="team1-wins" variant="gamesText" sx={{ mx: 1.5, minWidth: 36, textAlign: 'center' }}>
              {gameWins.team1}
            </Typography>

            <IconButton
              data-testid="team1-wins-increment"
              aria-label="Increment team 1 games won"
              onClick={handleIncrementTeam1Wins}
              sx={{
                width: 32,
                height: 32,
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
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: palette.team2.main,
          pt: 5,
          pb: 5,
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
            width: 52,
            height: 52,
            backgroundColor: palette.neutral.buttonOverlay,
            mt: -3.375,
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
            mt: 'auto',
            mb: '15%',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.75 }}>
            <IconButton
              data-testid="team2-wins-decrement"
              aria-label="Decrement team 2 games won"
              onClick={handleDecrementTeam2Wins}
              sx={{
                width: 32,
                height: 32,
                backgroundColor: palette.neutral.buttonOverlay,
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.35)' },
              }}
            >
              <Typography variant="smallButtonText">−</Typography>
            </IconButton>

            <Typography data-testid="team2-wins" variant="gamesText" sx={{ mx: 1.5, minWidth: 36, textAlign: 'center' }}>
              {gameWins.team2}
            </Typography>

            <IconButton
              data-testid="team2-wins-increment"
              aria-label="Increment team 2 games won"
              onClick={handleIncrementTeam2Wins}
              sx={{
                width: 32,
                height: 32,
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
          top: '25%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          width: 150,
          zIndex: 10,
        }}
      >
        <Box
          data-testid="landscape-tally-badge"
          sx={{
            backgroundColor: palette.neutral.overlay,
            px: 2.5,
            py: 1,
            borderRadius: 2.5,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography variant="tallyText">
            {gameWins.team1} - {gameWins.team2}
          </Typography>
        </Box>
      </Box>

      {/* Middle Controls - Reset Button in middle area */}
      <Box
        data-testid="middle-controls-container"
        sx={{
          position: 'absolute',
          left: '50%',
          top: '45%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <IconButton
          data-testid="reset-button"
          onClick={() => dispatch(resetScores())}
          sx={{
            width: 56,
            height: 56,
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
